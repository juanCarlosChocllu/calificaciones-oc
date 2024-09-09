import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { tokenGuard } from 'src/autenticacion/guards/token.guards';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

@Controller('calificacion')
export class CalificacionController {
  constructor(private readonly calificacionService: CalificacionService) {}
  @UseGuards(tokenGuard)
  @Post()
  create(
    @Body() createCalificacionDto: CreateCalificacionDto,
    @Req() req: string,
  ) {
    const idSucursal = req['idSucursal'];
    createCalificacionDto.sucursal = new Types.ObjectId(idSucursal);
    return this.calificacionService.create(createCalificacionDto);
  }
  @Get()
  findAll() {
    return this.calificacionService.findAll();
  }
}
