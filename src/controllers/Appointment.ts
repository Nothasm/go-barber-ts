import { JsonController, Post, Body, UseBefore, Req } from "routing-controllers";
import { AuthMiddleware } from "../middlewares/authentication";
import { AppointmentService } from "../services/Appointment.service";
import { CreateAppointment } from "../utils/interfaces";

@UseBefore(AuthMiddleware)
@JsonController("/appointments")
export class AppointmentController {

    constructor(
        private readonly appointmentService:  AppointmentService
    ) { }

    @Post()
    createAppointment (@Req() { user }: any, @Body() body: CreateAppointment) {
        return this.appointmentService.createAppointment(user.id, body);
    }

}
