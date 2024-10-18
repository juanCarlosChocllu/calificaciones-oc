import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { rol } from '../enum/rol.enum';

export class CreateUserDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsMongoId()
  sucursal: Types.ObjectId;

  @IsEnum(rol)
  rol: string;
}
