import { IsEmail, IsNumber, IsString, NotContains } from "class-validator"


export class CreateConfiguracionDto  {

    @IsEmail()
    @NotContains(' ',{ message: 'El correo no debe contener espacios' })
    correo:string
    
    @IsString()
    password:string
 
    @IsString()
    @NotContains(' ',{ message: 'El host no debe contener espacios' })
    host:string

    @IsNumber()
    port:number
     
}
