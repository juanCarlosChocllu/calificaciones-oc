import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSucursalDto {
  @IsString()
  nombre: string;


  @IsMongoId()
  empresa:Types.ObjectId
  
}
