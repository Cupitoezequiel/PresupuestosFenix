import { initFormulario, getFormData, cargarPresupuesto, limpiarFormulario } from './formulario.js';
import { renderPreview } from './preview.js';
import { renderHistorial } from './historial.js';
import { generarYCompartirPDF } from './pdf.js';
import { guardarPresupuesto, getPresupuesto, incrementarNumero } from './storage.js';

// Routing
function mostrarPantalla(nombre) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${nombre}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.screen === nombre);
  });
  if (nombre === 'historial') renderHistorial(abrirDesdeHistorial);
}

// Toast
function toast(msg, duracion = 2500) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duracion);
}

// Spinner
function spinner(visible) {
  document.getElementById('spinner').classList.toggle('show', visible);
}

// Compartir PDF
async function compartir() {
  const p = getFormData();
  if (!p.cliente && !p.vehiculo) {
    toast('Completá al menos el cliente o el vehículo antes de compartir.');
    return;
  }
  renderPreview(p);
  spinner(true);
  // documento-preview vive dentro de screen-preview: si esa pantalla no está
  // activa, el div se renderiza con tamaño 0x0 y html2canvas falla al toque.
  // La activamos brevemente; el overlay del spinner la tapa mientras tanto.
  const screenPreview = document.getElementById('screen-preview');
  const yaEstabaActiva = screenPreview.classList.contains('active');
  if (!yaEstabaActiva) screenPreview.classList.add('active');
  try {
    const resultado = await generarYCompartirPDF(p.numero);
    guardarPresupuesto(p);
    if (resultado === 'descargado') {
      toast('✓ PDF descargado. Buscalo en "Descargas" para enviarlo por WhatsApp.', 4000);
    } else {
      toast('✓ Presupuesto guardado');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      toast('Error al generar el PDF. Intentá de nuevo.');
      console.error(err);
    }
  } finally {
    if (!yaEstabaActiva) screenPreview.classList.remove('active');
    spinner(false);
  }
}

// Abrir presupuesto desde historial
function abrirDesdeHistorial(numero) {
  const p = getPresupuesto(numero);
  if (!p) return;
  cargarPresupuesto(p);
  mostrarPantalla('formulario');
}

// Init
initFormulario();

// Botones de navegación
document.querySelectorAll('.nav-btn[data-screen]').forEach(btn => {
  btn.addEventListener('click', () => mostrarPantalla(btn.dataset.screen));
});

// Botón nuevo
document.getElementById('btn-nuevo').addEventListener('click', () => {
  if (confirm('¿Empezar un presupuesto nuevo? Se perderán los datos no guardados.')) {
    const nuevoNumero = incrementarNumero();
    limpiarFormulario(nuevoNumero);
    toast('Presupuesto nuevo listo');
  }
});

// Botón vista previa
document.getElementById('btn-preview').addEventListener('click', () => {
  const p = getFormData();
  renderPreview(p);
  mostrarPantalla('preview');
});

// Botón compartir (desde formulario)
document.getElementById('btn-compartir').addEventListener('click', compartir);

// Botón volver en preview
document.getElementById('btn-preview-volver').addEventListener('click', () => mostrarPantalla('formulario'));

// Botón compartir en preview
document.getElementById('btn-preview-compartir').addEventListener('click', async () => {
  const p = getFormData();
  spinner(true);
  try {
    const resultado = await generarYCompartirPDF(p.numero);
    guardarPresupuesto(p);
    if (resultado === 'descargado') {
      toast('✓ PDF descargado. Buscalo en "Descargas" para enviarlo por WhatsApp.', 4000);
    } else {
      toast('✓ Presupuesto guardado');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      toast('Error al generar PDF.');
      console.error(err);
    }
  } finally {
    spinner(false);
  }
});

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
