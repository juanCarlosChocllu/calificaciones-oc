import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export async function generarPdfEmpresa(data: any[]) {
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


    const empresas: { [key: string]: any[] } = {};
    
    for (let calificacion of data) {
        if (!empresas[calificacion.empresa]) {
            empresas[calificacion.empresa] = [];
        }
        empresas[calificacion.empresa].push(calificacion);
    }
    for (let empresaName in empresas) {
        const sucursales = empresas[empresaName];
        let totalExcelente = 0;
        let totalBueno = 0;
        let totalRegular = 0;
        let totalMala = 0;
        let totalMuyMala = 0;
        let htmlContent = `
        <html>
        <head>
        <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
        <div class="container mx-auto p-4">
          <div class="text-right text-sm mb-4">
            <span>Fecha del reporte: ${dia}/${mes}/${aqo}</span>
        </div>
        <h1 class="text-center text-2xl font-bold">${empresaName}</h1>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded-lg border">
                <thead class="bg-blue-500 text-white">
                    <tr>
                        <th class="px-4 py-2 border">Sucursal</th>
                        <th class="px-4 py-2 border">Muy Bueno</th>
                        <th class="px-4 py-2 border">Bueno</th>
                        <th class="px-4 py-2 border">Aceptable</th>
                        <th class="px-4 py-2 border">Deficiente</th>
                        <th class="px-4 py-2 border">Malo</th>
                    </tr>
                </thead>
                <tbody>
        `;
        for (let sucursal of sucursales) {
            totalExcelente += sucursal.excelente.cantidad;
            totalBueno += sucursal.bueno.cantidad;
            totalRegular += sucursal.Regular.cantidad;
            totalMala += sucursal.Mala.cantidad;
            totalMuyMala += sucursal.MuyMala.cantidad;
            htmlContent += `
            <tr class="border-b">
                <td class="px-4 text-center py-2 font-medium border">${sucursal.sucursal}</td>
                <td class="px-4 text-center py-2 border">${sucursal.excelente.cantidad}</td>
                <td class="px-4 text-center py-2 border">${sucursal.bueno.cantidad}</td>
                <td class="px-4 text-center py-2 border">${sucursal.Regular.cantidad}</td>
                <td class="px-4 text-center py-2 border">${sucursal.Mala.cantidad}</td>
                <td class="px-4 text-center py-2 border">${sucursal.MuyMala.cantidad}</td>
            </tr>
            `;
        }
        htmlContent += `
                </tbody>
                <tfoot class="bg-gray-100">
                    <tr>
                        <td class="px-4 text-center py-2 font-medium border">Total</td>
                        <td class="px-4 text-center py-2 font-medium border">${totalExcelente}</td>
                        <td class="px-4 text-center py-2 border">${totalBueno}</td>
                        <td class="px-4 text-center py-2 border">${totalRegular}</td>
                        <td class="px-4 text-center py-2 border">${totalMala}</td>
                        <td class="px-4 text-center py-2 border">${totalMuyMala}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        </div>
        </body>
        </html>
        `;
        const archivo = path.join(pdfPathCarpetas, `${empresaName}${aqo}${mes}${dia}.pdf`);
        await page.setContent(htmlContent);
        await page.pdf({
            path: archivo,
            format: 'A4',
            printBackground: true
        });
    }

    await browser.close();
}
