import { ApiHideProperty } from "@nestjs/swagger"
import { IsDateString, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateCuponDto {
    
    @IsMongoId({ message: 'sucursal debe ser un ID de MongoDB válido' })
    @IsNotEmpty({ message: 'sucursal no debe estar vacía' })
    sucursal: Types.ObjectId;
  
    @IsString({ message: 'descripcion debe ser un texto' })
    @IsNotEmpty({ message: 'descripcion no debe estar vacía' })
    descripcion: string;
  
    @IsDateString({}, { message: 'fecha valides inicio debe ser una fecha válida' })
    @IsNotEmpty({ message: 'fecha valides inicio no debe estar vacía' })
    fechaValidesInicio: string;
  
    @IsDateString({}, { message: 'fecha valides fin debe ser una fecha válida' })
    @IsNotEmpty({ message: 'fecha valides fin no debe estar vacía' })
    fechaValidesFin: string;
  
    @IsString({ message: 'numero de cupon debe ser un texto' })
    @IsNotEmpty({ message: 'numero de cupon no debe estar vacío' })
    numeroCupon: string;

    @ApiHideProperty()
    imagen:string
    



}
