import { User } from '../entities/User'
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql'
import argon2 from 'argon2'
import { MyContext } from '../types'
import { COOKIE_NAME } from '../constants'

@ObjectType()
class ErrorType {
    @Field()
    field!: string
    @Field()
    message!: string
}

@ObjectType()
class UserResponse {
    @Field(() => User, { nullable: true })
    user?: User

    @Field(() => ErrorType, { nullable: true })
    error?: ErrorType
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext) {
        if (!req.session.userId) {
            return null
        }
        return User.findOne(req.session.userId)
    }

    @Mutation(() => UserResponse)
    async register(
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

        const hashedPassword = await argon2.hash(password)

        let user: any
        try {
            user = await User.create({
                email,
                password: hashedPassword,
            }).save()
        } catch (err) {
            if (err.code === '23505') {
                return {
                    error: {
                        field: 'email',
                        message: 'This email is already registered',
                    },
                }
            }
        }

        req.session.userId = user.id

        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
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

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return {
                error: {
                    field: 'email',
                    message: 'This email is not registred',
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
