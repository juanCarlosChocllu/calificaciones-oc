import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Flag } from 'src/common/enums/flag.enum';

@Schema()
export class User {
  @Prop()
  nombres: string;
  @Prop()
  pellidos: string;
  @Prop({ unique: true })
  user: string;
  @Prop()
  password: string;
  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: string;

  @Prop({ type: String, enum: Flag, default: Flag.nuevo })
  flag: string;

  @Prop()
  rol: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
