import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogCorreoService } from './log-correo.service';
import { CreateLogCorreoDto } from './dto/create-log-correo.dto';
import { UpdateLogCorreoDto } from './dto/update-log-correo.dto';

@Controller('log-correo')
export class LogCorreoController {
  constructor(private readonly logCorreoService: LogCorreoService) {}

  @Post()
  create(@Body() createLogCorreoDto: CreateLogCorreoDto) {
    return this.logCorreoService.create(createLogCorreoDto);
  }

  @Get()
  findAll() {
    return this.logCorreoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logCorreoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogCorreoDto: UpdateLogCorreoDto) {
    return this.logCorreoService.update(+id, updateLogCorreoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logCorreoService.remove(+id);
  }
}
