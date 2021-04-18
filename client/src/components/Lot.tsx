import { Text, Box, Image, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { ArrowUpIcon } from '@chakra-ui/icons'

export const Lot: React.FC<any> = ({ data }) => {
    // Sample card from Airbnb

    const property = {
        imageUrl: 'https://bit.ly/2Z4KKcF',
        imageAlt: data.title,
        formattedPrice: data.highestBid,
    }

    return (
        <Box
            maxW="sm"
            borderWidth="2px"
            borderRadius="lg"
            overflow="hidden"
            shadow="md">
            <Image src={property.imageUrl} alt={property.imageAlt} />

            <Box p="6">
                <Box>
                    {data.highestBid ? (
                        <Text fontSize="lg">
                            <ArrowUpIcon /> ${data.highestBid}
                        </Text>
                    ) : (
                        <Text fontSize="md">No bids</Text>
                    )}
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated>
                    {data.title}
                </Box>

                <NextLink href={`/profile/${data.creator.username}`}>
                    <Link>{data.creator.username}</Link>
                </NextLink>
            </Box>
        </Box>
    )
}
