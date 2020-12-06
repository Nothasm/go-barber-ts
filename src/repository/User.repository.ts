import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";
import { Service } from "typedi";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findByToken (token: string): Promise<User> {
        const decoded: {
            accountId: string
        } = jwt.verify(token, process.env.JWT_SECRET) as any;

        const user = await this.findOne(decoded.accountId);
        delete user.password;
        return user;
    }

   async findByCredentials (email: string, password: string): Promise<User | null> {
        const user: User = await this.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }

        return user;
    }

}