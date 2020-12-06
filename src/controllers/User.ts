import { JsonController, Post, Body, Put, UseBefore, Req } from "routing-controllers";
import { UpdateUser } from "../utils/interfaces";
import { AuthMiddleware } from "../middlewares/authentication";
import { User } from "../models/User";
import { UserService } from "../services/User.service";

@UseBefore(AuthMiddleware)
@JsonController("/user")
export class UserController {

    constructor(
        private readonly accountService: UserService
    ) { }

    @Post()
    create(@Body() user: User) {
        return this.accountService.createUser(user);
    }

    @Put()
    update(@Req() { user }: any, @Body() body: UpdateUser) {
        return this.accountService.updateUser(user.id, body);
    }

}
