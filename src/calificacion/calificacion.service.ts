import { HttpStatus, Injectable, UseGuards , BadRequestException} from '@nestjs/common';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Calificacion } from './schemas/calificacion.schema';
import { Model, Types } from 'mongoose';
import { respuestaHttpI } from '../common/interfaces/respuestaHttp.interface';
import { EmpresaService } from 'src/empresa/empresa.service';
import { log } from 'node:console';
import { SucursalService } from 'src/sucursal/sucursal.service';
import { Flag } from 'src/common/enums/flag.enum';
import { Type } from 'class-transformer';
import { generarPdfEmpresa } from './utils/pdf.util';
import { enviarEmail } from './utils/email.util';
import { CalificacionesI, CalificacionI, nombreCalificacionesI } from './interfaces/calificaciones.interface';
import { CalificacionEnum } from './enums/calificacion.enum';


import * as path from 'path'
import * as fs from 'fs'
import { FiltroCalificacionesDto } from './dto/filtroCalificaciones.dto';
import { promises } from 'node:dns';
import { fechaFormateada } from 'src/utils/formateoFecha.util';





@Injectable()
export class CalificacionService {
  constructor(
    @InjectModel(Calificacion.name)
    private readonly CalificacionSchema: Model<Calificacion>,
    protected readonly EmpresaService:EmpresaService,
    protected readonly sucursalService:SucursalService
  ) {}

  async create(createCalificacionDto: CreateCalificacionDto) {
    const calificacion = await this.CalificacionSchema.create(
      createCalificacionDto,
    );
    const respuesta: respuestaHttpI<Calificacion> = {
      status: HttpStatus.CREATED,
      data: calificacion,
    };
    return respuesta;
  }

  async findAll() {
   return await this.informacionCalificacionPorDia()
   
   
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
        calificacion
      }
      calificaciones.push(resultado)
    }

    const dataAgrupada:CalificacionesI[]=  this.agruparPorEmpresa(calificaciones)
     generarPdfEmpresa(dataAgrupada)

      return  {status:HttpStatus.OK}
      
  }


   agruparPorEmpresa(data:any[]) {
    const groupedByEmpresa = data.reduce((acc, item) => {
   
      if (!acc[item.empresa]) {
        acc[item.empresa] = {
          empresa: item.empresa,
          sucursales: []
        };
      }
    

      let sucursal = acc[item.empresa].sucursales.find(s => s.sucursal === item.sucursal);

      if (!sucursal) {
        sucursal = {
          sucursal: item.sucursal,
          calificaciones: []
        };        
        acc[item.empresa].sucursales.push(sucursal);
      }
      sucursal.calificaciones.push(...item.calificacion);
 
      return acc;
    }, {});
    const result:CalificacionesI[] = Object.values(groupedByEmpresa);
   return result
}
async email(){
  const date = new Date();
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const aqo = date.getFullYear();
  try {
    const ruta =  path.join(__dirname,'..', '..', 'pdf', `${dia}${mes}${aqo}`)
    const archivos = await  fs.promises.readdir(ruta)    
    const email = await enviarEmail(archivos,ruta )
    return { status:HttpStatus.OK}
  } catch (error) {    
     throw new  BadRequestException()
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
}