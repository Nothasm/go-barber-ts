import { EntityRepository, Repository } from "typeorm";
import { Service } from "typedi";
import { Appointment } from "../models/Appointment";

@Service()
@EntityRepository(Appointment)
export class AppointmentRepository extends Repository<Appointment> {
}
