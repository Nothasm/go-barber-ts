import { User } from "../models/User";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/User.repository";
import { BadRequestError } from "routing-controllers";
import { Notification } from "../models/Notification";
import { parseMongoResult } from "../utils";

@Service()
export class NotificationService {

    @InjectRepository()
    private readonly userRepository: UserRepository

    async getNotifications(userId: User["id"]) {
        const isProvider = await this.userRepository.findOne({
            where: {
                id: userId,
                provider: true
            }
        });

        if (!isProvider) throw new BadRequestError("User is not a provider");

        const notifications = await Notification.find({
            user: userId
        })
        .sort({ createdAt: 'desc'})
        .limit(20);

        return parseMongoResult(notifications);
    }

    async updateNotification(id: string) {
        const notification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );

        return parseMongoResult(notification);
    }
}
