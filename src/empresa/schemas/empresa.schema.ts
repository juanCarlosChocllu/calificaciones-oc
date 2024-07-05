import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({collection:'Empresa'})
export class Empresa {
    @Prop()
    nombre:string
    @Prop({type:Date, default:Date.now()})
    fecha:Date
}


export const EmpresaSchema=SchemaFactory.createForClass(Empresa)
