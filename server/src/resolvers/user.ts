import { User } from '../entities/User'
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
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

@ObjectType()
class UserResponse {
    @Field(() => User, { nullable: true })
    user?: User

    @Field(() => ErrorType, { nullable: true })
    error?: ErrorType
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
                error: {
                    field: 'newPassword',
                    message: 'length must be greater than 2',
                },
            }
        }
        const key = FORGOT_PASSWORD_PREFIX + token
        const userId = await redis.get(key)
        if (!userId) {
            return {
                error: { field: 'token', message: 'Token expired' },
            }
        }

        const userIdNum = parseInt(userId)
        const user = await User.findOne(userIdNum)

        if (!user) {
            return {
                error: { field: 'token', message: 'User no longer exists' },
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
        if (!email || !password) {
            return {
                error: {
                    field: 'common',
                    message: 'Email or (and) Password are invalid',
                },
            }
        }

        // anystring@anystring.anystring is valid
        if (!EMAIL_VALID_REGEX.test(email)) {
            return {
                error: {
                    field: 'email',
                    message: 'Email is invalid',
                },
            }
        }

        if (password.length < 4) {
            return {
                error: {
                    field: 'password',
                    message: 'Password should be at least 4 characters',
                },
            }
        }

        if (username.length < 3) {
            return {
                error: {
                    field: 'username',
                    message: 'Username should be at least 3 characters',
                },
            }
        }

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
                    error: {
                        field: 'email',
                        message:
                            'This email is already registered, try to login',
                    },
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
        if (!usernameOrEmail || !password) {
            return {
                error: {
                    field: 'common',
                    message: 'Email or (and) Password are invalid',
                },
            }
        }

        const user = await User.findOne(
            EMAIL_VALID_REGEX.test(usernameOrEmail)
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } }
        )

        if (!user) {
            return {
                error: {
                    field: 'usernameOrEmail',
                    message: 'This user does not exist',
                },
            }
        }

        const valid = await argon2.verify(user.password, password)

        if (!valid) {
            return {
                error: {
                    field: 'common',
                    message: 'Email or (and) Password are incorrect',
                },
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
}
