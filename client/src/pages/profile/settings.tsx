import { Box, Button, Heading, useToast, Text } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import React from 'react'
import InputField from 'src/components/InputField'
import { Layout } from 'src/components/Layout'
import { btnPrimary } from 'src/constants/colors'
import { useMeQuery, useUdpateProfileMutation } from 'src/generated/graphql'

const Settings: React.FC<{}> = () => {
    const { data, loading, error } = useMeQuery()
    const [updateProfile] = useUdpateProfileMutation()
    const toast = useToast()

    let body: any
    if (!data && !loading && error) {
        body = <Text>{error.message}</Text>
    } else {
        body = (
            <Formik
                initialValues={{ photoUrl: '', phoneNumber: '' }}
                onSubmit={async (values, { resetForm }) => {
                    const response = await updateProfile({
                        variables: { input: values },
                    })

                    if (response.data?.updateProfile.valueOf()) {
                        toast({
                            title: 'Profile updated!',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                            position: 'top',
                        })

                        resetForm()
                    } else {
                        toast({
                            title: 'Something goes wrong :c',
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                            position: 'top',
                        })
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box maxW="md">
                            <Box mb={4}>
                                <InputField
                                    name="photoUrl"
                                    label="Photo URL"
                                    placeholder="https://photo.com/me"
                                />
                            </Box>
                            <InputField
                                type="tel"
                                name="phoneNumber"
                                label="Phone Number"
                                placeholder="+380631234567"
                            />
                        </Box>
                        <Button
                            mt={4}
                            isLoading={isSubmitting}
                            type="submit"
                            colorScheme={btnPrimary}>
                            Save
                        </Button>
                    </Form>
                )}
            </Formik>
        )
    }

    return (
        <Layout>
            <Heading mb={4}>Settings</Heading>
            {body}
        </Layout>
    )
}

export default Settings
