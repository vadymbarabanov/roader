import { Grid, useToast, Text } from '@chakra-ui/react'
import React from 'react'
import { Layout } from 'src/components/Layout'
import { Lot } from 'src/components/Lot'
import { useLotsQuery } from 'src/generated/graphql'

const Index = () => {
    const { data, error, loading } = useLotsQuery()
    const toast = useToast()
    let body: any

    if (!loading && !data && error) {
        toast({
            title: 'Whoops, server error :c',
            description: 'Try to reload page',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top',
        })
        body = <Text>{error.message}</Text>
    } else {
        body = (
            <Grid templateColumns="repeat(3,1fr)" gap={8} mt={8}>
                {data?.lots.map((data: any) => {
                    return <Lot data={data} />
                })}
            </Grid>
        )
    }

    return <Layout>{body}</Layout>
}

export default Index
