import { Transform } from "class-transformer"
import { IsString, NotContains } from "class-validator"

export class CreateCorreoDto {
    @IsString()
    @NotContains(' ', { message: 'Los destinatarios no deben tener espacios' })
    to:string
    @IsString()
    subject:string
    @IsString()
    text :string
    @IsString()
    html :string
}
