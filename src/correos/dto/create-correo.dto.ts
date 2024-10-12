import { IsString } from "class-validator"

export class CreateCorreoDto {
    @IsString()
    to:string
    @IsString()
    subject:string
    @IsString()
    text :string
    @IsString()
    html :string
}
