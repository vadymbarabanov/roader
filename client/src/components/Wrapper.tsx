import { Box } from '@chakra-ui/layout'
import React from 'react'

export type WrapperVariant = 'sm' | 'md' | 'lg'

interface WrapperProps {
    variant?: WrapperVariant
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'md' }) => {
    return (
        <Box
            mt={8}
            mx="auto"
            maxW={
                variant === 'md'
                    ? '768px'
                    : variant === 'sm'
                    ? '400px'
                    : '1024px'
            }
            w="100%">
            {children}
        </Box>
    )
}

export default Wrapper
