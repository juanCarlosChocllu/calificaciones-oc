import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sucursal, SucursalSchema } from './schemas/sucursal.schema';
import { EmpresaModule } from 'src/empresa/empresa.module';

@Module({
  imports: [
    EmpresaModule,
    SucursalModule,
    MongooseModule.forFeature([
      { name: Sucursal.name, schema: SucursalSchema },
    ]),
  ],
  controllers: [SucursalController],
  providers: [SucursalService],
  exports: [SucursalService],
})
export class SucursalModule {}
