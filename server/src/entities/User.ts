import { Field, ObjectType } from 'type-graphql'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Bid } from './Bid'
import { Lot } from './Lot'

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column('varchar', { length: 255, unique: true })
    username!: string

    @Field(() => String)
    @Column('varchar', { length: 255, unique: true })
    email!: string

    @Column('text')
    password!: string

    @Field(() => String, { nullable: true })
    @Column('varchar', { length: 255, nullable: true })
    photoUrl: string

    @OneToMany(() => Lot, (lot) => lot.creator)
    lots: Lot[]

    @OneToMany(() => Bid, (bid) => bid.creator)
    bids: Bid[]

    @Field()
    @CreateDateColumn()
    createdAt!: Date

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date
}
