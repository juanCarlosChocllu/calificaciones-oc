import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
  .setTitle('Sistema de calificacion')
  .setDescription('Sistema de calificacion para oc por sucursales')
  .setVersion('1.0')
  .addTag('Calificaciones')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('doc', app, document);
  await app.listen(3000);
}
bootstrap();
