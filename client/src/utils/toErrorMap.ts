import { ErrorType } from '../generated/graphql'

export const toErrorMap = (errors: ErrorType[]) => {
    const errorMap: Record<string, string> = {}
    errors.forEach(({ field, message }) => {
        errorMap[field] = message
    })
    return errorMap
}
