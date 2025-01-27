import { Module } from '@nestjs/common';
import { EmpresaModule } from './empresa/empresa.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { UserModule } from './user/user.module';
import { CalificacionModule } from './calificacion/calificacion.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { CorreosModule } from './correos/correos.module';
import { ClientesModule } from './clientes/clientes.module';
import { APP_GUARD } from '@nestjs/core';
import { tokenGuard } from './autenticacion/guards/token/token.guard';
import { CuponModule } from './cupon/cupon.module';
import { ProvidersModule } from './providers/providers.module';
import { databaseConeccion } from './config/variables.entorno.config';
import { LogCorreoModule } from './log-correo/log-correo.module';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConeccion),
    EmpresaModule,
    SucursalModule,
    UserModule,
    CalificacionModule,
    AutenticacionModule,
    CorreosModule,
    ClientesModule,
    CuponModule,
    ProvidersModule,
    LogCorreoModule,
    
  ],

  controllers: [],
  providers: [
    {
    provide:APP_GUARD,
    useClass:tokenGuard,
    
  },


],
})
export class AppModule {}
