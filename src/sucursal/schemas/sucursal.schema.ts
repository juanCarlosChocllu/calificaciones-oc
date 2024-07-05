import { Prop } from "@nestjs/mongoose"

export class Sucursal {
    @Prop()
    nombre:string

    @Prop({type:Date, default:Date.now()})
    fecha:Date
}
