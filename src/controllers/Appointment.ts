import { JsonController, Post, Body, UseBefore, Req, Get, QueryParam, Delete, Param } from "routing-controllers";
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

    @Get()
    getAppointments (@Req() { user }: any, @QueryParam("page") page: number) {
        return this.appointmentService.getAppointments(user.id, page);
    }

    @Delete("/:id")
    cancelAppointment (@Req() { user }: any, @Param("id") id: string) {
        return this.appointmentService.cancelAppointment(user.id, id);
    }

}
