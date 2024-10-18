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
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { MongoIdValidationPipe } from 'src/utils/MongoIdValidationPipe';
import { tokenGuard } from 'src/autenticacion/guards/token/token.guard';


@UseGuards(tokenGuard)
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post('create')
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresaService.create(createEmpresaDto);
  }

  @Get('listar')
  findAll() {
    return this.empresaService.findAll();
  }
  @Get(':id')
  findOneEmpresa(@Param('id', MongoIdValidationPipe) id: string) {
  
    return this.empresaService.findOneEmpresa(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresaService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  softDelte(@Param('id',MongoIdValidationPipe) id: string) {
    return this.empresaService.softDelete(id);
  }
}
