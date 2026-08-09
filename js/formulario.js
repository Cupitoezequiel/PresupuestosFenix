import { formatMiles, parseMiles, formatMoneda } from './format.js';
import { getUltimoNumero } from './storage.js';

let items = [];

export function initFormulario() {
  const btnAgregar = document.getElementById('btn-agregar-item');
  const campoNumero = document.getElementById('campo-numero');
  const campoValidez = document.getElementById('campo-validez');

  // Número y fecha iniciales
  campoNumero.value = getUltimoNumero();
  actualizarHeaderFormulario();

  // Agregar primera fila vacía
  agregarFila();

  // Eventos
  btnAgregar.addEventListener('click', () => agregarFila());
  campoNumero.addEventListener('input', actualizarHeaderFormulario);
  campoValidez.addEventListener('input', actualizarHeaderFormulario);
}

function actualizarHeaderFormulario() {
  const num = document.getElementById('campo-numero').value;
  const validez = document.getElementById('campo-validez').value || 15;
  document.getElementById('display-numero').textContent = `N° ${num}`;
  document.getElementById('display-fecha').textContent = fechaHoy();
  document.getElementById('display-validez').textContent = `Validez: ${validez} días`;
}

export function fechaHoy() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

export function agregarFila(item = { cant: 1, detalle: '', precioUnit: 0, importe: 0 }) {
  const id = Date.now() + Math.random();
  items.push({ id, ...item });
  renderFilas();
}

function renderFilas() {
  const body = document.getElementById('items-body');
  body.innerHTML = '';
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cant">
        <input type="number" min="1" value="${item.cant}" data-id="${item.id}" data-campo="cant">
      </td>
      <td>
        <input type="text" value="${item.detalle}" placeholder="Descripción del trabajo" data-id="${item.id}" data-campo="detalle">
      </td>
      <td class="precio">
        <input type="text" inputmode="numeric" value="${item.precioUnit ? formatMiles(item.precioUnit) : ''}" placeholder="0" data-id="${item.id}" data-campo="precioUnit">
      </td>
      <td class="importe">${item.importe ? formatMoneda(item.importe) : '$ 0'}</td>
      <td>
        <button class="btn-eliminar-fila" data-id="${item.id}" title="Eliminar">✕</button>
      </td>
    `;
    body.appendChild(tr);
  });

  // Eventos de las filas
  body.querySelectorAll('input[data-campo]').forEach(input => {
    input.addEventListener('change', onCampoChange);
    input.addEventListener('blur', onCampoBlur);
  });
  body.querySelectorAll('.btn-eliminar-fila').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseFloat(e.currentTarget.dataset.id);
      items = items.filter(i => i.id !== id);
      renderFilas();
      calcularTotal();
    });
  });
}

function onCampoChange(e) {
  const id = parseFloat(e.target.dataset.id);
  const campo = e.target.dataset.campo;
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (campo === 'cant') {
    item.cant = parseInt(e.target.value, 10) || 1;
  } else if (campo === 'detalle') {
    item.detalle = e.target.value;
  } else if (campo === 'precioUnit') {
    item.precioUnit = parseMiles(e.target.value);
  }
  item.importe = (item.cant || 0) * (item.precioUnit || 0);
  renderFilas();
  calcularTotal();
}

function onCampoBlur(e) {
  // Reformatear precio al perder foco
  if (e.target.dataset.campo === 'precioUnit') {
    const val = parseMiles(e.target.value);
    e.target.value = val ? formatMiles(val) : '';
  }
}

export function calcularTotal() {
  const total = items.reduce((acc, i) => acc + (i.importe || 0), 0);
  document.getElementById('total-display').textContent = `TOTAL: ${formatMoneda(total)}`;
  return total;
}

export function getFormData() {
  return {
    numero: parseInt(document.getElementById('campo-numero').value, 10),
    fecha: fechaHoy(),
    validez: parseInt(document.getElementById('campo-validez').value, 10) || 15,
    cliente: document.getElementById('campo-cliente').value.trim(),
    telefono: document.getElementById('campo-telefono').value.trim(),
    domicilio: document.getElementById('campo-domicilio').value.trim(),
    localidad: document.getElementById('campo-localidad').value.trim(),
    vehiculo: document.getElementById('campo-vehiculo').value.trim(),
    patente: document.getElementById('campo-patente').value.trim(),
    items: items.map(({ id, ...rest }) => rest),
    total: calcularTotal(),
  };
}

export function cargarPresupuesto(p) {
  document.getElementById('campo-numero').value = p.numero;
  document.getElementById('campo-validez').value = p.validez;
  document.getElementById('campo-cliente').value = p.cliente || '';
  document.getElementById('campo-telefono').value = p.telefono || '';
  document.getElementById('campo-domicilio').value = p.domicilio || '';
  document.getElementById('campo-localidad').value = p.localidad || '';
  document.getElementById('campo-vehiculo').value = p.vehiculo || '';
  document.getElementById('campo-patente').value = p.patente || '';
  items = p.items.map(i => ({ id: Date.now() + Math.random(), ...i }));
  renderFilas();
  calcularTotal();
  actualizarHeaderFormulario();
}

export function limpiarFormulario(nuevoNumero) {
  document.getElementById('campo-numero').value = nuevoNumero;
  document.getElementById('campo-validez').value = 15;
  document.getElementById('campo-cliente').value = '';
  document.getElementById('campo-telefono').value = '';
  document.getElementById('campo-domicilio').value = '';
  document.getElementById('campo-localidad').value = '';
  document.getElementById('campo-vehiculo').value = '';
  document.getElementById('campo-patente').value = '';
  items = [];
  agregarFila();
  calcularTotal();
  actualizarHeaderFormulario();
}
