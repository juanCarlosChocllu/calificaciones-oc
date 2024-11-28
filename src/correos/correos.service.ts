import {BadGatewayException, forwardRef, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCorreoDto } from './dto/create-correo.dto';

import { CreateConfiguracionDto } from './dto/create-configuracion-correo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Correo } from './schema/correo.schema';
import { Model } from 'mongoose';
import { ConfiguracionNodeMailer } from './schema/configuracion.shema';

import * as nodemailer from 'nodemailer'
import { Flag } from 'src/common/enums/flag.enum';

import { Cron, CronExpression } from '@nestjs/schedule';
import { CalificacionService } from 'src/calificacion/calificacion.service';

@Injectable()
export class CorreosService {
  private host:string
  private port:number
  private user:string
  private password:string

  private to:string
  private subject:string
   private text:string
  private html:string
  private readonly logger = new Logger(CorreosService.name);

  constructor (
    @InjectModel(Correo.name) private readonly CorreoSchema:Model<Correo>,
    @InjectModel(ConfiguracionNodeMailer.name) private readonly ConfiguracionNodeMailerSchema:Model<ConfiguracionNodeMailer>,
    // @Inject(forwardRef(()=>CalificacionService)) private readonly calificacionService:CalificacionService
  ){
    this.configuracionOne()
  }

  async createEmail(createCorreoDto: CreateCorreoDto) {
    await this.CorreoSchema.create(createCorreoDto)
    return {status:HttpStatus.CREATED}
  }

  async createConfiguracion(createConfiguracion:CreateConfiguracionDto){
    await this.ConfiguracionNodeMailerSchema.create(createConfiguracion)
    return {status:HttpStatus.CREATED}
  }

  private async configuracionOne(){
    const configuracion = await this.ConfiguracionNodeMailerSchema.findOne({flag:Flag.nuevo})
    const bodyEmail = await this.CorreoSchema.find({flag:Flag.nuevo}).limit(2)
      if(configuracion && bodyEmail.length > 0){
        this.host= configuracion.host
        this.port = configuracion.port
        this.user = configuracion.correo
        this.password = configuracion.password

        this.to= bodyEmail.map(email => email.to).join(", ")
        this.text= bodyEmail[0].text
        this.subject= bodyEmail[0].subject,
        this.html = bodyEmail[0].html

      }
     

  }

  private confiGuracionTransporter(){    
    const transporter = nodemailer.createTransport({
      host:this.host,
      port:this.port || 587,
      secure:false,
      auth:{
          user:this.user,
           pass:this.password
  
      },
      tls: {
          rejectUnauthorized: false 
      }
    })
    return transporter
  }
  
   async  enviarEmail(pdf:any[], ruta:string){    
    try {
      const info = await this.confiGuracionTransporter().sendMail({
        from:this.user,
        to:this.to,
        subject:this.subject,
        text:this.text,
        html:this.html,
        attachments: pdf.map((archivo)=> ({ filename: archivo, path:`${ruta}\\${archivo}`}) )
    }) 
   
    return info.messageId
    } catch (error) {
        console.log(error);
        
    }

}

listarEmail(){
  return this.CorreoSchema.find({flag:Flag.nuevo})
}

listarConfiguracion(){
  return this.ConfiguracionNodeMailerSchema.find({flag:Flag.nuevo})
}
@Cron(CronExpression.EVERY_5_MINUTES)
  async envioDesCorreosAutomaticos(){
    try {
      this.logger.debug('enviando correos')
     // await this.calificacionService.email()
      this.logger.debug('correos')
    } catch (error) {
      throw new BadGatewayException()
    }
  }
}
