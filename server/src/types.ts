import { Request, Response } from 'express'
import { Redis } from 'ioredis'
import { Field, ObjectType } from 'type-graphql'
import { createUserLoader } from './utils/createUserLoader'

export type MyContext = {
    req: Request & { session: { userId: number } }
    res: Response
    redis: Redis
    userLoader: ReturnType<typeof createUserLoader>
}

@ObjectType()
export class ErrorType {
    @Field()
    field: string

    @Field()
    message: string
}
