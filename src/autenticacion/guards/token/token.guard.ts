import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { log } from 'node:console';
import { jwtConstants } from 'src/autenticacion/constants/jwt.constants';
import { PUBLIC_KEY } from 'src/autenticacion/constants/public.constants';

@Injectable()
export class tokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const publico = this.reflector.get(PUBLIC_KEY, context.getHandler())
    if(publico){
      return true
    }
    
    const request = context.switchToHttp().getRequest();
    const autenticacionHeader: string = request.headers.authorization;
    try {
      const token = autenticacionHeader.split(' ')[1];
      const usuario = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      request.usuario = usuario;
  
      return true;
    } catch (error) {
      throw new UnauthorizedException('No estas autorizado');
    }
  }
}
