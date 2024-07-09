import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sucursal } from './schemas/sucursal.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class SucursalService {
  constructor(@InjectModel(Sucursal.name) private readonly SucursalSchema:Model<Sucursal> ){}

  create(createSucursalDto: CreateSucursalDto) {
    return this.SucursalSchema.create(createSucursalDto) ;
  }

  findAll() {
    return `This action returns all sucursal`;
  }

  findOne(id:number ) {
    return `This action returns a #${id} sucursal`;
  }

  async buscarSucursal(idSucursal:Types.ObjectId){
    const sucursal = await this.SucursalSchema.findById(idSucursal)
    if(!sucursal){
      throw new NotFoundException('SucursaL no encontrada')
    }
    return sucursal
  }
  buscarSucursalUsuario(usuario:Types.ObjectId){
    

  }

  update(id: number, updateSucursalDto: UpdateSucursalDto) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
