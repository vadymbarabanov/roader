import { Lot } from '../entities/Lot'
import { MyContext } from '../types'
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql'
import { User } from '../entities/User'
import { isAuth } from '../middleware/isAuth'

@InputType()
class LotInput {
    @Field()
    title: string

    @Field()
    description: string
}

@Resolver(Lot)
export class LotResolver {
    @FieldResolver(() => String)
    descriptionSnippet(@Root() root: Lot) {
        return root.description.slice(0, 50)
    }

    @FieldResolver(() => User)
    creator(@Root() lot: Lot, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(lot.creatorId)
    }

    @Query(() => Lot, { nullable: true })
    async getLot(@Arg('id', () => Int) id: number): Promise<Lot | undefined> {
        return await Lot.findOne(id)
    }

    @Query(() => [Lot])
    @UseMiddleware(isAuth)
    async mylots(@Ctx() { req }: MyContext) {
        return await Lot.find({ where: { id: req.session.userId } })
    }

    @Query(() => [Lot])
    async lots() {
        return await Lot.find()
    }

    @Mutation(() => Lot)
    @UseMiddleware(isAuth)
    async createLot(
        @Arg('input') input: LotInput,
        @Ctx() { req }: MyContext
    ): Promise<Lot> {
        return await Lot.create({
            ...input,
            creatorId: req.session.userId,
        }).save()
    }
}
