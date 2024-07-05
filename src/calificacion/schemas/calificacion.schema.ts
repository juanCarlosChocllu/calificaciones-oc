import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CalificacionEnum } from "../enums/calificacion.enum";


@Schema({collection:'Calificaciones'})
export class Calificacion {
    @Prop({enum:CalificacionEnum})
    nombre:CalificacionEnum
    @Prop()
    sucursal:string
    @Prop({type:Date, default:Date.now})
    fecha:Date
}
export const calificacionSchema=SchemaFactory.createForClass(Calificacion)
