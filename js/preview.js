import { formatMoneda } from './format.js';

export function renderPreview(p) {
  // Header
  document.getElementById('preview-numero').textContent = `N° ${p.numero}`;
  document.getElementById('preview-fecha').textContent = p.fecha;
  document.getElementById('preview-validez').textContent = `Validez: ${p.validez} días`;
  document.getElementById('preview-validez-footer').textContent = `Validez del presupuesto: ${p.validez} días`;

  // Datos cliente
  document.getElementById('preview-datos-cliente').innerHTML = `
    <div><b>Cliente:</b> ${p.cliente || '—'}</div>
    <div><b>Tel:</b> ${p.telefono || '—'}</div>
    <div><b>Domicilio:</b> ${p.domicilio || '—'}</div>
    <div><b>Localidad:</b> ${p.localidad || '—'}</div>
    <div><b>Vehículo:</b> ${p.vehiculo || '—'}</div>
    <div><b>Patente:</b> ${p.patente || '—'}</div>
  `;

  // Tabla de ítems
  const tbody = document.getElementById('preview-items-body');
  tbody.innerHTML = p.items.map((item, i) => `
    <tr${i % 2 === 1 ? ' style="background:var(--gris-claro)"' : ''}>
      <td class="cant">${item.cant}</td>
      <td>${item.detalle || '—'}</td>
      <td class="precio">${formatMoneda(item.precioUnit)}</td>
      <td class="importe">${formatMoneda(item.importe)}</td>
    </tr>
  `).join('');

  // Total
  document.getElementById('preview-total').textContent = `TOTAL: ${formatMoneda(p.total)}`;
}
