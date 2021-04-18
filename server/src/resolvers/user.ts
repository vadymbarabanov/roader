import { User } from '../entities/User'
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql'
import argon2 from 'argon2'
import { ErrorType, MyContext } from '../types'
import {
    COOKIE_NAME,
    EMAIL_VALID_REGEX,
    FORGOT_PASSWORD_PREFIX,
} from '../constants'
import { v4 } from 'uuid'
import { sendEmail } from '../utils/sendEmail'
import { isAuth } from '../middleware/isAuth'
import { isObjEmpty } from '../utils/isObjEmpty'

@InputType()
class ProfileInput {
    @Field(() => String, { nullable: true })
    photoUrl?: string

    @Field(() => String, { nullable: true })
    phoneNumber?: string
}

@ObjectType()
class UserResponse {
    @Field(() => User, { nullable: true })
    user?: User

    @Field(() => [ErrorType], { nullable: true })
    errors?: ErrorType[]
}

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        if (req.session.userId !== user.id) {
            return ''
        }
        return user.email
    }

    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext) {
        if (!req.session.userId) {
            return null
        }
        return User.findOne(req.session.userId)
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: 'newPassword',
                        message: 'length must be greater than 2',
                    },
                ],
            }
        }
        const key = FORGOT_PASSWORD_PREFIX + token
        const userId = await redis.get(key)
        if (!userId) {
            return {
                errors: [{ field: 'token', message: 'Token expired' }],
            }
        }

        const userIdNum = parseInt(userId)
        const user = await User.findOne(userIdNum)

        if (!user) {
            return {
                errors: [{ field: 'token', message: 'User no longer exists' }],
            }
        }

        await User.update(
            { id: userIdNum },
            { password: await argon2.hash(newPassword) }
        )

        await redis.del(key)

        // log in user after change password
        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            // email is not in the db
            // do nothing security reasons
            return true
        }

        const token = v4()

        await redis.set(
            FORGOT_PASSWORD_PREFIX + token,
            user.id,
            'ex',
            1000 * 60 * 60 * 24 * 3 // 3 days
        )

        await sendEmail(
            user.email,
            'Change password',
            `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`
        )
        return true
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('username') username: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        let errors: ErrorType[] = []
        if (username.length < 3) {
            errors.push({
                field: 'username',
                message: 'Username should be at least 3 characters',
            })
        }

        if (!EMAIL_VALID_REGEX.test(email)) {
            errors.push({
                field: 'email',
                message: 'Email is invalid',
            })
        }

        if (password.length < 4) {
            errors.push({
                field: 'password',
                message: 'Password should be at least 4 characters',
            })
        }

        if (errors.length > 0) return { errors }

        const hashedPassword = await argon2.hash(password)

        let user: any
        try {
            user = await User.create({
                username,
                email,
                password: hashedPassword,
            }).save()
        } catch (err) {
            if (err.code === '23505') {
                return {
                    errors: [
                        {
                            field: 'email',
                            message:
                                'This email is already registered, try to login',
                        },
                    ],
                }
            }
        }

        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        let errors: ErrorType[] = []

        if (!usernameOrEmail) {
            errors.push({
                field: 'usernameOrEmail',
                message: "Username or Email shouldn't be empty",
            })
        }

        if (!password) {
            errors.push({
                field: 'password',
                message: "Password shouldn't be empty",
            })
        }

        if (errors.length > 0) return { errors }

        const user = await User.findOne(
            EMAIL_VALID_REGEX.test(usernameOrEmail)
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } }
        )

        if (!user) {
            return {
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: 'This user does not exist',
                    },
                ],
            }
        }

        const valid = await argon2.verify(user.password, password)

        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Password is incorrect',
                    },
                ],
            }
        }

        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME)
                if (err) {
                    resolve(false)
                    return
                }
                resolve(true)
            })
        )
    }

    @Query(() => User)
    async getProfile(
        @Arg('username') username: string
    ): Promise<User | undefined> {
        return await User.findOne({ where: { username } })
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async updateProfile(
        @Arg('input') input: ProfileInput,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        if (isObjEmpty(input)) {
            return false
        }

        for (const prop in input) {
            // @ts-ignore
            if (!input[prop]) delete input[prop]
        }

        await User.update({ id: req.session.userId }, { ...input })
        return true
    }
}
