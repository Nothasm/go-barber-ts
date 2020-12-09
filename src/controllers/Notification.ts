import { JsonController, Get, QueryParam, Req, UseBefore, BadRequestError, Put, Param } from "routing-controllers";
import { AuthMiddleware } from "../middlewares/authentication";
import { NotificationService } from "../services/Notification.service";

@UseBefore(AuthMiddleware)
@JsonController("/notifications")
export class NotificationController {

    constructor(
        private readonly notificationService:  NotificationService
    ) { }

    @Get()
    getNotifications (@Req() { user }: any) {
        return this.notificationService.getNotifications(user.id);
    }

    @Put("/:id")
    updateNotification (@Param("id") id: string) {
        return this.notificationService.updateNotification(id);
    }

}
