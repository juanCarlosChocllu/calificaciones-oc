import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post('create')
  create(@Body() createSucursalDto: CreateSucursalDto) {
    console.log(createSucursalDto);

    return this.sucursalService.create(createSucursalDto);
  }

  @Get('listar/:id')
  findAll(@Param('id') id: string) {
    return this.sucursalService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sucursalService.findOne(id);
  }

  @Get('listar')
  listarSucursal() {
    return this.sucursalService.listarSucursal();
  }





}
