import React from 'react'
import { NavBar } from './NavBar'
import Wrapper, { WrapperVariant } from './Wrapper'

export const Layout: React.FC<{ variant?: WrapperVariant }> = ({
    children,
    variant = 'md',
}) => {
    return (
        <>
            <NavBar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    )
}
