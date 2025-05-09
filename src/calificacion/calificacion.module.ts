import { forwardRef, Module } from '@nestjs/common';
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
import { CalificacionSocketGateway } from './calificacion-socket/calificaion-socket.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ScheduleModule } from '@nestjs/schedule';
import { LogCorreoModule } from 'src/log-correo/log-correo.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Calificacion.name, schema: calificacionSchema },
   
    ]),
    EventEmitterModule.forRoot(),
    AutenticacionModule,
    EmpresaModule,
    SucursalModule,
    CorreosModule ,
    LogCorreoModule
   
  ],
  controllers: [CalificacionController],
  providers: [CalificacionService, CalificacionSocketGateway ],
  exports:[CalificacionService]
})
export class CalificacionModule {}
