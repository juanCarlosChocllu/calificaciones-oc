export async function cuerpoEmail(data: any[]) {
  const date = new Date();
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const aqo = date.getFullYear();
  let cuerpo: string = '';

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
            <table class="min-w-full bg-white shadow-md rounded-lg border-collapse">
                <thead class="bg-blue-500 text-white">
                    <tr>
                        <th class="px-4 py-2 border border-white">Sucursal</th>
                        <th class="px-4 py-2 border border-white">Muy Bueno</th>
                        <th class="px-4 py-2 border border-white">Bueno</th>
                        <th class="px-4 py-2 border border-white">Aceptable</th>
                        <th class="px-4 py-2 border border-white">Deficiente</th>
                        <th class="px-4 py-2 border border-white">Malo</th>
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
            <tr class="border-b border-white">
                <td class="px-4 text-center py-2 font-medium border border-white">${sucursal.sucursal}</td>
                <td class="px-4 text-center py-2 border border-white">${sucursal.excelente.cantidad}</td>
                <td class="px-4 text-center py-2 border border-white">${sucursal.bueno.cantidad}</td>
                <td class="px-4 text-center py-2 border border-white">${sucursal.Regular.cantidad}</td>
                <td class="px-4 text-center py-2 border border-white">${sucursal.Mala.cantidad}</td>
                <td class="px-4 text-center py-2 border border-white">${sucursal.MuyMala.cantidad}</td>
            </tr>
      `;
    }
    htmlContent += `
                </tbody>
                <tfoot class="bg-gray-100">
                    <tr>
                        <td class="px-4 text-center py-2 font-medium border border-white">Total</td>
                        <td class="px-4 text-center py-2 font-medium border border-white">${totalExcelente}</td>
                        <td class="px-4 text-center py-2 border border-white">${totalBueno}</td>
                        <td class="px-4 text-center py-2 border border-white">${totalRegular}</td>
                        <td class="px-4 text-center py-2 border border-white">${totalMala}</td>
                        <td class="px-4 text-center py-2 border border-white">${totalMuyMala}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        </div>
        </body>
        </html>
    `;

    cuerpo += htmlContent;
  }
  
  return cuerpo;
}
