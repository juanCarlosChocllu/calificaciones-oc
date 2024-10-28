import { Module } from '@nestjs/common';
import { CuponService } from './cupon.service';
import { CuponController } from './cupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cupon, cuponSchema } from './schemas/cupon.schema';
import { SucursalModule } from 'src/sucursal/sucursal.module';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name:Cupon.name, schema:cuponSchema 
    }
  ]),
  SucursalModule
],
  controllers: [CuponController],
  providers: [CuponService],
  exports:[CuponService]


})
export class CuponModule {}
