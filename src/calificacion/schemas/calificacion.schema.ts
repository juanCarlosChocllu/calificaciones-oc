import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CalificacionEnum } from '../enums/calificacion.enum';
import { Types } from 'mongoose';
import { Flag } from 'src/common/enums/flag.enum';

@Schema({ collection: 'Calificacion' })
export class Calificacion {
  @Prop({ enum: CalificacionEnum })
  nombre: CalificacionEnum;
  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;
  @Prop({ type: String, enum: Flag, default: Flag.nuevo })
  flag: string;
  @Prop({ type: Date, default: Date.now })
  fecha: Date;
}
export const calificacionSchema = SchemaFactory.createForClass(Calificacion);
