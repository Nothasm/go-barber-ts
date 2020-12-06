import { User } from "../models/User";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FileRepository } from "../repository/File.repository";
import { UserRepository } from "../repository/User.repository";

@Service()
export class FileService {

    @InjectRepository()
    private readonly fileRepository: FileRepository

    @InjectRepository()
    private readonly userRepository: UserRepository

    async upload(userId: User["id"], fileData: Express.Multer.File) {
        const file = await this.fileRepository.save({
            name: fileData.originalname,
            path: fileData.filename
        });

        const user = await this.userRepository.save({ id: userId, avatar: file.id});

        console.log(user);

        return file;
    }
}
