import { HttpStatus, Injectable, UseGuards , BadRequestException, Inject, forwardRef, Logger, BadGatewayException} from '@nestjs/common';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Calificacion } from './schemas/calificacion.schema';
import { Model, Types } from 'mongoose';
import { respuestaHttpI } from '../common/interfaces/respuestaHttp.interface';
import { EmpresaService } from 'src/empresa/empresa.service';
import { SucursalService } from 'src/sucursal/sucursal.service';
import { Flag } from 'src/common/enums/flag.enum';
import { generarPdfEmpresa } from './utils/pdf.util';

import { CalificacionesI, CalificacionI, nombreCalificacionesI } from './interfaces/calificaciones.interface';
import { CalificacionEnum } from './enums/calificacion.enum';


import * as path from 'path'
import * as fs from 'fs'
import { FiltroCalificacionesDto } from './dto/filtroCalificaciones.dto';
import { fechaFormateada } from 'src/utils/formateoFecha.util';
import { CorreosService } from 'src/correos/correos.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { log } from 'console';
import { Cron, CronExpression } from '@nestjs/schedule';




@Injectable()
export class CalificacionService {
  private readonly logger = new Logger(CalificacionService.name);

  constructor(
    @InjectModel(Calificacion.name)
    private readonly CalificacionSchema: Model<Calificacion>,
    protected readonly EmpresaService:EmpresaService,
    protected readonly sucursalService:SucursalService,
     private readonly correosService:CorreosService,
    private emiter :EventEmitter2
  ) {}

  async create(createCalificacionDto: CreateCalificacionDto) {
  try {
    await this.CalificacionSchema.create(
      createCalificacionDto,
    );
    const respuesta: respuestaHttpI<Calificacion> = {
      status: HttpStatus.CREATED
    };
    return respuesta;
  } catch (error) {
    throw new BadRequestException()
    
  }
  }

  async findAll() {
   return  this.informacionCalificacionPorDia()
   
   
  }

  private async informacionCalificacionPorDia() {    
    const diaHoy = new Date();
    const diaInicio = new Date(diaHoy.setHours(0, 0, 0, 0));
    const diaFin = new Date(diaHoy.setHours(23, 59, 59, 999))
    const sucursales=[]
    const calificaciones=[]
    const empresas = await this.EmpresaService.listarEmpresas()
    
    for(let empresa of empresas ){
      const sucursal = await this.sucursalService.listarSucursales(empresa._id)
      if(sucursal.length > 0){
      sucursales.push(...sucursal)            
      }
     
    }
    
    for(let data of sucursales){  
      const calificacion = await this.CalificacionSchema.aggregate([
        {
          $match:{
            sucursal: data._id,
            flag:Flag.nuevo,
            fecha:{
              $gte: diaInicio,
              $lte:diaFin
            }
          },
  
        },
        {
          $group:{
            _id:'$nombre',
            cantidad:{$sum:1}
          }
        },
        {
          $project:{
            _id:1,
            cantidad:1
          }
        }
      ])
      const empresa= await this.EmpresaService.findOne(`${data.empresa}`)
      const resultado={
        empresa:empresa.nombre,
        sucursal:data.nombre,
        bueno: calificacion.filter((item)=> item._id == CalificacionEnum.Bueno)[0]? calificacion.filter((item)=> item._id == CalificacionEnum.Bueno)[0] : {_id: CalificacionEnum.Bueno , cantidad:0},
        excelente: calificacion.filter((item)=> item._id == CalificacionEnum.excelente)[0] ? calificacion.filter((item)=> item._id == CalificacionEnum.excelente)[0] : {_id: CalificacionEnum.excelente , cantidad:0},
        Regular: calificacion.filter((item)=> item._id == CalificacionEnum.Regular)[0]? calificacion.filter((item)=> item._id == CalificacionEnum.Regular)[0] : {_id: CalificacionEnum.Regular , cantidad:0},
        Mala: calificacion.filter((item)=> item._id == CalificacionEnum.Mala)[0]? calificacion.filter((item)=> item._id == CalificacionEnum.Mala)[0] : {_id: CalificacionEnum.Mala , cantidad:0},
        MuyMala: calificacion.filter((item)=> item._id == CalificacionEnum.MuyMala)[0]? calificacion.filter((item)=> item._id == CalificacionEnum.MuyMala)[0] : {_id: CalificacionEnum.MuyMala , cantidad:0},
      }

      calificaciones.push(resultado)
     }        
      generarPdfEmpresa(calificaciones)
      return  {status:HttpStatus.OK}
      
  }



async email(){
  try {
  await this.informacionCalificacionPorDia()
  const date = new Date();
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const aqo = date.getFullYear();
  const ruta =  path.join(__dirname,'..', '..', 'pdf', `${dia}${mes}${aqo}`)
  const archivos = await  fs.promises.readdir(ruta)    
  const email = await this.correosService.enviarEmail(archivos,ruta )  
   if(email){
       return { status:HttpStatus.OK}
       }     
  throw new BadRequestException()
   
  } catch (error) {  
     throw new  BadRequestException('Realiza la cofiguracion correspondiente para el envio de correos')
  }
}


  async calificaciones(filtroCalificacionesDto:FiltroCalificacionesDto){
   const {fechaInicio, fechaFin}  =fechaFormateada(filtroCalificacionesDto.fechaInicio, filtroCalificacionesDto.fechaFin)
    const data:any[]=[]
    for (let su of filtroCalificacionesDto.sucursal){
      const sucursal = await this.sucursalService.buscarSucursal(su)
      const calificacion = await this.CalificacionSchema.aggregate([
        {
          $match:{
            sucursal:new Types.ObjectId(su),
            flag:Flag.nuevo,
            fecha:{
              $gte: fechaInicio,
              $lte: fechaFin
            }
          }
        },
      
        {
        $group:{
          _id:'$nombre',
          cantidad:{$sum:1}
        }
      },
      {
        $project:{
          _id:0,
          calificacion:'$_id',
          cantidad:1
        }
      }
      
        
      ])      
      const [sucur,cali] = await Promise.all([sucursal, calificacion])
      const resultado={
        sucursal:sucur.nombre,
        id:sucur.id,
        calificaciones:cali
      }
      data.push(resultado)
    }
    const totalCalificaciones=  this.contarCalificaiconesTotal(data)
    return {status:HttpStatus.OK,totalCalificaciones, data}
  }
  
  private contarCalificaiconesTotal(calificaciones:any[]){
     const totalCalficaciones:nombreCalificacionesI={
     Bueno:0,
     excelente:0,
     
     Mala:0,
     MuyMala:0,
     Regular:0
     }
     for(let data of  calificaciones){
       totalCalficaciones.Bueno = data.calificaciones.filter((cali:CalificacionI)=> cali.calificacion === CalificacionEnum.Bueno).reduce((total:number,calificacion:any)=>total + calificacion.cantidad ,  0)
       totalCalficaciones.excelente = data.calificaciones.filter((cali:CalificacionI)=> cali.calificacion === CalificacionEnum.excelente).reduce((total:number,calificacion:any)=>total + calificacion.cantidad ,  0)
       totalCalficaciones.Mala = data.calificaciones.filter((cali:CalificacionI)=> cali.calificacion === CalificacionEnum.Mala).reduce((total:number,calificacion:any)=>total + calificacion.cantidad ,  0)
       totalCalficaciones.MuyMala = data.calificaciones.filter((cali:CalificacionI)=> cali.calificacion === CalificacionEnum.MuyMala).reduce((total:number,calificacion:any)=>total + calificacion.cantidad ,  0)
       totalCalficaciones.Regular = data.calificaciones.filter((cali:CalificacionI)=> cali.calificacion === CalificacionEnum.Regular).reduce((total:number,calificacion:any)=>total + calificacion.cantidad ,  0)
      }
      return totalCalficaciones
   }


  async  contadorCalificacionDia(sucursal:string){
    const diaHoy = new Date();
    const diaInicio = new Date(diaHoy.setHours(0, 0, 0, 0));
    const diaFin = new Date(diaHoy.setHours(23, 59, 59, 999))
    const calificacion = await this.CalificacionSchema.countDocuments({fecha:{$gte:diaInicio,$lte:diaFin}, flag:Flag.nuevo, sucursal: new Types.ObjectId(sucursal)})
    return calificacion
   }

   @Cron(CronExpression.EVERY_DAY_AT_11PM)
   async envioDesCorreosAutomaticos(){
     try {
       this.logger.debug('enviando correos')
       await this.email()
     } catch (error) {
       throw new BadGatewayException()
     }
   }
  

}