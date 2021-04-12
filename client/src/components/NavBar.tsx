import { Flex, Link, Heading, Box, Button } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { bgPrimary, btnPrimary } from '../constants/colors'

export const NavBar: React.FC = () => {
    const body = <Button colorScheme={btnPrimary}>Click</Button>

    return (
        <Flex zIndex={999} position="sticky" top={0} bgColor={bgPrimary} p={4}>
            <Flex maxW="800px" align="center" flex={1} m="auto">
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
