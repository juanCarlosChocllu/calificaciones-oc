import {
  BadRequestException,
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
import { Flag } from 'src/common/enums/flag.enum';
import { Empresa } from 'src/empresa/schemas/empresa.schema';

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
       await  this.UserSchema.create(createUserDto);
      return {status:HttpStatus.CREATED};
    }
  }

  async findAll() {
    const users = await this.UserSchema.aggregate([
      {
        $match: { flag: Flag.nuevo } 
      },
      {
        $lookup: {
          from: 'Sucursal',
          localField: 'sucursal', 
          foreignField: '_id', 
          as: 'sucursal' 
        }
      },
      {
        $unwind: {
          path: '$sucursal',
          preserveNullAndEmptyArrays: false 
        }
      },
      {
        $lookup: {
          from: 'Empresa', 
          localField: 'sucursal.empresa', 
          foreignField: '_id', 
          as: 'empresa'
        }
      },
      {
        $unwind: {
          path: '$empresa',
          preserveNullAndEmptyArrays: false 
        }
      },
      {
        $project: {
          nombres: 1, 
          apellidos: 1, 
          user:1,
          sucursal:  '$sucursal.nombre', 
          empresa: '$empresa.nombre' ,
          rol: 1 
        }
      }
    ]);
    return users; 
  }
  
  async buscarUsuarioExistente(user: string) {
    const userExistente = await this.UserSchema.findOne({ user: user });
    if (userExistente) {
      throw new ConflictException('El usuario ya existe');
    }
    return false;
  }


  async findOneUser(user: string) {
    const usuario = await this.UserSchema.findOne({ user: user }).select('+password');
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
      updateUserDto.sucursal = new Types.ObjectId(updateUserDto.sucursal)
    
     try {
      const user = await this.UserSchema.findById(id, {flag:Flag.nuevo})
      if(!user){
        throw new NotFoundException()
      }
      
      await this.UserSchema.findOneAndUpdate(new Types.ObjectId(id), updateUserDto)
      return {status:HttpStatus.OK}
     } catch (error) {
     // if(error.code){
       //  throw new ConflictException('El usuario ya existe')
        
     // }
     }
  }

  async softdelete(id: string) {
    console.log('eliminar');
    const user = await this.UserSchema.findById(id, {flag:Flag.nuevo})
    if(!user){
      throw new NotFoundException()
    }
     await this.UserSchema.findByIdAndUpdate(user, {flag:Flag.eliminado})

    return {status:HttpStatus.OK};
  }

  async findOne(id:string){
    const user = await this.UserSchema.findOne({_id:id ,flag:Flag.nuevo})    
    if(!user){
      throw new NotFoundException()
    }
    return user

  }
}
