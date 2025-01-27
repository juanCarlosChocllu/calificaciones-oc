import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({collection:'LogCorreo'})
export class LogCorreo {
    @Prop()
    idCorreo:string

    @Prop({type:Date,default: Date.now()})
    fecha:Date


}

export const logCorreoSchema = SchemaFactory.createForClass(LogCorreo)
