import {WebSocketServer,WebSocketGateway, OnGatewayConnection ,OnGatewayDisconnect } from '@nestjs/websockets';

import {Server, Socket } from 'socket.io'
import { CalificacionService } from '../calificacion.service';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from 'src/user/schemas/user.schema';
import { UseGuards } from '@nestjs/common';
import { tokenGuard } from 'src/autenticacion/guards/token/token.guard';

@UseGuards(tokenGuard)
@WebSocketGateway({cors:'*'}) 
export class CalificacionSocketGateway  implements  OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server:Server
  constructor(
    private readonly calificacionService:CalificacionService,
  ){}
  
  handleConnection(client: Socket) {
    console.log('Conectado')
  }
  handleDisconnect(client: Socket) {
    console.log('Desconectado')
  }
  @OnEvent('calificacion.post',{async:true})
  async contadorCalificacion( sucursal:string) { 
   const contador = await this.calificacionService.contadorCalificacionDia(sucursal)
    return this.server.emit('contador', contador)
  }
}
