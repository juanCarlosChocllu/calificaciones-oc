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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoIdValidationPipe } from 'src/common/utils/MongoIdValidationPipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('listar')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdValidationPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  softdelete(@Param('id', MongoIdValidationPipe) id: string) {
    return this.userService.softdelete(id);
  }
}
