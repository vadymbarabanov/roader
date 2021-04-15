import 'dotenv-safe/config'
import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import Redis from 'ioredis'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { COOKIE_AGE, COOKIE_NAME, CORS_ORIGIN, __prod__ } from './constants'
import { BidResolver } from './resolvers/bid'
import { LotResolver } from './resolvers/lot'
import { UserResolver } from './resolvers/user'
import { createUserLoader } from './utils/createUserLoader'

const main = async () => {
    await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: true,
        entities: ['dist/entities/**/*.js'],
        migrations: ['dist/migrations/**/*.js'],
        cli: {
            entitiesDir: 'dist/entities',
            migrationsDir: 'dist/migrations',
        },
    })

    const app = express()

    const RedisStore = connectRedis(session)
    const redis = new Redis(process.env.REDIS_URL)

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
            secret: process.env.SESSION_SECRET as string,
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
            redis,
            userLoader: createUserLoader(),
        }),
    })

    apolloServer.applyMiddleware({
        app,
        cors: false,
    })

    app.listen(process.env.PORT, () => {
        console.log(`Server started on localhost:${process.env.PORT}`)
    })
}

main().catch((err) => console.log(err))
