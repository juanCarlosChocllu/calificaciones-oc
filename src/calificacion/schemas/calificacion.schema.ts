import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CalificacionEnum } from "../enums/calificacion.enum";
import { Types } from "mongoose";


@Schema({collection:'Calificacion'})
export class Calificacion {
    @Prop({enum:CalificacionEnum})
    nombre:CalificacionEnum
    @Prop({type:Types.ObjectId, ref:'Sucursal'})
    sucursal:Types.ObjectId
    @Prop({type:Date, default:Date.now})
    fecha:Date
}
export const calificacionSchema=SchemaFactory.createForClass(Calificacion)
