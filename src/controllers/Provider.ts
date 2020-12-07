import { JsonController, Post, Body, Get } from "routing-controllers";
import { UserService } from "../services/User.service";

@JsonController("/providers")
export class ProviderController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    getProviders () {
        return this.userService.getProviders();
    }

}
