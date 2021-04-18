import { Flex, Heading, Link, Text, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { Layout } from 'src/components/Layout'
import { useGetProfileQuery, useMeQuery } from 'src/generated/graphql'

const UserProfile = () => {
    const router = useRouter()
    const { data: medata } = useMeQuery()

    let username = router.query.username
    if (!username) {
        username = medata?.me?.username
    }
    const { data, loading, error } = useGetProfileQuery({
        variables: { username: username as string },
    })

    return (
        <Layout>
            {!data && !loading && error ? (
                <Text>{error.message}</Text>
            ) : data ? (
                <Flex>
                    <Image
                        src={
                            data.getProfile?.photoUrl
                                ? data.getProfile?.photoUrl
                                : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?b=1&k=6&m=1223671392&s=612x612&w=0&h=5VMcL3a_1Ni5rRHX0LkaA25lD_0vkhFsb1iVm1HKVSQ='
                        }
                        alt={`${data.getProfile?.username}'s photo`}
                        boxSize="xs"
                        objectFit="cover"
                        rounded="full"
                        mr={8}
                    />
                    <Flex direction="column">
                        <Heading>{data.getProfile?.username}</Heading>
                        <Link href={`tel:${data.getProfile?.phoneNumber}`}>
                            {data.getProfile?.phoneNumber}
                        </Link>
                    </Flex>
                </Flex>
            ) : null}
        </Layout>
    )
}

export default UserProfile
