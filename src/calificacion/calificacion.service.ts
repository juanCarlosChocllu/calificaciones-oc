import { HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Calificacion } from './schemas/calificacion.schema';
import { Model } from 'mongoose';
import { respuestaHttpI } from '../common/interfaces/respuestaHttp.interface';
@Injectable()
export class CalificacionService {
  constructor(@InjectModel(Calificacion.name) private readonly CalificacionSchema:Model<Calificacion> ){}

  async create(createCalificacionDto: CreateCalificacionDto) {
  const calificacion=  await this.CalificacionSchema.create(createCalificacionDto) ;
    const respuesta:respuestaHttpI<Calificacion>={
      status:HttpStatus.CREATED,
      data:calificacion
    }
    return  respuesta
  }

  findAll() {
    return `This action returns all calificacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calificacion`;
  }

  update(id: number, updateCalificacionDto: UpdateCalificacionDto) {
    return `This action updates a #${id} calificacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} calificacion`;
  }
}
