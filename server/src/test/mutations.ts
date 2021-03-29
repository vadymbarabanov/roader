import { gql } from 'apollo-server-express'

export const registerMutation = gql`
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

export const loginMutation = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
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

export const logoutMutation = gql`
    mutation {
        logout
    }
`
