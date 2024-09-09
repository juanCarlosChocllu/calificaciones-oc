import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Flag } from 'src/common/enums/flag.enum';

@Schema({ collection: 'Empresa' })
export class Empresa {
  @Prop()
  nombre: string;
  @Prop({ type: String, enum: Flag, default: Flag.nuevo })
  flag: string;
  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
