const CLAVE_NUMERO = 'fenix_ultimo_numero';
const CLAVE_PRESUPUESTOS = 'fenix_presupuestos';
const NUMERO_INICIAL = 100024;

export function getUltimoNumero() {
  return parseInt(localStorage.getItem(CLAVE_NUMERO) || NUMERO_INICIAL, 10);
}

export function incrementarNumero() {
  const nuevo = getUltimoNumero() + 1;
  localStorage.setItem(CLAVE_NUMERO, nuevo);
  return nuevo;
}

export function getPresupuestos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PRESUPUESTOS) || '[]');
  } catch {
    return [];
  }
}

export function guardarPresupuesto(presupuesto) {
  const lista = getPresupuestos();
  const idx = lista.findIndex(p => p.numero === presupuesto.numero);
  if (idx >= 0) {
    lista[idx] = presupuesto;
  } else {
    lista.unshift(presupuesto);
  }
  localStorage.setItem(CLAVE_PRESUPUESTOS, JSON.stringify(lista));
}

export function eliminarPresupuesto(numero) {
  const lista = getPresupuestos().filter(p => p.numero !== numero);
  localStorage.setItem(CLAVE_PRESUPUESTOS, JSON.stringify(lista));
}

export function getPresupuesto(numero) {
  return getPresupuestos().find(p => p.numero === numero) || null;
}
