import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => String)
    @Column('varchar', { length: 255, unique: true })
    email: string

    @Column('text')
    password: string
}
