import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, clienteSchema } from './schemas/cliente.schema';
import { CuponModule } from 'src/cupon/cupon.module';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:Cliente.name, schema:clienteSchema
    }]),
    CuponModule

  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
