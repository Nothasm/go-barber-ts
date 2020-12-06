import { IsEmail, IsOptional, IsString } from "class-validator";

export class Login {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UpdateUser {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    oldPassword: string;

    @IsString()
    @IsOptional()
    newPassword: string;

}