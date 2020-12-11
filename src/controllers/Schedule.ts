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
    getProviderAppointments (@Req() { user }: any, @QueryParam("date") date: Date) {
        return this.appointmentService.getProviderAppointments(user.id, date);
    }

}
