import { Module } from '@nestjs/common';
import { LogCorreoService } from './log-correo.service';
import { LogCorreoController } from './log-correo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogCorreo, logCorreoSchema } from './schema/log-correo.schema';

@Module({
  imports:[
      MongooseModule.forFeature([
          { name: LogCorreo.name, schema: logCorreoSchema },
        ]),
      
  ],
  controllers: [LogCorreoController],
  providers: [LogCorreoService],
  exports:[LogCorreoService]
})
export class LogCorreoModule {}
