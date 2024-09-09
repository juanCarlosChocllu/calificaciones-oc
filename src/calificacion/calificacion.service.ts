import { HttpStatus, Injectable, UseGuards } from '@nestjs/common';
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
import { CalificacionesI } from './interfaces/calificaciones.interface';
import { CalificacionEnum } from './enums/calificacion.enum';



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
            flag:Flag.nuevo
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
   /*
   private sumarCalificaciones(calificaciones:CalificacionesI[]){
    const calificaiconTotal={
        excelente:0,
        Bueno :0,
        Regular:0,
        Mala :0,
        MuyMala :0,
    }
    for(let data of calificaciones){
        for(let suc of data.sucursales){
            let excelente = suc.calificaciones.filter((item)=> item._id == CalificacionEnum.excelente)
            calificaiconTotal.excelente= excelente.reduce((total, cant)=> total + cant.cantidad, 0)
            
            let bueno = suc.calificaciones.filter((item)=> item._id == CalificacionEnum.Bueno)
            calificaiconTotal.Bueno= bueno.reduce((total, cant)=> total + cant.cantidad, 0)
            
            let Regular = suc.calificaciones.filter((item)=> item._id == CalificacionEnum.Regular)
            calificaiconTotal.Regular= Regular.reduce((total, cant)=> total + cant.cantidad, 0)
            
            let Mala = suc.calificaciones.filter((item)=> item._id == CalificacionEnum.Mala)
            calificaiconTotal.Mala= Mala.reduce((total, cant)=> total + cant.cantidad, 0)
                      
            let MuyMala = suc.calificaciones.filter((item)=> item._id == CalificacionEnum.MuyMala)
            calificaiconTotal.MuyMala= MuyMala.reduce((total, cant)=> total + cant.cantidad, 0)
            
            
            
        }
        console.log(calificaiconTotal);
        
        
    }
    return calificaiconTotal
    
}*/



}