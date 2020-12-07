import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,  ManyToOne, JoinColumn } from "typeorm";
import { IsOptional, IsDateString } from "class-validator";
import { User } from "./User";

@Entity()
export class Appointment {

    @IsOptional()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsDateString()
    @Column()
    date: Date

    @IsDateString()
    @Column({ default: null })
    canceledAt: Date

    @ManyToOne(() => User, user => user.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn()
    user: string

    @ManyToOne(() => User, user => user.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn()
    provider: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}