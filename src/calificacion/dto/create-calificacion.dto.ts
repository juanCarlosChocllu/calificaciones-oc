import { CalificacionEnum } from "../enums/calificacion.enum";
import {IsEnum, IsOptional} from "class-validator"

export class CreateCalificacionDto {
    @IsEnum(CalificacionEnum)
    nombre:CalificacionEnum

    @IsOptional()
    sucursal:string

}
