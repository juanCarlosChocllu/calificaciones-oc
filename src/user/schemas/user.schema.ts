import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"

@Schema()
export class User {
    @Prop()
    nombres:string
    @Prop()
    pellidos:string
    @Prop({unique:true})
    user:string
    @Prop()
    password:string
    @Prop({type:Types.ObjectId, ref:'Sucursal'})
    sucursal:string
    @Prop()
    rol:string
}

export const UserSchema=SchemaFactory.createForClass(User)
