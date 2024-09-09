import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { respuestaHttpI } from 'src/common/interfaces/respuestaHttp.interface';
import { SucursalService } from 'src/sucursal/sucursal.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserSchema: Model<User>,
    private readonly sucursalService:SucursalService
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.sucursal = new Types.ObjectId(createUserDto.sucursal);
    const usuariosExistentes = await this.buscarUsuarioExistente(
      createUserDto.user,
    );
    if (!usuariosExistentes) {
      await this.sucursalService.findOne(`${createUserDto.sucursal}`)
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.UserSchema.create(createUserDto);
      const respuesta: respuestaHttpI<User> = {
        status: HttpStatus.CREATED,
        data: user,
      };

      return {status:HttpStatus.CREATED};
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async buscarUsuarioExistente(user: string) {
    const userExistente = await this.UserSchema.findOne({ user: user });
    if (userExistente) {
      throw new ConflictException('El usuario ya existe');
    }
    return false;
  }
  async findOneUser(user: string) {
    const usuario = await this.UserSchema.findOne({ user: user });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
