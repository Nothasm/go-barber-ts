import { JsonController, Post, Body, Get, QueryParam, Req, UseBefore } from "routing-controllers";
import { AuthMiddleware } from "../middlewares/authentication";
import { AppointmentService } from "../services/Appointment.service";

@UseBefore(AuthMiddleware)
@JsonController("/schedules")
export class ScheduleController {

    constructor(
        private readonly appointmentService: AppointmentService
    ) { }

    @Get()
    getProviders (@Req() { user }: any, @QueryParam("date") date: Date) {
        console.log(user);
        return this.appointmentService.getProviderAppointments(user.id, date);
    }

}
