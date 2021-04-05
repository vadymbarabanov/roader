import { ErrorType, MyContext } from '../types'
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql'
import { User } from '../entities/User'
import { isAuth } from '../middleware/isAuth'
import { Bid } from '../entities/Bid'
import { Lot } from '../entities/Lot'

@ObjectType()
class BidResponse {
    @Field(() => Bid, { nullable: true })
    bid?: Bid

    @Field(() => ErrorType, { nullable: true })
    error?: ErrorType
}

@Resolver(Bid)
export class BidResolver {
    @FieldResolver(() => User)
    creator(@Root() bid: Bid, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(bid.creatorId)
    }

    @Query(() => Bid, { nullable: true })
    bid(
        @Arg('lotId', () => Int) lotId: number,
        @Ctx() { req }: MyContext
    ): Promise<Bid | undefined> {
        return Bid.findOne({ where: { lotId, creatorId: req.session.userId } })
    }

    @Query(() => [Bid])
    async bids(@Arg('lotId', () => Int) lotId: number) {
        return await Bid.find({ where: { lotId } })
    }

    @Mutation(() => BidResponse)
    @UseMiddleware(isAuth)
    async createBid(
        @Arg('amount') amount: number,
        @Arg('comment') comment: string,
        @Arg('lotId', () => Int) lotId: number,
        @Ctx() { req }: MyContext
    ): Promise<BidResponse> {
        const userId = req.session.userId
        const lot = await Lot.findOne(lotId)

        if (!lot) {
            return {
                error: {
                    field: 'common',
                    message: 'This Lot is no longer exist',
                },
            }
        }

        if (lot.creatorId === userId) {
            return {
                error: {
                    field: 'common',
                    message: 'You cannot make bids on your own lot',
                },
            }
        }

        const bid = await Bid.create({
            amount,
            comment,
            lotId,
            creatorId: userId,
        }).save()

        return { bid }
    }
}
