import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import Redis from 'ioredis'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import {
    COOKIE_AGE,
    COOKIE_NAME,
    CORS_ORIGIN,
    PORT,
    SESSION_SECRET,
    __prod__,
} from './constants'
import { BidResolver } from './resolvers/bid'
import { LotResolver } from './resolvers/lot'
import { UserResolver } from './resolvers/user'
import { createTypeormConn } from './utils/createTypeormConn'
import { createUserLoader } from './utils/createUserLoader'

const main = async () => {
    await createTypeormConn()

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
            resolvers: [UserResolver, LotResolver, BidResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            userLoader: createUserLoader(),
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
