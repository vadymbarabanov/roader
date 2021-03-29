import { gql, request } from 'graphql-request'
import { User } from '../entities/User'
import { HOST } from '../constants'
import { createTypeormConn } from '../utils/createTypeormConn'

beforeAll(async () => {
    await createTypeormConn()
})

const email = 'test@test.com'
const password = 'test'

const mutation = gql`
    mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
            user {
                email
            }
            error {
                field
                message
            }
        }
    }
`

test('Register user', async () => {
    const response = await request(HOST, mutation, { email, password })
    expect(response).toEqual({
        register: { user: { email }, error: null },
    })

    const users = await User.find({ where: { email } })
    expect(users).toHaveLength(1)

    const user = users[0]
    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)
})
