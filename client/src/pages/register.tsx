import { Box, Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React from 'react'
import InputField from 'src/components/InputField'
import Wrapper from 'src/components/Wrapper'
import { btnPrimary } from 'src/constants/colors'
import { useRouter } from 'next/router'
import { useRegisterMutation } from 'src/generated/graphql'

const Register: React.FC<{}> = () => {
    const router = useRouter()
    const [register] = useRegisterMutation()

    return (
        <Wrapper variant="sm">
            <Heading my={8}>Roader: Car Auction</Heading>
            <Formik
                initialValues={{ email: '', username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ variables: values })
                    if (!response.data?.register.user) {
                        // TODO: make a toErrorMap func
                        setErrors({
                            email: response.data?.register.error?.message,
                        })
                    } else if (response.data?.register.user) {
                        // worked
                        router.push('/')
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            label="Username"
                            placeholder="johnsnow"
                        />
                        <Box mt={4}>
                            <InputField
                                name="email"
                                label="Email"
                                placeholder="john@snow.com"
                            />
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
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Register
