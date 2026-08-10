async function crearPDFBlob(numeroPresupuesto) {
  const elemento = document.getElementById('documento-preview');
  const { jsPDF } = window.jspdf;

  // Capturar el elemento como imagen
  const canvas = await html2canvas(elemento, {
    scale: 2,           // Alta resolución
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.92);
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Crear PDF tamaño A4
  const pdfWidth = 210;  // mm
  const pdfHeight = Math.round((imgHeight * pdfWidth) / imgWidth);

  const pdf = new jsPDF({
    orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

  const nombreArchivo = `Presupuesto-Fenix-${numeroPresupuesto}.pdf`;
  const blob = pdf.output('blob');
  return { blob, nombreArchivo };
}

function descargarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}

// Solo genera y descarga el PDF, sin intentar compartir. Sirve para probar
// que la generación funciona en un dispositivo, aislada del share nativo.
export async function descargarPDF(numeroPresupuesto) {
  const { blob, nombreArchivo } = await crearPDFBlob(numeroPresupuesto);
  descargarBlob(blob, nombreArchivo);
}

export async function generarYCompartirPDF(numeroPresupuesto) {
  const { blob, nombreArchivo } = await crearPDFBlob(numeroPresupuesto);
  const file = new File([blob], nombreArchivo, { type: 'application/pdf' });

  // Intentar Web Share API (Android Chrome)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Presupuesto Fénix N° ${numeroPresupuesto}`,
      });
      return 'compartido';
    } catch (err) {
      if (err.name === 'AbortError') throw err; // el usuario canceló, no descargar
      console.error('navigator.share falló, uso descarga directa:', err);
      // sigue a la descarga directa abajo
    }
  }

  // Fallback: descarga directa
  descargarBlob(blob, nombreArchivo);
  return 'descargado';
}
