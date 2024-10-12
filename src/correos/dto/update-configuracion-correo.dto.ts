import { CreateConfiguracionDto } from "./create-configuracion-correo.dto";
import { PartialType } from "@nestjs/swagger";


export class UpdateCreateConfiguracionDto extends PartialType(CreateConfiguracionDto)  {
    
     
}
