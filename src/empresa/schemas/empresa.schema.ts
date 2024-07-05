import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Empresa {
    @Prop()
    nombre:string
    @Prop()
    fecha:Date
}


export const EmpresaSchema=SchemaFactory.createForClass(Empresa)
