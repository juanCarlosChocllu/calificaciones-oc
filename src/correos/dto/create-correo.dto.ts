import { IsNotEmpty, IsString } from "class-validator";

export class CreateCorreoDto {
    @IsNotEmpty({ message: 'El campo "to" no puede estar vacío.' })
    @IsString({ message: 'El campo "to" debe ser una cadena de texto.' })
    to: string;

    @IsNotEmpty({ message: 'El campo "subject" no puede estar vacío.' })
    @IsString({ message: 'El campo "subject" debe ser una cadena de texto.' })
    subject: string;

    @IsString({ message: 'El campo "text" debe ser una cadena de texto.' })
    text: string;

    @IsNotEmpty({ message: 'El campo "html" no puede estar vacío.' })
    @IsString({ message: 'El campo "html" debe ser una cadena de texto.' })
    html: string;
}
