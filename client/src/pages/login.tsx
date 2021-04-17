import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Text,
    useToast,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React from 'react'
import InputField from 'src/components/InputField'
import Wrapper from 'src/components/Wrapper'
import { btnPrimary } from 'src/constants/colors'
import { useRouter } from 'next/router'
import { useLoginMutation } from 'src/generated/graphql'
import { toErrorMap } from 'src/utils/toErrorMap'
import NextLink from 'next/link'

const Login: React.FC<{}> = () => {
    const router = useRouter()
    const [login] = useLoginMutation()
    const toast = useToast()

    return (
        <Wrapper variant="sm">
            <Heading mt={8}>Roader: Car Auction</Heading>
            <Heading my={10} size="4xl">
                Login
            </Heading>
            <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({ variables: values })

                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if (response.data?.login.user) {
                        // worked
                        toast({
                            title: `Wellcome back ${response.data.login.user.username}`,
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
                        <InputField
                            name="usernameOrEmail"
                            label="Username or Email"
                        />
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
                            Login
                        </Button>
                        <Flex mt={4} align="center">
                            <Text color="gray">Doesn't have account?</Text>
                            <NextLink href="/register">
                                <Link ml={4}>Register</Link>
                            </NextLink>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Login
