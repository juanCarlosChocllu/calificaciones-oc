import {BadGatewayException, Body, forwardRef, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCorreoDto } from './dto/create-correo.dto';

import { CreateConfiguracionDto } from './dto/create-configuracion-correo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Correo } from './schema/correo.schema';
import { Model, Types } from 'mongoose';
import { ConfiguracionNodeMailer } from './schema/configuracion.shema';

import * as nodemailer from 'nodemailer'
import { Flag } from 'src/common/enums/flag.enum';

import { UpdateCreateConfiguracionDto } from './dto/update-configuracion-correo.dto';
import { UpdateCorreoDto } from './dto/update-correo.dto';


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
    @InjectModel(ConfiguracionNodeMailer.name) private readonly ConfiguracionNodeMailerSchema:Model<ConfiguracionNodeMailer>,
    // @Inject(forwardRef(()=>CalificacionService)) private readonly calificacionService:CalificacionService
  ){
   
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

  private configuracionTransporter() { 
    const transporter = nodemailer.createTransport({
      host: this.host.trim(),
      port: this.port,
      secure: true,
      auth: {
        user: this.user,
        pass: this.password
      },
      tls: {
        rejectUnauthorized: false 
      },
      connectionTimeout: 10000, 
      socketTimeout: 10000 
    });
    return transporter;
}
   async  enviarEmail(pdf:any[], ruta:string, cuerpo:string){    
   
    try {
      await this.configuracionOne()
      const body = this.html + cuerpo
      const info = await this.configuracionTransporter().sendMail({
        from:this.user,
        to:this.to,
        subject:this.subject,
        text:this.text,
        html:body,
        attachments: pdf.map((archivo)=> ({ filename: archivo, path:`${ruta}\\${archivo}`}) )
    })     
    return info.messageId
    } catch (error) {
      throw error
        
    }

}

listarEmail(){
  return this.CorreoSchema.find({flag:Flag.nuevo})
}

listarConfiguracion(){
  return this.ConfiguracionNodeMailerSchema.find({flag:Flag.nuevo})
}
  async soffDelete(id:string){
      const correo = await this.CorreoSchema.findById(id)
    if(!correo){
      throw new NotFoundException() 
    }
    await this.CorreoSchema.updateOne({_id:id},{flag:Flag.eliminado})
    return {status:HttpStatus.OK}
}

async soffDeleteConfiguracion(id:string){
  const configuracion = await this.ConfiguracionNodeMailerSchema.findById(id)
  if(!configuracion){
    throw new NotFoundException() 
  }
  await this.ConfiguracionNodeMailerSchema.updateOne({_id:id},{flag:Flag.eliminado})

  
  return {status:HttpStatus.OK}

}

async gmailUpdate(id:string,updateCorreoDto:UpdateCorreoDto){
  const correo = await this.CorreoSchema.findById(id)
  if(!correo){
    throw new NotFoundException() 
  }
  await this.CorreoSchema.updateOne({_id:id},updateCorreoDto)
  return {status:HttpStatus.OK}
  
}
async configuracionUpdate(id:string, updateCreateConfiguracionDto:UpdateCreateConfiguracionDto){
  const configuracion = await this.ConfiguracionNodeMailerSchema.findById(id)
  if(!configuracion){
    throw new NotFoundException() 
  }
  await this.ConfiguracionNodeMailerSchema.updateOne({_id:id},updateCreateConfiguracionDto)
  return {status:HttpStatus.OK} 
}
}
