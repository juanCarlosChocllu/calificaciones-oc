import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { MongoIdValidationPipe } from 'src/utils/MongoIdValidationPipe';
import { tokenGuard } from 'src/autenticacion/guards/token/token.guard';
@UseGuards(tokenGuard)
@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post('create')
  create(@Body() createSucursalDto: CreateSucursalDto) {
    console.log(createSucursalDto);

    return this.sucursalService.create(createSucursalDto);
  }

  @Get('listar/:id')
  findAll(@Param('id', MongoIdValidationPipe) id: string) {
    return this.sucursalService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.sucursalService.findOne(id);
  }

  @Get()
  listarSucursal() {
    return this.sucursalService.listarSucursal();
  } 
  @Delete(':id')
  softDelete(@Param('id', MongoIdValidationPipe) id: string) {
    return this.sucursalService.softDelete(id);
  }
  @Patch(':id')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() updateSucursalDto: UpdateSucursalDto) {
    return this.sucursalService.update(id, updateSucursalDto);
  }






}
