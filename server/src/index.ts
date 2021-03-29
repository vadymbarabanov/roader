import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import {
    COOKIE_AGE,
    COOKIE_NAME,
    CORS_ORIGIN,
    PORT,
    SESSION_SECRET,
    __prod__,
} from './constants'

const main = async () => {
    await createConnection()

    const app = express()

    const RedisStore = connectRedis(session)
    const redis = new Redis()

    app.use(cors({ origin: CORS_ORIGIN, credentials: true }))
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: COOKIE_AGE,
                httpOnly: true, // cannot access cookie from js (front end)
                secure: __prod__, // cookie only works in https
                sameSite: 'lax', // csrf
            },
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    })

    apolloServer.applyMiddleware({
        app,
        cors: false,
    })

    app.listen(PORT, () => {
        console.log(`Server started on localhost:${PORT}`)
    })
}

main().catch((err) => console.log(err))
