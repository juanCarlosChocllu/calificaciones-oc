import { IsEmail, IsNumber, IsString } from "class-validator"


export class CreateConfiguracionDto  {
    @IsEmail()
    correo:string
    
    @IsString()
    password:string
 
    @IsString()
    host:string

    @IsNumber()
    port:number
     
}
