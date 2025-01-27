
export function fechaFormateada(fechaInicio:string, fechaFin:string){
    return{
        fechaInicio: new Date(`${fechaInicio}T00:00:00Z`),
        fechaFin: new Date(`${fechaFin}T23:59:59.999Z`)
    }

}