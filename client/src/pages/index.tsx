import { Grid, Heading } from '@chakra-ui/react'
import React from 'react'
import { Layout } from 'src/components/Layout'
import { Lot } from 'src/components/Lot'
import { useLotsQuery } from 'src/generated/graphql'

const Index = () => {
    const { data, error } = useLotsQuery()
    let body: any

    if (error) {
        body = <div>{error.message}</div>
    } else {
        body = (
            <Grid templateColumns="repeat(3,1fr)" gap={8} mt={8}>
                {data?.lots.map((data: any) => {
                    return <Lot data={data} />
                })}
            </Grid>
        )
    }

    return (
        <Layout>
            <Heading>Some lots...</Heading>
            {body}
        </Layout>
    )
}

export default Index
