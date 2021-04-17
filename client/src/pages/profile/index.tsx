import React from 'react'
import { Layout } from 'src/components/Layout'
import { useMeQuery } from 'src/generated/graphql'
import { Heading, Image, Text } from '@chakra-ui/react'

const Profile: React.FC<{}> = () => {
    const { data, loading, error } = useMeQuery()

    return (
        <Layout>
            {!data && !loading && error ? (
                <Text>{error.message}</Text>
            ) : data ? (
                <>
                    <Image
                        src={
                            data.me?.photoUrl
                                ? data.me?.photoUrl
                                : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?b=1&k=6&m=1223671392&s=612x612&w=0&h=5VMcL3a_1Ni5rRHX0LkaA25lD_0vkhFsb1iVm1HKVSQ='
                        }
                        maxW="2xs"
                        alt={`${data.me?.username}'s photo`}
                    />
                    <Heading>{data.me?.username}</Heading>
                </>
            ) : null}
        </Layout>
    )
}

export default Profile
