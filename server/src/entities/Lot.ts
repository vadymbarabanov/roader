import { Field, ObjectType } from 'type-graphql'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@ObjectType()
@Entity()
export class Lot extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => String)
    @Column('text')
    title: string

    @Field(() => String)
    @Column('text')
    description: string

    @Field()
    @Column('int')
    creator_id: number

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.lots)
    creator: User

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}
