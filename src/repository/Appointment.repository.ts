import { EntityRepository, Repository } from "typeorm";
import { Service } from "typedi";
import { Appointment } from "../models/Appointment";
import { User } from "../models/User";

@Service()
@EntityRepository(Appointment)
export class AppointmentRepository extends Repository<Appointment> {
    async getAppointmentsByUserId(id: User["id"], page: number) {
        const limit = 20;
        const offset = (page - 1) * limit;

        return this.createQueryBuilder()
            .select(`"Appointment".id, "Appointment".date, "Appointment"."providerId", u.name as "providerName", f.path as "providerAvatar"`)
            .leftJoin("user", "u", `u.id = "Appointment"."providerId"`)
            .leftJoin("file", "f", `f.id = u."avatarId"`)
            .where(`"userId" = :id`, { id })
            .andWhere(`"canceledAt" IS NULL`)
            .limit(limit)
            .offset(offset)
            .getRawMany();
    }

}
