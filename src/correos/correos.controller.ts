import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { CreateCorreoDto } from './dto/create-correo.dto';
import { CreateConfiguracionDto } from './dto/create-configuracion-correo.dto';

@Controller('correos')
export class CorreosController {
  constructor(private readonly correosService: CorreosService) {}

  @Post('create/email')
  createEmail(@Body() createCorreoDto: CreateCorreoDto) {
    return this.correosService.createEmail(createCorreoDto);
  }

  @Post('create/configuracion')
  createConfiguracion(@Body() createConfiguracionDto:CreateConfiguracionDto) {
    return this.correosService.createConfiguracion(createConfiguracionDto);
  }


 
}
