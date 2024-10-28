import { Type } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Flag } from "src/common/enums/flag.enum";

@Schema({collection:'Clientes'})
export class Cliente {
    @Prop()
    nombreCompleto:string

    @Prop()
    celular:string

    @Prop({type:Types.ObjectId, ref:'sucursal',})
    sucursal:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'sucursal'})
    cupon:Types.ObjectId

    @Prop({type:String, enum:Flag, default:Flag.nuevo })
    flag:string

    @Prop({ type: Date, default: Date.now() })
    fecha: Date;

}


export const clienteSchema = SchemaFactory.createForClass(Cliente)