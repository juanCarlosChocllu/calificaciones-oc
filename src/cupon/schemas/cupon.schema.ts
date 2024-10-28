import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Flag } from "src/common/enums/flag.enum";
import { cuponEstadoEnum } from "../enums/cupon.estado.enum";

@Schema({collection:'Cupon'})
export class Cupon {
    @Prop({type:Types.ObjectId, ref:'sucursal'})
    sucursal:Types.ObjectId


    @Prop()
    descripcion:string

    @Prop({unique: true})
    numeroCupon:string

    @Prop()
    imagen:string
    
    @Prop({type:Boolean,default:true})
    IsHabilitado:Boolean

    @Prop({type:Date})
    fechaValidesInicio:Date

    @Prop({type:Date})
    fechaValidesFin:Date

    @Prop({type:String, enum:cuponEstadoEnum, default:cuponEstadoEnum.disponible})
    estado:string

    @Prop({type: Boolean, default:false})
    isUsado:Boolean
     
    @Prop({type:String, enum:Flag, default:Flag.nuevo })
    flag:string

    @Prop({ type: Date, default: Date.now() })
    fecha: Date;

}

export const cuponSchema = SchemaFactory.createForClass(Cupon)