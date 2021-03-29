import { request } from 'graphql-request'
import { User } from '../entities/User'
import { HOST } from '../constants'
import { createTypeormConn } from '../utils/createTypeormConn'
import argon2 from 'argon2'
import { registerMutation, loginMutation, logoutMutation } from './mutations'

let conn: any

beforeAll(async () => {
    conn = await createTypeormConn()
})

afterAll(async () => {
    await conn.close()
})

const email = 'test@test.com'
const password = 'test'

test('Register user', async () => {
    const response = await request(HOST, registerMutation, { email, password })
    expect(response).toEqual({
        register: { user: { email }, error: null },
    })

    const users = await User.find({ where: { email } })
    expect(users).toHaveLength(1)

    const user = users[0]
    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)
})

test('Login user', async () => {
    const response = await request(HOST, loginMutation, { email, password })
    expect(response).toEqual({
        login: { user: { email }, error: null },
    })

    const users = await User.find({ where: { email } })
    expect(users).toHaveLength(1)

    const user = users[0]
    expect(user.email).toEqual(email)

    const isValid = await argon2.verify(user.password, password)
    expect(isValid).toBeTruthy()
})

test('Logout user', async () => {
    await request(HOST, loginMutation, { email, password })
    const response = await request(HOST, logoutMutation)
    expect(response).toEqual({ logout: true })
})
