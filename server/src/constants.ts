export const __prod__ = process.env.NODE_ENV === 'production'
export const PORT = 4000
export const CORS_ORIGIN = 'http://localhost:3000'
export const COOKIE_NAME = 'qid'
export const COOKIE_AGE = 1000 * 60 * 60 * 24 * 365 // one year
export const SESSION_SECRET = 'Thequickbrownfoxjumpsoverthelazydog'
export const EMAIL_VALID_REGEX = /^\S+@\S+\.\S+$/

// host for jest
export const HOST = 'http://localhost:4000/graphql'
