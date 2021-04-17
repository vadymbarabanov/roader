import { StarIcon } from '@chakra-ui/icons'
import { Badge, Box, Image } from '@chakra-ui/react'
import React from 'react'

export const Lot: React.FC<any> = ({ data }) => {
    // Sample card from Airbnb

    const property = {
        imageUrl: 'https://bit.ly/2Z4KKcF',
        imageAlt: data.title,
        beds: 3,
        baths: 2,
        title: data.title,
        formattedPrice: '$1,900.00',
        reviewCount: 0,
        rating: 4,
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
                    <Box as="span" color="gray.500">
                        Bid{' '}
                    </Box>
                    {property.formattedPrice}
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated>
                    {property.title}
                </Box>
            </Box>
        </Box>
    )
}
