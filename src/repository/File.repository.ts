import { EntityRepository, Repository } from "typeorm";
import { Service } from "typedi";
import { File } from "../models/File";

@Service()
@EntityRepository(File)
export class FileRepository extends Repository<File> {
}
