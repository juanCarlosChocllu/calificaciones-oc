import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Flag } from 'src/common/enums/flag.enum';

@Schema()
export class User {
  @Prop()
  nombres: string;
  @Prop()
  apellidos: string;
  @Prop({unique:true})
  user: string;
  @Prop({select:false})
  password: string;
  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: string;

  @Prop({ type: String, enum: Flag, default: Flag.nuevo })
  flag: string;

  @Prop()
  rol: string;


  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
