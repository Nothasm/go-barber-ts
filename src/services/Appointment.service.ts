import { User } from "../models/User";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/User.repository";
import { AppointmentRepository } from "../repository/Appointment.repository";
import { CreateAppointment } from "../utils/interfaces";
import { BadRequestError } from "routing-controllers";
import * as moment from "moment";

@Service()
export class AppointmentService {

    @InjectRepository()
    private readonly appointmentRepository: AppointmentRepository

    @InjectRepository()
    private readonly userRepository: UserRepository

    async createAppointment(userId: User["id"], { providerId, date }: CreateAppointment) {
        const isProvider = await this.userRepository.findOne({
            where: {
                id: providerId,
                provider: true
            }
        });

        if (!isProvider) throw new BadRequestError("You can only create appointments with providers");

        const startHour = moment(date).startOf("hour").toDate();

        if (moment(startHour).isBefore(new Date())) throw new BadRequestError("Past dates are not available");

        const hasAppointment = await this.appointmentRepository.findOne({
            where: {
                provider: providerId,
                date: startHour,
                canceledAt: null
            }
        });

        if (hasAppointment) throw new BadRequestError("Appointment date not available")

        const appointment = await this.appointmentRepository.save({
            user: userId,
            provider: providerId,
            date: startHour
        });

        return appointment;
    }

}
