import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Flag } from 'src/common/enums/flag.enum';

@Schema({ collection: 'Sucursal' })
export class Sucursal {
  @Prop()
  nombre: string;
  @Prop({ type: Types.ObjectId, ref: 'Empresa' })
  empresa: Types.ObjectId;
  @Prop({ type: String, enum: Flag, default: Flag.nuevo })
  flag: string;
  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const SucursalSchema = SchemaFactory.createForClass(Sucursal);
