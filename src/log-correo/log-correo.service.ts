import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateLogCorreoDto } from './dto/create-log-correo.dto';
import { UpdateLogCorreoDto } from './dto/update-log-correo.dto';
import { LogCorreo } from './schema/log-correo.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LogCorreoService {
    constructor(
      @InjectModel(LogCorreo.name)
      private readonly logCorreo: Model<LogCorreo>,
  
    ) {}
  create(createLogCorreoDto: CreateLogCorreoDto) {
    return 'This action adds a new logCorreo';
  }

  findAll() {
    return `This action returns all logCorreo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logCorreo`;
  }

  update(id: number, updateLogCorreoDto: UpdateLogCorreoDto) {
    return `This action updates a #${id} logCorreo`;
  }

  remove(id: number) {
    return `This action removes a #${id} logCorreo`;
  }

  async registrarLogCorreo(idCorreo:string){
      await this.logCorreo.create({idCorreo:idCorreo})
      return HttpStatus.OK
  }
}
