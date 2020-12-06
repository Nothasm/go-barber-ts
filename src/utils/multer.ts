import * as multer from "multer";
import * as crypto from "crypto";
import { extname, resolve } from "path";

export const multerConfig: multer.Options = {
    storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", "tmp", "uploads"),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err, "");

                return cb(null, `${res.toString('hex')}${extname(file.originalname)}`)
            })
        }
    }),
}