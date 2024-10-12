import { Module } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { CorreosController } from './correos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Correo, CorreoSchema } from './schema/correo.schema';
import { ConfiguracionNodeMailer, ConfiguracionNodeMailerSchema } from './schema/configuracion.shema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Correo.name, schema:CorreoSchema
      },
      {
        name:ConfiguracionNodeMailer.name, schema:ConfiguracionNodeMailerSchema
      }
    ])
  ],
  controllers: [CorreosController],
  providers: [CorreosService],
  exports:[CorreosService]
})
export class CorreosModule {}
