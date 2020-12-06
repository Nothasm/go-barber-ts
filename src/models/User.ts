import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, BeforeInsert, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { IsOptional, IsString, IsEmail, IsBoolean } from "class-validator";
import * as bcrypt from "bcryptjs";
import { File } from "../models/File";

@Entity()
export class User {

    @IsOptional()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @IsString()
    @Column({ nullable: false })
    name: string;

    @IsEmail()
    @Column({ unique: true, nullable: false })
    email: string;

    @IsString()
    @Column({ nullable: false })
    password: string;

    @IsBoolean()
    @IsOptional()
    @Column({ default: false })
    provider: boolean

    @ManyToOne(() => File, file => file.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    avatar: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(this.password, salt);
            this.password = passwordHash;
        }
    }
}