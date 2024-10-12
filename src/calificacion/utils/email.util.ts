import * as nodemailer from 'nodemailer'

const transporter =  nodemailer.createTransport({
    //service:'Gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:true,
    auth:{
        user:'kimysheeran@gmail.com',
         pass:'pfdp jytc btoc ylok'

    },
    tls: {
        rejectUnauthorized: false 
    }
})

export async function enviarEmail(pdf:any[], ruta:string){
    const info = await transporter.sendMail({
        from:'kimysheeran@gmail.com',
        to:'juancarloschocllu51@gmail.com',
        subject:'Informe de Calificaciones',
        text:'Informe de Calificaciones',
        html:'Informe de Calificaciones',
        attachments: pdf.map((archivo)=> ({ filename: archivo, path:`${ruta}\\${archivo}`}) )
    }) 
    return info.messageId

}