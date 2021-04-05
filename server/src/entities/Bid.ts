import { Field, Float, Int, ObjectType } from 'type-graphql'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Lot } from './Lot'
import { User } from './User'

@ObjectType()
@Entity()
export class Bid extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => Float)
    @Column('float')
    amount!: number

    @Field(() => String)
    @Column('text', { default: '' })
    comment: string

    @Field(() => Int)
    @Column('int')
    creatorId!: number

    @Field(() => Int)
    @Column('int')
    lotId!: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.bids)
    creator: User

    @Field(() => Lot)
    @ManyToOne(() => Lot, (lot) => lot.bids)
    lot: Lot

    @Field()
    @CreateDateColumn()
    createdAt!: Date

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date
}
