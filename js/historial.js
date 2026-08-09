import { getPresupuestos, eliminarPresupuesto } from './storage.js';
import { formatMoneda } from './format.js';

export function renderHistorial(onAbrir) {
  const lista = getPresupuestos();
  const container = document.getElementById('historial-lista');

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size:2.5rem">📋</div>
        <p>No hay presupuestos guardados todavía.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = lista.map(p => `
    <div class="historial-item" data-numero="${p.numero}">
      <div class="historial-info">
        <div class="numero">N° ${p.numero}</div>
        <div class="cliente">${p.cliente || '(sin cliente)'} · ${p.vehiculo || ''}</div>
        <div class="meta">${p.fecha}${p.patente ? ' · ' + p.patente : ''}</div>
        <div class="total">${formatMoneda(p.total)}</div>
      </div>
      <div class="historial-acciones">
        <button class="btn btn-primary btn-sm btn-abrir" data-numero="${p.numero}">Abrir</button>
        <button class="btn btn-danger btn-sm btn-eliminar" data-numero="${p.numero}">✕</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-abrir').forEach(btn => {
    btn.addEventListener('click', e => {
      onAbrir(parseInt(e.currentTarget.dataset.numero, 10));
    });
  });

  container.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', e => {
      const num = parseInt(e.currentTarget.dataset.numero, 10);
      if (confirm(`¿Eliminar el presupuesto N° ${num}?`)) {
        eliminarPresupuesto(num);
        renderHistorial(onAbrir);
      }
    });
  });
}
