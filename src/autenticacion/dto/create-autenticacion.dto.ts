import { IsString } from "class-validator"

export class CreateAutenticacionDto {
    @IsString()
    user:string

    @IsString()
    password:string
}
