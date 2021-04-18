import { Heading, Link, Text } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import { Layout } from 'src/components/Layout'
import { useGetLotQuery } from 'src/generated/graphql'
import NextLink from 'next/link'

const Lot = () => {
    const router = useRouter()
    const lotId =
        typeof router.query.id === 'string'
            ? parseInt(router.query.id as string)
            : -1

    const { data } = useGetLotQuery({ variables: { id: lotId } })

    return (
        <Layout>
            <Heading>{data?.getLot?.title}</Heading>
            <Text>{data?.getLot?.description}</Text>
            <NextLink href={`/profile/${data?.getLot?.creator.username}`}>
                <Link>{data?.getLot?.creator.username}</Link>
            </NextLink>
        </Layout>
    )
}
export default Lot
