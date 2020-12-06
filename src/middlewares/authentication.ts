import { ExpressMiddlewareInterface, UnauthorizedError } from "routing-controllers";
import { UserRepository } from "../repository/User.repository";
import { InjectRepository } from "typeorm-typedi-extensions";

const getToken = (str = "") => str.replace("Bearer ", "");

export class AuthMiddleware implements ExpressMiddlewareInterface {

    @InjectRepository()
    private readonly userRepository: UserRepository

    async use(req: any, res: any, next?: (err?: any) => any) {
        try {
            if (req.route.path === "/user" && req.route.methods.post)
                return next();

            const token = getToken(req.get("Authorization"));
            if (!token) throw new UnauthorizedError("Authorization header not set");

            const user = await this.userRepository.findByToken(token).catch(e => {
                return null;
            });

            if (!user) throw new UnauthorizedError("Authorization token is invalid");

            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    }

}
