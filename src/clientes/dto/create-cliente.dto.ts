import { ApiHideProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateClienteDto {
    @IsString({ message: 'El nombre completo es obligatorio.' })
    nombreCompleto: string;

    @IsString({ message: 'El celular es obligatorio.' })
    celular: string;
    
    @ApiHideProperty()
    sucursal:Types.ObjectId
}
