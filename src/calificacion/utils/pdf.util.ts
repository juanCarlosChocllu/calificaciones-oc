import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { CalificacionesI } from '../interfaces/calificaciones.interface';
import { CalificacionEnum } from '../enums/calificacion.enum';

export async function generarPdfEmpresa(data: CalificacionesI[]) {
    const pdfPath = path.join(__dirname, '..', '..', '..', 'pdf');
    
    if (!fs.existsSync(pdfPath)) {
        fs.mkdirSync(pdfPath, { recursive: true });
    }
    
    const date = new Date();
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const aqo = date.getFullYear();


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    
    for (let calificacion of data) {
        let htmlContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 0; 
                    background-color: #f4f4f9; 
                    color: #333;
                }
                h1 {
                    color: #007bff; 
                    text-align: center; 
                    margin: 20px 0;
                }
                .container {
                    display: flex; 
                    flex-wrap: wrap; 
                    gap: 20px; 
                    justify-content: center;
                    padding: 0 20px;
                }
                .card {
                    background-color: #fff;
                    border: 1px solid #ddd; 
                    border-radius: 8px; 
                    padding: 20px; 
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1); 
                    width: 300px; 
                    box-sizing: border-box;
                    transition: transform 0.2s;
                }
                .card:hover {
                    transform: scale(1.03);
                }
                .card h2 {
                    margin: 0 0 10px; 
                    font-size: 18px; 
                    color: #007bff;
                }
                .card p {
                    margin: 5px 0; 
                    font-size: 14px;
                }
                .rating-container {
                    text-align: center; 
                    margin: 30px 0;
                }
                .rating {
                    display: inline-block; 
                    background-color: #007bff; 
                    color: #fff; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    font-size: 16px; 
                    margin: 5px;
                }
            </style>
        </head>
        <body>
            <h1>${calificacion.empresa}</h1>
         
            <div class="container">`;

        
        for (let sucursal of calificacion.sucursales) {
            htmlContent += `
                <div class="card">
                    <h2>Sucursal: ${sucursal.sucursal}</h2>`;
                
            for (let calificacion of sucursal.calificaciones) {
              
                
                htmlContent += `
                    <p><strong>Nombre:</strong> ${calificacion._id}</p>
                    <p><strong>Cantidad:</strong> ${calificacion.cantidad}</p>`;
            }
            htmlContent += `</div>`;
        }
        
        htmlContent += `</div>
        </body>
        </html>`;
        
  
        const archivo = path.join(pdfPath, `${calificacion.empresa}_${aqo}_${mes}_${dia}.pdf`);


        await page.setContent(htmlContent);


        await page.pdf({
            path: archivo,
            format: 'A4',
            printBackground: true
        });


    }

    await browser.close();
}


