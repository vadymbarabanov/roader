import { Field, Float, Int, ObjectType } from 'type-graphql'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Bid } from './Bid'
import { User } from './User'

@ObjectType()
@Entity()
export class Lot extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column('text')
    title!: string

    @Field(() => String)
    @Column('text')
    description!: string

    @Field()
    @Column('int')
    creatorId!: number

    @Field(() => Float, { nullable: true })
    @Column('float', { nullable: true })
    highestBid: number

    @Field(() => [Bid])
    @OneToMany(() => Bid, (bid) => bid.creator)
    bids: Bid[]

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.lots)
    creator: User

    @Field()
    @CreateDateColumn()
    createdAt!: Date

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date
}
