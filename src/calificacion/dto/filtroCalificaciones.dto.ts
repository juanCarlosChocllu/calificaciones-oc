import { IsDateString, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export  class FiltroCalificacionesDto{
    
    @IsMongoId({each:true})
    sucursal:Types.ObjectId[]

    @IsDateString()
    fechaInicio:string

    @IsDateString()
    fechaFin:string


}