import { BadRequestException, HttpStatus, Injectable, Logger, Type } from '@nestjs/common';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cupon } from './schemas/cupon.schema';
import { Model, Types } from 'mongoose';
import { Flag } from 'src/common/enums/flag.enum';
import { SucursalService } from 'src/sucursal/sucursal.service';
import { fechaFormateada } from 'src/utils/formateoFecha.util';
import { cuponEstadoEnum } from './enums/cupon.estado.enum';
import { log } from 'node:console';

@Injectable()
export class CuponService {

  constructor (
    @InjectModel(Cupon.name) private readonly cuponSchema:Model<Cupon>,
    private readonly sucursalService:SucursalService,
    
  ){

  }

  async create(createCuponDto: CreateCuponDto) {
    const sucursal = await this.sucursalService.buscarSucursal(createCuponDto.sucursal)
    const cupon = await this.cuponSchema.findOne({numeroCupon:createCuponDto.numeroCupon})
    if(sucursal && !cupon){
      const {fechaInicio, fechaFin}= fechaFormateada(createCuponDto.fechaValidesInicio, createCuponDto.fechaValidesFin)
      createCuponDto.fechaValidesInicio = `${fechaInicio}`
      createCuponDto.fechaValidesFin =  `${fechaFin}`
      await this.cuponSchema.create(createCuponDto)
      return {status:HttpStatus.CREATED}
    }else{
      throw new BadRequestException('El numero de cupon ya existe')
    }
    
    
    
 
  }

   async buscarCuponesValidas(sucursal:Types.ObjectId){   
    const cupon = await this.cuponSchema.find({
      sucursal:new Types.ObjectId(sucursal), 
      IsHabilitado:true, 
       estado:cuponEstadoEnum.disponible,
       isUsado:false,
       flag:Flag.nuevo})
    return cupon

  }

  
  async asignarCuponCliente(sucursal:Types.ObjectId){
    const cupones = await this.buscarCuponesValidas(sucursal)
    const numero:number = Math.floor(Math.random() * cupones.length)
    const cuponSeleccionado = cupones[numero]
    return cuponSeleccionado
    
    
  }

  async  actulizarEstadosCupon(cupon:Types.ObjectId){
   await this.cuponSchema.findByIdAndUpdate(cupon, {
      estado:cuponEstadoEnum.asignado
    })
    return {estatus:HttpStatus.OK}
  }



  findAll() {
    return this.cuponSchema.find({flag:Flag.nuevo});
  }

  findOne(id: number) {
    return `This action returns a #${id} cupon`;
  }

  update(id: number, updateCuponDto: UpdateCuponDto) {
    return `This action updates a #${id} cupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} cupon`;
  }
}
