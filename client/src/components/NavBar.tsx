import { Flex, Link, Heading, Box, Button, Text } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { bgPrimary, btnPrimary, btnSecondary } from '../constants/colors'
import { useLogoutMutation, useMeQuery } from 'src/generated/graphql'
import { useRouter } from 'next/router'

export const NavBar: React.FC = () => {
    const router = useRouter()
    const [logout] = useLogoutMutation()
    const { data } = useMeQuery()

    let body: any
    if (!data?.me) {
        body = (
            <Flex>
                <NextLink href="/login">
                    <Button colorScheme={btnPrimary}>Sign In</Button>
                </NextLink>
                <NextLink href="/register">
                    <Button ml={2} colorScheme={btnSecondary}>
                        Sign Up
                    </Button>
                </NextLink>
            </Flex>
        )
    } else {
        body = (
            <Flex align="center">
                <Text fontWeight="semibold" mr={4}>
                    {data.me.username}
                </Text>
                <Button
                    size="sm"
                    onClick={async () => {
                        await logout()
                        router.push('/login')
                    }}>
                    Logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex zIndex={999} position="sticky" top={0} bgColor={bgPrimary} p={4}>
            <Flex maxW="1024px" align="center" flex={1} m="auto">
                <NextLink href="/">
                    <Link>
                        <Heading size="lg">Roader: Car Auction</Heading>
                    </Link>
                </NextLink>
                <Box ml="auto">{body}</Box>
            </Flex>
        </Flex>
    )
}
