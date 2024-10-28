import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { log } from 'node:console';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProvidersService {
        constructor(
            private readonly httpService:HttpService
        ){}

       async  apiWhatsapp(celular:string, mensaje:string){
            console.log('hola');
            
            const url:string='http://192.168.7.138:3000/mensajes'
            try {
                const data={
                    mensaje:mensaje,
                    numero:celular
                }
                const respose = await  firstValueFrom(this.httpService.post(url,data))
                console.log(respose);
                
            } catch (error) {
                if(error.status == 400){
                    console.log('Necesita escanear el qr')
                }
                
            }   



        }

}
