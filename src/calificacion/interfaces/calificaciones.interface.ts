export interface CalificacionesI {
    empresa: string;
    sucursales: Sucursal[];
}

interface Sucursal {
    sucursal: string;
    excelente:number,
    Bueno :number,
    Regular :number,
    Mala :number,
    MuyMala:number,
    calificaciones: Calificacion[];
}

interface Calificacion {
    _id: string;
    cantidad: number;
}
export interface nombreCalificacionesI {
  
    excelente:number,
    Bueno :number,
    Regular :number,
    Mala :number,
    MuyMala:number,
   
}

export interface CalificacionI {
    _id: string;
    cantidad: number;
}

