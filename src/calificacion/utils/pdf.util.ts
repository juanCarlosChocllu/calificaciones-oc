import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { CalificacionesI } from '../interfaces/calificaciones.interface';

export async function generarPdfEmpresa(data: CalificacionesI[]) {    
    const date = new Date();
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const aqo = date.getFullYear();

    const pdfPath = path.join(__dirname, '..', '..', '..', 'pdf');
    const pdfPathCarpetas = path.join(__dirname, '..', '..', '..', 'pdf', `${dia}${mes}${aqo}`);
    if (!fs.existsSync(pdfPath)) {
        fs.mkdirSync(pdfPath, { recursive: true });
    }

    if (!fs.existsSync(pdfPathCarpetas)) {
        fs.mkdirSync(pdfPathCarpetas, { recursive: true });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();    
    for (let calificacion of data) {

        let htmlContent = `
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <style>
                body {
                    background-color: #f4f4f9;
                }
                h1 {
                    color: #007bff;
                    margin: 20px 0;
                    font-size: 24px; /* Tamaño reducido */
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Sombra */
                }
                .card {
                    margin-bottom: 20px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra en la tarjeta */
                }
                .card-title {
                    font-size: 18px; /* Tamaño reducido */
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Sombra */
                }
                p {
                    font-size: 14px; /* Tamaño reducido */
                }
                .rating {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    padding: 5px 15px; /* Tamaño ajustado */
                    border-radius: 5px;
                    font-size: 14px; /* Tamaño reducido */
                    margin: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="text-center">${calificacion.empresa}</h1>
                <div class="row">`;

        for (let sucursal of calificacion.sucursales) {
            htmlContent += `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h2 class="card-title">Sucursal: ${sucursal.sucursal}</h2>`;
            
            for (let calificacion of sucursal.calificaciones) {
                htmlContent += `
                    <p><strong>Calificación:</strong> ${calificacion._id}</p>
                    <p><strong>Cantidad:</strong> ${calificacion.cantidad}</p>`;
            }
            htmlContent += `</div></div></div>`;
        }

        htmlContent += `
                </div>
            </div>
        </body>
        </html>`;

        const archivo = path.join(pdfPathCarpetas, `${calificacion.empresa}${aqo}${mes}${dia}.pdf`);
     
    
        await page.setContent(htmlContent);
        await page.pdf({
            path: archivo,
            format: 'A4',
            printBackground: true
        });
    }

    await browser.close();
}


export async function emailBody(data: CalificacionesI[]) {

    let emailContent = `
    <html>
    <head>
        <style>
            /* Aseguramos que los estilos de Bootstrap se apliquen bien en los correos */
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border: 1px solid #ddd;
            }
            th {
                background-color: #f8f9fa;
            }
            .container {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f9f9f9;
                border-radius: 10px;
                padding: 20px;
            }
            h1, h3 {
                color: #007bff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="text-center">Calificaciones de Sucursales por Empresa</h1>
    `;


    data.forEach(empresaData => {
  
        emailContent += `
            <h3>${empresaData.empresa}</h3>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Sucursal</th>
                    </tr>
                </thead>
                <tbody>
        `;


        empresaData.sucursales.forEach(sucursal => {
            emailContent += `
                <tr>
                    <td> </td>
                </tr>
            `;
        });

    
        emailContent += `
                </tbody>
            </table>
        `;
    });


    emailContent += `
            <p class="text-center">Gracias por su atención.</p>
        </div>
    </body>
    </html>
    `;

   
    return emailContent;
}
