import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../models/User";
import { UserRepository } from "../repository/User.repository";
import { BadRequestError, InternalServerError, NotFoundError } from "routing-controllers";
import * as jwt from "jsonwebtoken";
import { UpdateUser } from "../utils/interfaces";
import { UpdateDateColumn } from "typeorm";

@Service()
export class UserService {

    @InjectRepository()
    private readonly userRepository: UserRepository

    async auth (email: User["email"], password: User["password"]) {

        const account = await this.userRepository.findByCredentials(
            email,
            password
        );

        if (!account) throw new BadRequestError("Wrong credentials");

        const token = jwt.sign({
            accountId: account.id
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        const user = {
            id: account.id,
            name: account.name,
            email: account.email,
            provider: account.provider
        }

        return { user, token };
    }

    async createUser (body: User) {
        const user = await this.userRepository.findOne({ where: {
            email: body.email
        }});

        if (user) throw new BadRequestError("User already exists");


        const { id, name, email, provider } = await this.userRepository.save(body);

        return {
            id,
            name,
            email,
            provider
        };
    }

    async updateUser (userId: User["id"], body: UpdateUser) {
        const user = await this.userRepository.findOne(userId);

        if(!user) throw new NotFoundError("User not found");

        if (body.newPassword) {
            if (!body.oldPassword) throw new BadRequestError("Missing password");

            const account = await this.userRepository.findByCredentials(
                user.email,
                body.oldPassword
            );

            if (!account) throw new BadRequestError("Invalid password");

        }

        const updatedBody = {
            id: user.id,
            name: body.name || user.name,
            password: body.newPassword
        }

        if (!body.newPassword) delete updatedBody.password;

        const { id, name } = await this.userRepository.save(this.userRepository.create({
            ...updatedBody
        }));

        return { id , name, provider: user.provider };
    }

    async getProviders() {
        return this.userRepository.find({
            select: [
                "id",
                "name",
                "email",
                "provider",
                "createdAt",
                "updatedAt",
                "avatar"
            ],
            where: {
                provider: true
            },
            relations: ["avatar"],
        });
    }

}
