import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from './schemas/empresa.schema';
import { Model } from 'mongoose';
import { respuestaHttpI } from 'src/common/interfaces/respuestaHttp.interface';

@Injectable()
export class EmpresaService {

  constructor(@InjectModel(Empresa.name) private readonly EmpresaSchema:Model<Empresa> ){}
  async create(createEmpresaDto: CreateEmpresaDto) {
    const empresa = await this.EmpresaSchema.create(createEmpresaDto);
    const resultado:respuestaHttpI<Empresa>={
      status:HttpStatus.CREATED,
      data:empresa

    }
    return resultado
  }

  findAll() {
    return `This action returns all empresa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empresa`;
  }

  update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
}
