import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Flag } from "src/common/enums/flag.enum";

@Schema({collection:'ConfiguracionNodeMailer'})
export class ConfiguracionNodeMailer {
    @Prop()
    correo:string
    @Prop()
    password:string
    @Prop()
    host:string
    @Prop()
    port:number
    @Prop({type:String, enum:Flag, default : Flag.nuevo})
    flag:Flag    
}

export const ConfiguracionNodeMailerSchema= SchemaFactory.createForClass(ConfiguracionNodeMailer) 

