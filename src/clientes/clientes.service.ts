import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cliente } from './schemas/cliente.schema';
import { Model, Types } from 'mongoose';
import { log, time } from 'node:console';
import { Flag } from 'src/common/enums/flag.enum';
import { CuponService } from 'src/cupon/cupon.service';
import { Sucursal } from 'src/sucursal/schemas/sucursal.schema';
import { HttpService } from '@nestjs/axios';
import { ProvidersModule } from 'src/providers/providers.module';
import { ProvidersService } from 'src/providers/providers.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private readonly  clienteSchema:Model<Cliente> ,
    private readonly cuponService:CuponService,
    private readonly providersService:ProvidersService
    
  
  ){}

  async create(createClienteDto: CreateClienteDto) {
    const cliente=  await this.clienteSchema.create(createClienteDto)    
    const cupon= await this.cuponService.asignarCuponCliente(createClienteDto.sucursal)  
   if(cupon){
    await this.clienteSchema.findOneAndUpdate(cliente._id, {cupon: new Types.ObjectId(cupon._id)})
    const cuponAsigando=   await this.cuponService.actulizarEstadosCupon(cupon._id)
    if(cuponAsigando.estatus === 200){
      const  mensaje:string = `Estimado cliente ${cliente.nombreCompleto} se le asigno el nuemero de cupon de descuentos ${cupon.numeroCupon}`
      await this.providersService.apiWhatsapp(cliente.celular,mensaje)
      return {status:HttpStatus.CREATED};
    }
   }else{
    return {status:HttpStatus.CREATED};
   }

  }

  findAll() {
    return this.clienteSchema.find({flag:Flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
