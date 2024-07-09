import { IsMongoId, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateUserDto {

    @IsString()
    nombres:string
    
    @IsString()
    apellidos:string
    
    @IsString()
    user:string
    
    @IsString()
    password:string

    @IsMongoId()
    sucursal:Types.ObjectId
    
    @IsString()
    rol:string
}
