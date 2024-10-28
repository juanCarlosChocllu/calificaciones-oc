import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto';
import { Public } from './decorators/public.decorators';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}
  
  @Public()
  @Post()
  login(@Body() createAutenticacionDto: CreateAutenticacionDto) {
    return this.autenticacionService.login(createAutenticacionDto);
  }
}
