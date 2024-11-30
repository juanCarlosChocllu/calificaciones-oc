import { IsEmail, IsNotEmpty, IsNumber, IsString, NotContains } from "class-validator";

export class CreateConfiguracionDto {

    @IsEmail({}, { message: 'El correo debe ser un correo electrónico válido.' })
    @IsNotEmpty({ message: 'El correo es obligatorio.' })
    @NotContains(' ', { message: 'El correo no debe contener espacios.' })
    correo: string;
    
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    password: string;

    @IsString({ message: 'El host debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El host es obligatorio.' })
    @NotContains(' ', { message: 'El host no debe contener espacios.' })
    host: string;

    @IsNotEmpty({ message: 'El puerto es obligatorio.' })
    @IsNumber({}, { message: 'El puerto debe ser un número.' })
    port: number;
}
