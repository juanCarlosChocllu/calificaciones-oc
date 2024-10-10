import { ConflictException, Injectable, NotFoundException, Type } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sucursal } from './schemas/sucursal.schema';
import { Model, Types } from 'mongoose';
import { EmpresaService } from 'src/empresa/empresa.service';
import { Flag } from 'src/common/enums/flag.enum';

@Injectable()
export class SucursalService {
  constructor(
    @InjectModel(Sucursal.name)
    private readonly SucursalSchema: Model<Sucursal>,
    private readonly empresaService:EmpresaService
  ) {}

  async create(createSucursalDto: CreateSucursalDto) {
    const sucursal = await this.SucursalSchema.findOne({nombre:createSucursalDto.nombre})
    if(sucursal){
      throw new ConflictException('La sucursal ya existe')
    }
    await this.empresaService.findOne(`${createSucursalDto.empresa}`)
    createSucursalDto.empresa= new Types.ObjectId(createSucursalDto.empresa)
    return this.SucursalSchema.create(createSucursalDto);
  }

  async findAll(id:string) {
    return  await this.SucursalSchema.find({empresa:new Types.ObjectId(id), flag:Flag.nuevo});
  }

  async findOne(id: string) {
    const sucursal = await this. verficarSucursal(id)
    return sucursal
   
  }

  async buscarSucursal(idSucursal: Types.ObjectId) {
    const sucursal = await this.SucursalSchema.findById(idSucursal);
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }
    return sucursal;
  }

 private async verficarSucursal(id:string){
  const sucursal:Sucursal = await this.SucursalSchema.findOne({_id:id, flag:Flag.nuevo})
  if(!sucursal){
    throw new NotFoundException()
  }
  return sucursal
 }


 public async listarSucursales(id:Types.ObjectId){
  const sucursal = await this.SucursalSchema.find({empresa:new Types.ObjectId(id)})
  return sucursal
 } 

  async listarSucursal(){
    const sucursal = await this.SucursalSchema.find({flag:Flag.nuevo})
    return sucursal
  }
}
