import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from './schemas/empresa.schema';
import { Model } from 'mongoose';
import { respuestaHttpI } from 'src/common/interfaces/respuestaHttp.interface';
import { Flag } from 'src/common/enums/flag.enum';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectModel(Empresa.name) private readonly EmpresaSchema: Model<Empresa>,
  ) {}
  async create(createEmpresaDto: CreateEmpresaDto) {
    const empr = await this.EmpresaSchema.findOne({nombre:createEmpresaDto.nombre})
    if(empr){
      throw new  ConflictException('LA EMPRESA YA EXISTE')
    }
    const empresa = await this.EmpresaSchema.create(createEmpresaDto);
    const resultado: respuestaHttpI<Empresa> = {
      status: HttpStatus.CREATED,
      data: empresa,
    };
    return resultado;
  }

  findAll() {
    return this.EmpresaSchema.find();
  }

  async findOne(id: string) {
   const empresa = await this.vericarEmpresa(id)
   return empresa
  }

  update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresa`;
  }

  public async listarEmpresas() {
    const empresa = await this.EmpresaSchema.find({
      flag: Flag.nuevo,
    });

    return empresa;
  }

  private async vericarEmpresa(id:string){
    const empresa = await this.EmpresaSchema.findOne({_id:id})
    if(!empresa){
      throw new NotFoundException()
    }
    return empresa


  }
}
