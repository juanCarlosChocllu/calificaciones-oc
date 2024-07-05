import { Module } from '@nestjs/common';
import { EmpresaModule } from './empresa/empresa.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { UserModule } from './user/user.module';
import { CalificacionModule } from './calificacion/calificacion.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/calificaciones'),EmpresaModule, SucursalModule, UserModule, CalificacionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
