import {
    Box,
    Button,
    Flex,
    Heading,
    useToast,
    Text,
    Link,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React from 'react'
import InputField from 'src/components/InputField'
import Wrapper from 'src/components/Wrapper'
import { btnPrimary } from 'src/constants/colors'
import { useRouter } from 'next/router'
import { useRegisterMutation } from 'src/generated/graphql'
import { toErrorMap } from 'src/utils/toErrorMap'
import NextLink from 'next/link'

const Register: React.FC<{}> = () => {
    const router = useRouter()
    const [register] = useRegisterMutation()
    const toast = useToast()

    return (
        <Wrapper variant="sm">
            <Heading my={8}>Roader: Car Auction</Heading>
            <Heading my={10} size="4xl">
                Register
            </Heading>
            <Formik
                initialValues={{ email: '', username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ variables: values })
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data?.register.errors))
                    } else if (response.data?.register.user) {
                        // worked
                        toast({
                            title: 'You are successfully registered!',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                            position: 'top',
                        })
                        router.push('/')
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" label="Username" />
                        <Box mt={4}>
                            <InputField name="email" label="Email" />
                        </Box>
                        <Box mt={4}>
                            <InputField
                                name="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button
                            mt={4}
                            isLoading={isSubmitting}
                            type="submit"
                            colorScheme={btnPrimary}>
                            Register
                        </Button>
                        <Flex mt={4} align="center">
                            <Text color="gray">Already have account?</Text>
                            <NextLink href="/login">
                                <Link ml={4}>Login</Link>
                            </NextLink>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Register
