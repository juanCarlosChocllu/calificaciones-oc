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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calificacion.name, schema: calificacionSchema },
    ]),
    AutenticacionModule,
    EmpresaModule,
    SucursalModule
  ],
  controllers: [CalificacionController],
  providers: [CalificacionService],
})
export class CalificacionModule {}
