import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCorreoDto } from './dto/create-correo.dto';
import { UpdateCorreoDto } from './dto/update-correo.dto';
import { CreateConfiguracionDto } from './dto/create-configuracion-correo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Correo } from './schema/correo.schema';
import { Model } from 'mongoose';
import { ConfiguracionNodeMailer } from './schema/configuracion.shema';

import * as nodemailer from 'nodemailer'
import { Flag } from 'src/common/enums/flag.enum';
import { log } from 'node:console';

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


  constructor (
    @InjectModel(Correo.name) private readonly CorreoSchema:Model<Correo>,
    @InjectModel(ConfiguracionNodeMailer.name) private readonly ConfiguracionNodeMailerSchema:Model<ConfiguracionNodeMailer>
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
    const bodyEmail = await this.CorreoSchema.findOne({flag:Flag.nuevo})    
      if(configuracion && bodyEmail){
        this.host= configuracion.host
        this.port = configuracion.port
        this.user = configuracion.correo
        this.password = configuracion.password

        this.to= bodyEmail.to
        this.text= bodyEmail.text
        this.subject= bodyEmail.subject,
        this.html = bodyEmail.html

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


  findAll() {
    return `This action returns all correos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} correo`;
  }

  update(id: number, updateCorreoDto: UpdateCorreoDto) {
    return `This action updates a #${id} correo`;
  }

  remove(id: number) {
    return `This action removes a #${id} correo`;
  }
}
