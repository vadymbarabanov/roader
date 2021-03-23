import { Box } from '@chakra-ui/layout'
import React from 'react'

export type WrapperVariant = 'sm' | 'md'

interface WrapperProps {
    variant?: WrapperVariant
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'md' }) => {
    return (
        <Box
            mt={8}
            mx="auto"
            maxW={variant === 'md' ? '800px' : '400px'}
            w="100%">
            {children}
        </Box>
    )
}

export default Wrapper
