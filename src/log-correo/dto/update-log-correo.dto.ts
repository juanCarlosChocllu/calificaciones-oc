import { PartialType } from '@nestjs/swagger';
import { CreateLogCorreoDto } from './create-log-correo.dto';

export class UpdateLogCorreoDto extends PartialType(CreateLogCorreoDto) {}
