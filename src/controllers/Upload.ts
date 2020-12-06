import { JsonController, Post, Req, UploadedFile, UseBefore } from "routing-controllers";
import { AuthMiddleware } from "../middlewares/authentication";
import { FileService } from "../services/File.service";
import { multerConfig } from "../utils/multer";

@UseBefore(AuthMiddleware)
@JsonController("/upload")
export class FileController {

    constructor(
        private readonly fileService: FileService
    ) { }

    @Post()
    upload(@Req() { user }: any, @UploadedFile('file', { options: multerConfig }) file: Express.Multer.File) {
        return this.fileService.upload(user.id, file);
    }

}
