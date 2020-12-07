import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, AfterLoad } from "typeorm";

@Entity()
export class File {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    path: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @AfterLoad()
    formUrl () {
        this.path = `http://localhost:3000/files/${this.path}`;
    }
}