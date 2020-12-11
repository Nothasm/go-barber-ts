import { User } from "../models/User";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/User.repository";
import { AppointmentRepository } from "../repository/Appointment.repository";
import { CreateAppointment } from "../utils/interfaces";
import { BadRequestError } from "routing-controllers";
import * as moment from "moment";
import { Between } from "typeorm";
import { sendNotification } from "../utils";
import { Appointment } from "../models/Appointment";
import Queue from "../utils/queue";
import CancellationMail from "../jobs/CancellationMail";

@Service()
export class AppointmentService {

    @InjectRepository()
    private readonly appointmentRepository: AppointmentRepository

    @InjectRepository()
    private readonly userRepository: UserRepository

    async createAppointment(userId: User["id"], { providerId, date }: CreateAppointment) {
        if (userId === providerId) throw new BadRequestError("You can't create an appointment with yourself");

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

        const user = await this.userRepository.findOne(userId);
        const formattedDated = moment(startHour).locale("pt-br").format("D [de] MMMM[,] [às] h:mm[h]")

        await sendNotification(
            providerId,
            `Novo agendamento de ${user.name} para dia ${formattedDated}`
        );

        return appointment;
    }

    async getAppointments(userId: User["id"], page: number) {
        if (!page) page = 1;

        const appointments: {
            id: string,
            date: string,
            providerId: string,
            providerName: string,
            providerAvatar: string
        }[] = await this.appointmentRepository
            .getAppointmentsByUserId(userId, page);

        return appointments.map(v => ({
            id: v.id,
            date: v.date,
            provider: {
                id: v.providerId,
                name: v.providerName,
                avatar: `http://localhost:3000/files/${v.providerAvatar}`
            },
            past: moment(v.date).isBefore(new Date),
            cancelable: moment(v.date).diff(new Date, "h") >= 2
        }));
    }

    async getProviderAppointments(providerId: User["id"], date: Date) {
        const isProvider = await this.userRepository.findOne({
            where: {
                id: providerId,
                provider: true
            }
        });
        const startOfDay = moment(date).startOf("day").toDate();
        const endOfDay = moment(date).endOf("day").toDate();

        if (!isProvider) throw new BadRequestError("User is not a provider");

        const appointments = await this.appointmentRepository.find({
            where: {
                provider: providerId,
                canceledAt: null,
                date: Between(startOfDay, endOfDay)
            }
        });

        return appointments;
    }

    async cancelAppointment (userId: User["id"], appointmentId: Appointment["id"]) {
        const appointment = await this.appointmentRepository.createQueryBuilder()
            .select(`"Appointment".*, p.name as "providerName", p.email as "providerEmail", u.name as "clientName"`,)
            .leftJoin("user", "p", `p.id = "Appointment"."providerId"`)
            .leftJoin("user", "u", `u.id = "Appointment"."userId"`)
            .where(`"Appointment"."id" = :id`, { id: appointmentId })
            .getRawOne();

        // if (appointment.canceledAt) throw new BadRequestError("Appointment is already canceled");

        if (userId !== appointment.userId) throw new BadRequestError("You can't cancel this appointment");

        const subHours = moment(appointment.date).subtract(2, "hour");

        if (moment(subHours).isBefore(new Date())) {
            throw new BadRequestError("You can only cancel appointments two hours in advance");
        }

        const canceledAt = new Date();

        await this.appointmentRepository.update(appointment.id, {
            canceledAt
        });

        const to = {
            name: appointment.providerName as string,
            email: appointment.providerEmail as string
        };

        await Queue.add(CancellationMail.key, {
            to,
            clientName: appointment.clientName,
            date: appointment.date
        });

        return {
            ...appointment,
            canceledAt
        };
    }

    async getAvailableHours(providerId: User["id"], date: Date) {
        const dateMoment = moment(date);
        const startOfDay = dateMoment.startOf("day").toDate();
        const endOfDay = dateMoment.endOf("day").toDate();

        const appointments = await this.appointmentRepository.find({
            where: {
                provider: providerId,
                canceledAt: null,
                date: Between(startOfDay, endOfDay)
            }
        });

        console.log(appointments);

        const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
        ];

        const available = schedule.map(time => {
            const [ hour, minutes ] = time.split(":");
            const value = dateMoment.hour(Number(hour)).minutes(Number(minutes)).seconds(0).milliseconds(0).toDate();

            return {
                time,
                value,
                available: moment(value).isAfter(new Date()) && !appointments.find(d => moment(d.date).isSame(value))
            }

        });

        return available;
    }
}
