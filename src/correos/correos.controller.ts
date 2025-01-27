import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { CreateCorreoDto } from './dto/create-correo.dto';
import { CreateConfiguracionDto } from './dto/create-configuracion-correo.dto';
import { MongoIdValidationPipe } from 'src/common/utils/MongoIdValidationPipe';
import { UpdateCreateConfiguracionDto } from './dto/update-configuracion-correo.dto';
import { UpdateCorreoDto } from './dto/update-correo.dto';

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

  
  @Get('listar/email')
  listarEmail() {
    return this.correosService.listarEmail();
  }
  @Get('listar/configuracion')
  listarConfiguracion() {
    return this.correosService.listarConfiguracion();
  }

  @Delete('gmail/:id')
  soffDelete(@Param('id' ,MongoIdValidationPipe)id:string) {
    return this.correosService.soffDelete(id);
  }

  @Patch('gmail/:id')
  gmailUpdate(@Param('id' ,MongoIdValidationPipe)id:string,@Body() updateCorreoDto : UpdateCorreoDto) {
    return this.correosService.gmailUpdate(id, updateCorreoDto) ;
  }

  @Patch('configuracion/:id')
  configuracionUpdate(@Param('id' ,MongoIdValidationPipe)id:string,@Body() updateCreateConfiguracionDto : UpdateCreateConfiguracionDto) {
    return this.correosService.configuracionUpdate(id, updateCreateConfiguracionDto) ;
  }



  
  @Delete('configuracion/:id')
  soffDeleteConfiguracion(@Param('id' ,MongoIdValidationPipe)id:string) {
    return this.correosService.soffDeleteConfiguracion(id);
  }



  
 
}
