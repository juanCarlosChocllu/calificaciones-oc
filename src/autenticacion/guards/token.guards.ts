import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt.constants';
import { SucursalService } from 'src/sucursal/sucursal.service';

@Injectable()
export class tokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const autenticacionHeader: string = request.headers.authorization;
    try {
      const token = autenticacionHeader.split(' ')[1];
      const usuario = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      request['idUsuario'] = usuario.id;
      request['idSucursal'] = usuario.sucursal;
      return true;
    } catch (error) {
      throw new UnauthorizedException('No estas autorizado');
    }
  }
}
