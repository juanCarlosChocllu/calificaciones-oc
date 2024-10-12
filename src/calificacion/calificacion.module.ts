import { Module } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CalificacionController } from './calificacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Calificacion,
  calificacionSchema,
} from './schemas/calificacion.schema';
import { AutenticacionModule } from 'src/autenticacion/autenticacion.module';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { SucursalModule } from 'src/sucursal/sucursal.module';
import { CorreosModule } from 'src/correos/correos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calificacion.name, schema: calificacionSchema },
    ]),
    AutenticacionModule,
    EmpresaModule,
    SucursalModule,
    CorreosModule
  ],
  controllers: [CalificacionController],
  providers: [CalificacionService],
})
export class CalificacionModule {}
