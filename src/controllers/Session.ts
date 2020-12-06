import { JsonController, Post, Body } from "routing-controllers";
import { Login } from "../interfaces/interfaces";
import { UserService } from "../services/User.service";

@JsonController("/sessions")
export class SessionController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Post()
    authorize(@Body() account: Login) {
        return this.userService.auth(account.email, account.password);
    }

}
