import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port , interfaceRed} from './config/variables.entorno.config';

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(
   {
    whitelist:true,
    exceptionFactory:(e)=>{
      const error = e.map((er)=>   
    {
      return {
        error:Object.values(er.constraints),
        propiedad:er.property
      }
    })

    throw new BadRequestException(error)
      
    }
  
    
   }
  ));
  const config = new DocumentBuilder()
    .setTitle('Sistema de calificacion')
    .setDescription('Sistema de calificacion para oc por sucursales')
    .setVersion('1.0')
    .addTag('Calificaciones')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(port, interfaceRed, ()=>{
    console.log(`Servidor corriendo  host:${interfaceRed}:${port}`);
    
  });
}
bootstrap();
