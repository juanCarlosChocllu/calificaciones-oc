import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Flag } from "src/common/enums/flag.enum";

@Schema({collection:'Correo'})
export class Correo {
    @Prop()
    to:string
    @Prop()
    subject:string
    @Prop()
    text :string
    @Prop()
    html :string
    @Prop({type:String, enum:Flag, default : Flag.nuevo})

    flag:Flag    
}


export const CorreoSchema = SchemaFactory.createForClass(Correo)
