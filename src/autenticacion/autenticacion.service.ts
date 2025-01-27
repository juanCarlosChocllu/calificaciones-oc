import {
  HttpCode,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAutenticacionDto } from './dto/create-autenticacion.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(createAutenticacionDto: CreateAutenticacionDto) {
    const user = await this.UserService.findOneUser(
      createAutenticacionDto.user,
    );
    const password = await bcrypt.compare(
      createAutenticacionDto.password,
      user.password,
    );
    if (!password) {
      throw new UnauthorizedException('Contrasena incorrecta');
    }

    const token = await this.generarToken({ user });
    const resultado = {
      status: HttpStatus.OK,
      rol:user.rol,
      token: token,
    };
    return resultado;
  }

  async generarToken({ user }) {
    const payload = { id: user._id,
       rol: user.rol,
       sucursal: user.sucursal,
       };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
