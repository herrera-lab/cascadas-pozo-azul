// Intermediario entre la página y Google Apps Script.
// La URL del Apps Script y la clave secreta viven en las variables de entorno de Netlify,
// nunca en el código que descarga el navegador.

const CABANAS = { 'dos-pisos': 6, 'pequena': 4 }; // id → capacidad máxima
const MAX_NOCHES = 30;
const MAX_PERSONAS_ENTRADA = 60;
const MAX_BODY = 2000;

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

function json(data, status = 200){
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

function fechaValida(str){
  if(typeof str !== 'string' || !FECHA_RE.test(str)) return false;
  const d = new Date(str + 'T00:00:00Z');
  return !isNaN(d) && d.toISOString().slice(0, 10) === str;
}

function dias(desde, hasta){
  return (new Date(hasta + 'T00:00:00Z') - new Date(desde + 'T00:00:00Z')) / 86400000;
}

// Ayer en UTC: margen para la diferencia horaria con Costa Rica (UTC-6)
function ayer(){
  return new Date(Date.now() - 86400000).toISOString().slice(0, 10);
}

function entero(n, min, max){
  return Number.isInteger(n) && n >= min && n <= max;
}

function validarCabana(d){
  const capacidad = CABANAS[d.cabin_id];
  if(!capacidad) return 'Cabaña inválida';
  if(!fechaValida(d.checkin) || !fechaValida(d.checkout)) return 'Fechas inválidas';
  if(d.checkin < ayer()) return 'La fecha de entrada ya pasó';
  const noches = dias(d.checkin, d.checkout);
  if(noches < 1 || noches > MAX_NOCHES) return 'Cantidad de noches inválida';
  if(!entero(d.guests, 1, capacidad)) return 'Cantidad de huéspedes inválida';
  return null;
}

function validarEntrada(d){
  if(!fechaValida(d.fecha)) return 'Fecha inválida';
  if(d.fecha < ayer()) return 'La fecha ya pasó';
  if(!entero(d.adultos, 0, MAX_PERSONAS_ENTRADA) || !entero(d.ninos, 0, MAX_PERSONAS_ENTRADA)) return 'Cantidad de personas inválida';
  if(d.adultos + d.ninos < 1) return 'Debe haber al menos una persona';
  return null;
}

// Solo se aceptan envíos desde el propio sitio
function mismoOrigen(req){
  const origin = req.headers.get('origin');
  if(!origin) return false;
  try{ return new URL(origin).host === new URL(req.url).host; }
  catch(e){ return false; }
}

function urlAppsScript(){
  const base = process.env.APPS_SCRIPT_URL;
  const clave = process.env.APPS_SCRIPT_KEY;
  if(!base || !clave) return null;
  const url = new URL(base);
  url.searchParams.set('key', clave);
  return url;
}

async function leerReservas(){
  const url = urlAppsScript();
  if(!url) return json({ error: 'Servidor sin configurar' }, 500);

  const res = await fetch(url, { cache: 'no-store' });
  if(!res.ok) return json({ error: 'No se pudo consultar la disponibilidad' }, 502);
  const data = await res.json();
  // Si el Apps Script rechaza la clave responde 200 con { ok:false }: nunca mostrarlo como "todo libre"
  if(!data || !data.cabins || typeof data.cabins !== 'object'){
    console.error('[reservas] Respuesta inesperada del Apps Script:', data && data.error);
    return json({ error: 'No se pudo consultar la disponibilidad' }, 502);
  }

  // Solo fechas: cualquier otro dato (nombres, teléfonos…) nunca llega al navegador
  const cabins = {};
  for(const id of Object.keys(CABANAS)){
    const lista = Array.isArray(data.cabins[id]) ? data.cabins[id] : [];
    cabins[id] = lista.map(b => ({ checkin: String(b.checkin || ''), checkout: String(b.checkout || '') }));
  }
  return json({ cabins });
}

async function guardar(req){
  if(!mismoOrigen(req)) return json({ error: 'Origen no permitido' }, 403);

  const texto = await req.text();
  if(texto.length > MAX_BODY) return json({ error: 'Solicitud demasiado grande' }, 413);

  let d;
  try{ d = JSON.parse(texto); }catch(e){ return json({ error: 'JSON inválido' }, 400); }
  if(!d || typeof d !== 'object') return json({ error: 'Datos inválidos' }, 400);

  let limpio, error;
  if(d.type === 'cabin'){
    error = validarCabana(d);
    limpio = { type: 'cabin', cabin_id: d.cabin_id, checkin: d.checkin, checkout: d.checkout, guests: d.guests };
  }else if(d.type === 'entrada'){
    error = validarEntrada(d);
    limpio = { type: 'entrada', fecha: d.fecha, adultos: d.adultos, ninos: d.ninos };
  }else{
    error = 'Tipo inválido';
  }
  if(error) return json({ error }, 400);

  const url = urlAppsScript();
  if(!url) return json({ error: 'Servidor sin configurar' }, 500);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(limpio)
  });
  if(!res.ok) return json({ error: 'No se pudo registrar' }, 502);
  const resultado = await res.json().catch(() => null);
  if(!resultado || resultado.ok !== true){
    console.error('[reservas] El Apps Script no registró:', resultado && resultado.error);
    return json({ error: 'No se pudo registrar' }, 502);
  }
  return json({ ok: true });
}

export default async (req) => {
  try{
    if(req.method === 'GET') return await leerReservas();
    if(req.method === 'POST') return await guardar(req);
    return json({ error: 'Método no permitido' }, 405);
  }catch(err){
    console.error('[reservas]', err);
    return json({ error: 'Error interno' }, 500);
  }
};

export const config = { path: '/api/reservas' };
