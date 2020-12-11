import { JsonController, Get, UseBefore, Req, QueryParam, Param } from "routing-controllers";
import { AuthMiddleware } from "../middlewares/authentication";
import { AppointmentService } from "../services/Appointment.service";
import { UserService } from "../services/User.service";

@UseBefore(AuthMiddleware)
@JsonController("/providers")
export class ProviderController {

    constructor(
        private readonly userService: UserService,
        private readonly appointmentService: AppointmentService
    ) { }

    @Get()
    getProviders () {
        return this.userService.getProviders();
    }

    @Get("/:providerId/available")
    getAvailableHours (@Param("providerId") providerId: string, @QueryParam("date") date: Date) {
        return this.appointmentService.getAvailableHours(providerId, date);
    }

}
