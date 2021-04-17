import { Box, Button, Heading, useToast } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import React from 'react'
import InputField from 'src/components/InputField'
import { Layout } from 'src/components/Layout'
import { btnPrimary } from 'src/constants/colors'
import { useChangePhotoMutation } from 'src/generated/graphql'

const Settings: React.FC<{}> = () => {
    const [changePhoto] = useChangePhotoMutation()
    const toast = useToast()

    return (
        <Layout>
            <Heading mb={4}>Settings</Heading>

            <Formik
                initialValues={{ photoUrl: '' }}
                onSubmit={async (values, { resetForm }) => {
                    const response = await changePhoto({
                        variables: { photoUrl: values.photoUrl },
                    })

                    if (response.data?.changePhoto.valueOf()) {
                        toast({
                            title: 'Successfully changed!',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                            position: 'top',
                        })

                        resetForm()
                    } else {
                        toast({
                            title: 'Something wrong :c',
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                            position: 'top',
                        })
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box maxW="lg">
                            <InputField
                                name="photoUrl"
                                label="Photo URL"
                                placeholder="https://photo.com/me"
                            />
                        </Box>
                        <Button
                            mt={4}
                            isLoading={isSubmitting}
                            type="submit"
                            colorScheme={btnPrimary}>
                            Change Photo
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}

export default Settings
