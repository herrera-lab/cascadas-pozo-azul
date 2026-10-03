 /* ============================================================
   CONFIGURACIÓN — DATOS REALES DE CASCADAS POZO AZUL
   Editar aquí si cambian precios, horario o número de WhatsApp.
   ============================================================ */
const CONFIG = {
  // Número en formato internacional, SIN "+" ni espacios
  whatsappNumber: '50683284646',
  phoneDisplay: '+506 8328-4646',
  schedule: '7:30 a.m. – 5:00 p.m.',
  cabins: [
    {
      id: 'dos-pisos',
      name: 'Cabaña Guaria Morada',
      tagline: 'La más amplia: dos niveles con vista al bosque, ideal para grupos y familias',
      capacity: 6,
      couplePrice: 35000,
      perPersonPrice: 15000,
      amenities: ['wifi','view','hotwater','parking','kitchen'],
      images: [
        { src: 'imagenes/cabañaGuaria/1.jpeg', alt: 'Vista exterior de la Cabaña Guaria Morada' },
        { src: 'imagenes/cabañaGuaria/2.jpeg', alt: 'Cabañas Heliconia y Guaria Morada' },
        { src: 'imagenes/cabañaGuaria/3.jpeg', alt: 'Balcón con vista panorámica' },
        { src: 'imagenes/cabañaGuaria/4.jpeg', alt: 'Interior con cocina equipada y dormitorio' }
      ]
    },
    {
      id: 'pequena',
      name: 'Cabaña Heliconia',
      tagline: 'Acogedora y tranquila, perfecta para una escapada corta',
      capacity: 4,
      couplePrice: 30000,
      perPersonPrice: 15000,
      amenities: ['wifi','view','hotwater','parking','kitchen'],
      images: [
        { src: 'imagenes/cabañaHeliconia/1.jpeg', alt: 'Vista exterior de la Cabaña Heliconia' },
        { src: 'imagenes/cabañaHeliconia/2.jpeg', alt: 'Cocina equipada' },
        { src: 'imagenes/cabañaHeliconia/3.jpeg', alt: 'Dormitorio con camarote' },
        { src: 'imagenes/cabañaHeliconia/4.jpeg', alt: 'Baño privado' },
        { src: 'imagenes/cabañaHeliconia/5.jpeg', alt: 'Camas y camarote' },
        { src: 'imagenes/cabañaHeliconia/6.jpeg', alt: 'Sala, cocina y entrada' }
      ]
    }
  ],
  camping: { price: 8000 },
  // Precios de entrada en colones y su equivalente publicado en dólares
  tickets: {
    adult: { crc: 5000, usd: 12 },
    child: { crc: 4000, usd: 11 }
  },
  packages: [
    { id:'desayuno-entrada', name:'Desayuno y entrada', price:8000, includes:['Entrada del día','Desayuno'], icon:'coffee' },
    { id:'almuerzo-entrada', name:'Almuerzo y entrada', price:9000, includes:['Entrada del día','Almuerzo'], icon:'plate' },
    { id:'dia-completo', name:'Desayuno, entrada y almuerzo', price:12000, includes:['Entrada del día','Desayuno','Almuerzo'], icon:'full' }
  ]
};

const AMENITY_META = {
  wifi:      { label:'Wifi',          icon:'<path d="M2 8.5a16 16 0 0 1 20 0M5.5 12a11 11 0 0 1 13 0M9 15.5a6 6 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>' },
  kitchen:   { label:'Cocina equipada', icon:'<path d="M4 3v6M4 3h3M4 6h3M9 3v18M15 3a3 3 0 0 1 3 3v4h-6V6a3 3 0 0 1 3-3zM18 21v-8"/>' },
  view:      { label:'Vista panorámica', icon:'<circle cx="12" cy="12" r="4"/><path d="M2 12h3M19 12h3M12 2v3M12 19v3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>' },
  parking:   { label:'Parqueo privado', icon:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9"/>' },
  hotwater:  { label:'Agua caliente',  icon:'<path d="M8 3s-2 2-2 4a2 2 0 0 0 4 0c0-.7-.3-1.1-.6-1.5.5.2 1.2 1 1.2 2 0 1.4-1.1 2.5-2.5 2.5S5.6 9 5.6 7.5C5.6 5 8 3 8 3z"/><path d="M4 13h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3z"/>' }
};

const PACKAGE_ICONS = {
  coffee: '<path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z"/><path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M7 2v3M11 2v3"/>',
  plate:  '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>',
  full:   '<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10"/><path d="M16 3c-1.5 1.5-2 3-2 5s.7 3 2 3v10"/>'
};

/* ============================================================
   HELPERS
   ============================================================ */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

function keepHeroVideoPlaying(selector, skipIfQuery){
  const video = $(selector);
  if(!video) return;
  // el video de escritorio no se reproduce (ni se descarga) en móvil, y
  // viceversa con el de móvil en escritorio — cada uno queda inactivo
  // fuera de su rango de pantalla
  if(skipIfQuery && window.matchMedia(skipIfQuery).matches) return;

  let retryTimer;
  const playVideo = () => {
    if(document.visibilityState !== 'hidden' && (video.paused || video.ended)){
      if(video.ended) video.currentTime = 0;
      video.play().catch(() => {
        video.closest('.hero')?.classList.add('video-fallback');
      });
    }
  };

  const retryAfterBuffering = () => {
    clearTimeout(retryTimer);
    retryTimer = setTimeout(playVideo, 250);
  };

  video.muted = true;
  video.defaultMuted = true;
  video.preload = 'auto';
  video.addEventListener('loadedmetadata', playVideo);
  video.addEventListener('canplay', playVideo);
  video.addEventListener('pause', playVideo);
  video.addEventListener('ended', playVideo);
  video.addEventListener('waiting', retryAfterBuffering);
  video.addEventListener('stalled', retryAfterBuffering);
  video.addEventListener('error', () => {
    video.closest('.hero')?.classList.add('video-fallback');
    video.load();
    retryAfterBuffering();
  });
  document.addEventListener('visibilitychange', playVideo);
  playVideo();
}

keepHeroVideoPlaying('.hero-video', '(max-width: 768px)');
keepHeroVideoPlaying('.hero-photo', '(min-width: 769px)');

function formatCRC(n){ return '₡' + Math.round(n).toLocaleString('es-CR'); }
function formatUSD(n){ return '$' + Math.round(n).toLocaleString('en-US'); }
function todayStr(){ const d = new Date(); return d.toISOString().split('T')[0]; }
function parseDate(str){ return new Date(str + 'T00:00:00'); }
// Las fechas que vienen de la API pueden llegar como "2026-09-12" o como
// "2026-09-12T06:00:00.000Z" (Google Sheets serializa sus celdas de fecha
// como datetime ISO). Nos quedamos solo con la parte YYYY-MM-DD para poder
// compararlas de forma consistente con las fechas que elige el usuario.
function apiDateOnly(str){ return (str || '').split('T')[0]; }
function nightsBetween(inS, outS){
  if(!inS || !outS) return 0;
  const diff = (parseDate(outS) - parseDate(inS)) / 86400000;
  return diff > 0 ? diff : 0;
}
function waLink(message){
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* ============================================================
   DISPONIBILIDAD — API real (Google Apps Script + Google Sheets)
   Reemplaza el localStorage de antes: ahora la disponibilidad se
   consulta y se registra en la hoja de cálculo real del negocio.
   ============================================================ */
const BOOKINGS_API_URL = 'https://script.google.com/macros/s/AKfycby36Ml0BqiO6nG9-nQ2YkI29uKSSGj_T7TNCo4fLgIPy2nTWuiKU3KR1nIx43Bnmnr-/exec';

if(location.protocol === 'file:'){
  console.warn('[PozoAzul] Estás abriendo el sitio como archivo local (file://). Los navegadores bloquean fetch() hacia URLs remotas desde file://, así que la consulta de disponibilidad NUNCA va a llegar a script.google.com. Serví esta carpeta con un servidor local (por ejemplo la extensión "Live Server" de VS Code, o "npx serve") y abrí el sitio como http://localhost/... en vez de doble clic al archivo.');
}

// Trae el estado real de reservas desde la hoja de cálculo.
// Lanza un error si la conexión falla, para que quien la llame pueda
// mostrar un aviso y evitar que alguien reserve sin disponibilidad verificada.
async function getBookings(){
  try{
    const res = await fetch(BOOKINGS_API_URL, { method: 'GET', cache: 'no-store' });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  }catch(err){
    console.error('[PozoAzul] ERROR en fetch GET:', err);
    throw err;
  }
}

// Registra una reserva de cabaña como fila nueva en la hoja.
// entry: { cabin_id, checkin, checkout, guests }
// Content-Type text/plain evita que el navegador dispare un preflight
// OPTIONS (Apps Script no lo responde y el POST fallaría por CORS).
async function saveBookings(entry){
  const body = JSON.stringify({ type: 'cabin', ...entry });
  try{
    const res = await fetch(BOOKINGS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
  }catch(err){
    console.error('[PozoAzul] ERROR en fetch POST:', err);
    throw err;
  }
}

function rangesOverlap(aStart, aEnd, bStart, bEnd){
  return parseDate(aStart) < parseDate(bEnd) && parseDate(bStart) < parseDate(aEnd);
}

/* ============================================================
   RENDER: CABIN CARDS
   ============================================================ */
function amenityChip(key){
  const meta = AMENITY_META[key];
  if(!meta) return '';
  return `<div class="amenity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${meta.icon}</svg>${meta.label}</div>`;
}

/* modo de tarifa activo por cabaña: 'pareja' | 'persona' */
const CABIN_RATE_MODE = {};

function renderCabins(){
  const grid = $('#cabinsGrid');
  grid.innerHTML = CONFIG.cabins.map(cabin => {
    const slides = cabin.images.map((img,i) => `
      <div class="cabin-slide ${i===0?'active':''}" data-slide="${i}">
        <img src="${img.src}" alt="${img.alt}">
      </div>`).join('');
    const dots = cabin.images.map((_,i) => `<button data-dot="${i}" class="${i===0?'active':''}" aria-label="Foto ${i+1}"></button>`).join('');

    return `
    <article class="cabin-card reveal" data-cabin="${cabin.id}">
      <div class="cabin-gallery" data-gallery="${cabin.id}">
        ${slides}
        <button class="gallery-nav prev" data-gnav="-1" aria-label="Foto anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button class="gallery-nav next" data-gnav="1" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>
        <div class="gallery-dots">${dots}</div>
      </div>
      <div class="cabin-body">
        <div class="cabin-title-row">
          <div>
            <h3>${cabin.name}</h3>
          </div>
          <div class="price"><b>${formatCRC(cabin.couplePrice)}</b><span>la noche en pareja</span></div>
        </div>
        <p class="cabin-tagline">${cabin.tagline}</p>
        <div class="cabin-meta">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"/></svg>Capacidad: ${cabin.capacity} personas</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.6-.7-1.5-1-2.5-1-1.6 0-2.5.8-2.5 1.8 0 2.4 5 1.3 5 3.6 0 1-1 1.8-2.5 1.8-1 0-1.9-.3-2.5-1"/></svg>${formatCRC(cabin.perPersonPrice)} por persona si no es pareja</span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8a2 2 0 0 0 0 8v2h18v-2a2 2 0 0 1 0-8V6H3v2z"/><path d="M12 6v12" stroke-dasharray="2 3"/></svg>Entrada incluida</span>
        </div>
        <div class="amenities">${cabin.amenities.map(amenityChip).join('')}</div>
        <div class="divider-hair"></div>
        <button class="btn btn-ghost booking-toggle" data-toggle="${cabin.id}">Reservar esta cabaña</button>
        <div class="booking-panel" id="panel-${cabin.id}">
          <div class="booking-panel-inner">
            <div class="field-row">
              <div class="field" data-field="checkin-${cabin.id}">
                <label for="checkin-${cabin.id}">Check-in</label>
                <input type="date" id="checkin-${cabin.id}" data-cabin-input="${cabin.id}" data-role="checkin">
                <p class="field-error"></p>
              </div>
              <div class="field" data-field="checkout-${cabin.id}">
                <label for="checkout-${cabin.id}">Check-out</label>
                <input type="date" id="checkout-${cabin.id}" data-cabin-input="${cabin.id}" data-role="checkout">
                <p class="field-error"></p>
              </div>
            </div>
            <div class="rate-toggle" role="group" aria-label="Tipo de tarifa">
              <button type="button" class="active" data-rate="${cabin.id}" data-mode="pareja" aria-pressed="true">
                Pareja<small>${formatCRC(cabin.couplePrice)} la noche</small>
              </button>
              <button type="button" data-rate="${cabin.id}" data-mode="persona" aria-pressed="false">
                Por persona<small>${formatCRC(cabin.perPersonPrice)} c/u</small>
              </button>
            </div>
            <div class="stepper">
              <div class="stepper-label">Huéspedes<small id="guests-hint-${cabin.id}">Tarifa de pareja: 2 personas</small></div>
              <div class="stepper-controls">
                <button type="button" data-stepper="guests-${cabin.id}" data-dir="-1" aria-label="Restar huésped">–</button>
                <output id="guests-${cabin.id}" data-max="${cabin.capacity}">2</output>
                <button type="button" data-stepper="guests-${cabin.id}" data-dir="1" aria-label="Sumar huésped">+</button>
              </div>
            </div>
            <div class="availability-note" id="avail-${cabin.id}"></div>
            <div class="summary-box">
              <div class="total"><b id="total-crc-${cabin.id}">₡0</b><span id="rate-note-${cabin.id}">Entrada incluida</span></div>
              <div class="summary-note" id="nights-note-${cabin.id}">Elegí las fechas</div>
            </div>
            <button class="whatsapp-btn" id="wa-${cabin.id}" disabled>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
              Reservar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </article>`;
  }).join('');

  // gallery interactions
  $$('.cabin-gallery').forEach(gal => {
    let idx = 0;
    const slides = $$('.cabin-slide', gal);
    const dots = $$('.gallery-dots button', gal);
    function show(i){
      idx = (i + slides.length) % slides.length;
      slides.forEach((s,n) => s.classList.toggle('active', n===idx));
      dots.forEach((d,n) => d.classList.toggle('active', n===idx));
    }
    $$('.gallery-nav', gal).forEach(btn => btn.addEventListener('click', () => show(idx + parseInt(btn.dataset.gnav))));
    dots.forEach((d,n) => d.addEventListener('click', () => show(n)));
  });

  // toggle booking panel
  $$('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggle;
      const panel = $('#panel-' + id);
      const opening = !panel.classList.contains('open');
      panel.classList.toggle('open');
      btn.textContent = opening ? 'Ocultar formulario de reserva' : 'Reservar esta cabaña';
      if(opening) updateCabinCalc(id);
    });
  });

  // selector de tarifa (pareja / por persona) + steppers de huéspedes
  CONFIG.cabins.forEach(cabin => {
    const out = $('#guests-' + cabin.id);
    const stepperBtns = $$(`[data-stepper="guests-${cabin.id}"]`);

    stepperBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        let val = parseInt(out.textContent) + parseInt(btn.dataset.dir);
        val = Math.max(1, Math.min(cabin.capacity, val));
        out.textContent = val;
        updateCabinCalc(cabin.id);
      });
    });

    CABIN_RATE_MODE[cabin.id] = 'pareja';
    // en tarifa de pareja el número de huéspedes queda fijo en 2
    stepperBtns.forEach(b => b.disabled = true);

    $$(`[data-rate="${cabin.id}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        CABIN_RATE_MODE[cabin.id] = mode;
        $$(`[data-rate="${cabin.id}"]`).forEach(b => {
          const on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        if(mode === 'pareja') out.textContent = 2;
        $('#guests-hint-' + cabin.id).textContent = mode === 'pareja'
          ? 'Tarifa de pareja: 2 personas'
          : `Máximo ${cabin.capacity} personas`;
        stepperBtns.forEach(b => b.disabled = (mode === 'pareja'));
        updateCabinCalc(cabin.id);
      });
    });
  });

  // date inputs
  $$('[data-cabin-input]').forEach(input => {
    input.min = todayStr();
    input.addEventListener('change', () => updateCabinCalc(input.getAttribute('data-cabin-input')));
  });

  // whatsapp buttons
  CONFIG.cabins.forEach(cabin => {
    $('#wa-' + cabin.id).addEventListener('click', () => confirmCabinBooking(cabin.id));
  });
}

/* evita que una respuesta vieja "pise" a una más nueva si el usuario
   cambia las fechas mientras el fetch anterior todavía está en camino */
const CABIN_CALC_TOKEN = {};

async function updateCabinCalc(cabinId){
  const cabin = CONFIG.cabins.find(c => c.id === cabinId);
  if(!cabin) return;
  const checkinInput = $(`#checkin-${cabinId}`);
  const checkoutInput = $(`#checkout-${cabinId}`);
  const checkin = checkinInput.value;
  const checkout = checkoutInput.value;
  const guests = parseInt($('#guests-' + cabinId).textContent);
  const waBtn = $('#wa-' + cabinId);
  const availNote = $('#avail-' + cabinId);
  const nightsNote = $('#nights-note-' + cabinId);

  clearFieldError(`checkin-${cabinId}`);
  clearFieldError(`checkout-${cabinId}`);
  availNote.classList.remove('show','warn','ok');
  waBtn.disabled = true;

  // checkout min = day after checkin
  if(checkin){
    const minOut = new Date(parseDate(checkin).getTime() + 86400000).toISOString().split('T')[0];
    checkoutInput.min = minOut;
  }

  if(!checkin || !checkout){
    $('#total-crc-' + cabinId).textContent = '₡0';
    $('#rate-note-' + cabinId).textContent = 'Entrada incluida';
    nightsNote.textContent = 'Elegí las fechas de check-in y check-out';
    return;
  }

  if(parseDate(checkin) < parseDate(todayStr())){
    setFieldError(`checkin-${cabinId}`, 'La fecha no puede ser anterior a hoy');
    return;
  }
  const nights = nightsBetween(checkin, checkout);
  if(nights <= 0){
    setFieldError(`checkout-${cabinId}`, 'El check-out debe ser posterior al check-in');
    return;
  }

  // consulta de disponibilidad real contra la hoja de cálculo
  availNote.textContent = '⏳ Consultando disponibilidad...';
  availNote.classList.add('show');

  const token = {};
  CABIN_CALC_TOKEN[cabinId] = token;
  let bookings;
  try{
    bookings = await getBookings();
  }catch(err){
    console.error('[PozoAzul] updateCabinCalc: la consulta de disponibilidad falló:', err);
    if(CABIN_CALC_TOKEN[cabinId] !== token) return; // ya hay una consulta más nueva en curso
    availNote.textContent = '⚠️ No se pudo verificar disponibilidad. Revisá tu conexión e intentá de nuevo, o escribinos directo por WhatsApp.';
    availNote.classList.add('warn');
    return;
  }
  if(CABIN_CALC_TOKEN[cabinId] !== token) return; // el usuario ya cambió las fechas

  const existing = (bookings.cabins && bookings.cabins[cabinId]) || [];
  const overlap = existing.find(b => rangesOverlap(checkin, checkout, apiDateOnly(b.checkin), apiDateOnly(b.checkout)));
  if(overlap){
    availNote.textContent = `⚠️ Estas fechas ya están reservadas (${apiDateOnly(overlap.checkin)} → ${apiDateOnly(overlap.checkout)}). Elegí otras fechas.`;
    availNote.classList.add('warn');
    return;
  } else {
    availNote.textContent = '✓ Fechas disponibles';
    availNote.classList.add('ok');
  }

  // tarifa: pareja (precio fijo por noche) o por persona
  const mode = CABIN_RATE_MODE[cabinId] || 'pareja';
  const nightPrice = mode === 'pareja'
    ? cabin.couplePrice
    : guests * cabin.perPersonPrice;
  const total = nightPrice * nights;

  $('#total-crc-' + cabinId).textContent = formatCRC(total);
  $('#rate-note-' + cabinId).textContent = mode === 'pareja'
    ? `${formatCRC(cabin.couplePrice)} por noche · entrada incluida`
    : `${guests} × ${formatCRC(cabin.perPersonPrice)} por noche · entrada incluida`;
  nightsNote.textContent = `${nights} noche${nights>1?'s':''} · ${guests} huésped${guests>1?'es':''}`;
  waBtn.disabled = false;

  waBtn.dataset.total = total;
  waBtn.dataset.nights = nights;
  waBtn.dataset.mode = mode;
}

async function confirmCabinBooking(cabinId){
  const cabin = CONFIG.cabins.find(c => c.id === cabinId);
  const checkin = $(`#checkin-${cabinId}`).value;
  const checkout = $(`#checkout-${cabinId}`).value;
  const guests = $('#guests-' + cabinId).textContent;
  const waBtn = $('#wa-' + cabinId);
  const availNote = $('#avail-' + cabinId);
  const total = parseFloat(waBtn.dataset.total || 0);
  const nights = waBtn.dataset.nights;
  const mode = waBtn.dataset.mode === 'persona' ? 'Por persona' : 'Pareja';

  const message =
`¡Hola! Quiero reservar la *${cabin.name}* en Cascadas Pozo Azul

Check-in: ${checkin}
Check-out: ${checkout}
Noches: ${nights}
Huéspedes: ${guests}
Tarifa: ${mode}
Total estimado: ${formatCRC(total)} (entrada incluida)

Quedo atento/a a la confirmación de disponibilidad y en medio de pago. ¡Gracias!`;

  // abrimos WhatsApp primero (debe ser síncrono con el clic, si no
  // el navegador puede bloquear la ventana emergente)
  window.open(waLink(message), '_blank', 'noopener');

  // registramos la reserva en la hoja de cálculo para bloquear estas fechas
  waBtn.disabled = true;
  try{
    await saveBookings({ cabin_id: cabinId, checkin, checkout, guests: parseInt(guests) });
  }catch(err){
    console.error('[PozoAzul] confirmCabinBooking: no se pudo registrar la reserva:', err);
    availNote.textContent = '⚠️ Se abrió WhatsApp, pero no pudimos registrar la reserva automáticamente. Por favor confirmá la disponibilidad directo con nosotros por WhatsApp.';
    availNote.classList.remove('ok');
    availNote.classList.add('show','warn');
  }
  updateCabinCalc(cabinId);
}

function setFieldError(fieldId, msg){
  const field = $(`[data-field="${fieldId}"]`);
  if(!field) return;
  field.classList.add('has-error');
  $('.field-error', field).textContent = msg;
}
function clearFieldError(fieldId){
  const field = $(`[data-field="${fieldId}"]`);
  if(!field) return;
  field.classList.remove('has-error');
  $('.field-error', field).textContent = '';
}

/* ============================================================
   TICKETS (entradas de día)
   ============================================================ */
function initTickets(){
  const T = CONFIG.tickets;
  $('#priceAdultLabel').textContent = `${formatCRC(T.adult.crc)} / ${formatUSD(T.adult.usd)}`;
  $('#priceChildLabel').textContent = `${formatCRC(T.child.crc)} / ${formatUSD(T.child.usd)}`;
  $('#stepperAdultPrice').textContent = `${formatCRC(T.adult.crc)} c/u`;
  $('#stepperChildPrice').textContent = `${formatCRC(T.child.crc)} c/u`;
  $('#ticketDate').min = todayStr();

  function calc(){
    const adults = parseInt($('#ticketAdults').textContent);
    const children = parseInt($('#ticketChildren').textContent);
    const date = $('#ticketDate').value;
    const waBtn = $('#ticketWaBtn');
    clearFieldError('ticketDate-wrap');
    $('#ticketDateError').textContent = '';

    const total = adults * T.adult.crc + children * T.child.crc;
    const totalUsd = adults * T.adult.usd + children * T.child.usd;
    $('#ticketTotalCRC').textContent = formatCRC(total);
    $('#ticketTotalUSD').textContent = 'o ' + formatUSD(totalUsd) + ' USD';

    let valid = true;
    if(!date){ valid = false; }
    else if(parseDate(date) < parseDate(todayStr())){
      $('#ticketDateError').textContent = 'Elegí una fecha a partir de hoy';
      valid = false;
    }
    if(adults + children < 1) valid = false;

    waBtn.disabled = !valid;
    waBtn.dataset.total = total;
    waBtn.dataset.totalUsd = totalUsd;
  }

  $$('[data-stepper="ticketAdults"]').forEach(btn => btn.addEventListener('click', () => {
    const out = $('#ticketAdults');
    let val = parseInt(out.textContent) + parseInt(btn.dataset.dir);
    out.textContent = Math.max(0, val);
    calc();
  }));
  $$('[data-stepper="ticketChildren"]').forEach(btn => btn.addEventListener('click', () => {
    const out = $('#ticketChildren');
    let val = parseInt(out.textContent) + parseInt(btn.dataset.dir);
    out.textContent = Math.max(0, val);
    calc();
  }));
  $('#ticketDate').addEventListener('change', calc);

  $('#ticketWaBtn').addEventListener('click', () => {
    const adults = $('#ticketAdults').textContent;
    const children = $('#ticketChildren').textContent;
    const date = $('#ticketDate').value;
    const total = parseFloat($('#ticketWaBtn').dataset.total || 0);
    const totalUsd = parseFloat($('#ticketWaBtn').dataset.totalUsd || 0);
    const message =
`¡Hola! Quiero comprar entradas de día completo a Cascadas Pozo Azul

Fecha de visita: ${date}
Adultos: ${adults}
Niños: ${children}
Total: ${formatCRC(total)} (o ${formatUSD(totalUsd)} USD)

Quedo atento/a a la confirmación. ¡Gracias!`;
    window.open(waLink(message), '_blank', 'noopener');
  });

  calc();
}

/* ============================================================
   PAQUETES (entrada + alimentación)
   ============================================================ */
function renderPackages(){
  const grid = $('#packagesGrid');
  grid.innerHTML = CONFIG.packages.map(pkg => `
    <article class="package-card reveal" data-package="${pkg.id}">
      <div class="package-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${PACKAGE_ICONS[pkg.icon]}</svg></div>
      <h4>${pkg.name}</h4>
      <div class="package-includes">
        ${pkg.includes.map(item => `<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>${item}</span>`).join('')}
      </div>
      <div class="package-price">${formatCRC(pkg.price)}<span> / persona</span></div>
      <button class="whatsapp-btn" data-pkg-wa="${pkg.id}">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
        Reservar por WhatsApp
      </button>
    </article>
  `).join('');

  $$('[data-pkg-wa]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg = CONFIG.packages.find(p => p.id === btn.dataset.pkgWa);
      const message =
`¡Hola! Quiero reservar el paquete *${pkg.name}* en Cascadas Pozo Azul

Precio: ${formatCRC(pkg.price)} por persona
Incluye: ${pkg.includes.join(', ')}

¿Me confirman disponibilidad y la fecha? ¡Gracias!`;
      window.open(waLink(message), '_blank', 'noopener');
    });
  });
}

/* ============================================================
   GALERÍA + LIGHTBOX
   ============================================================ */
/* orden curado a propósito: fotos y videos intercalados en un masonry
   compacto — cada uno se ve en su proporción real, sin recortes. */
const GALLERY_ITEMS = [
  { src: 'imagenes/galeria/17.jpeg', alt: 'Desayuno con vista a la zona de camping y juegos' },
  { type: 'video', src: 'imagenes/galeria/v1.mp4', alt: 'Video: llegada a la catarata' },
  { src: 'imagenes/galeria/9.jpeg', alt: 'Poza turquesa al pie de la cascada' },
  { src: 'imagenes/galeria/3.jpeg', alt: 'Catarata Caída de Nieve y Paz' },
  { src: 'imagenes/galeria/18.jpeg', alt: 'Pescado entero frito con papas fritas' },
  { src: 'imagenes/galeria/8.jpeg', alt: 'Rótulo de entrada a la cascada y poza azul' },
  { type: 'video', src: 'imagenes/galeria/v2.mp4', alt: 'Video: cruce del río en la canasta aérea' },
  { src: 'imagenes/galeria/16.jpeg', alt: 'Cabañas Heliconia y Guaria Morada' },
  { src: 'imagenes/galeria/13.jpeg', alt: 'Vista aérea de la catarata principal' },
  { src: 'imagenes/galeria/19.jpeg', alt: 'Almuerzo típico con carne en salsa' },
  { type: 'video', src: 'imagenes/galeria/v4.mp4', alt: 'Video: poza turquesa' },
  { src: 'imagenes/galeria/1.jpeg', alt: 'Vista del volcán desde la entrada' },
  { src: 'imagenes/galeria/11.jpeg', alt: 'Vista de la catarata en día despejado' },
  { type: 'video', src: 'imagenes/galeria/v7.mp4', alt: 'Video: un día en Cascadas Pozo Azul' },
  { src: 'imagenes/galeria/14.jpeg', alt: 'Cascada doble con poza natural' },
  { src: 'imagenes/galeria/20.jpeg', alt: 'Filete de pescado frito con patacones' },
  { src: 'imagenes/galeria/6.jpeg', alt: 'Cruce del río en canasta aérea' },
  { src: 'imagenes/galeria/10.jpeg', alt: 'Rancho con mesas y vista panorámica' },
  { type: 'video', src: 'imagenes/galeria/v6.mp4', alt: 'Video: recorrido por Cascadas Pozo Azul' },
  { src: 'imagenes/galeria/4.jpeg', alt: 'Sendero de escaleras en el bosque' },
  { src: 'imagenes/galeria/21.jpeg', alt: 'Plato típico con pollo en salsa y plátanos maduros' },
  { src: 'imagenes/galeria/15.jpeg', alt: 'Zona de juegos, piscina y jardines' },
  { src: 'imagenes/galeria/2.jpeg', alt: 'Almuerzo típico (casado) con vista al valle' },
  { type: 'video', src: 'imagenes/galeria/v5.mp4', alt: 'Video: sendero del bosque' },
  { src: 'imagenes/galeria/7.jpeg', alt: 'Canasta aérea sobre el río' },
  { src: 'imagenes/galeria/5.jpeg', alt: 'Entrada al sendero de la catarata' },
  { type: 'video', src: 'imagenes/galeria/v3.mp4', alt: 'Video: caída de agua de la catarata' },
  { src: 'imagenes/galeria/12.jpeg', alt: 'Vista aérea de la cascada entre el bosque' }
];
/* Arma la galería en filas "justificadas" (como Google Fotos/Flickr): mide
   la proporción real de cada foto/video y las reparte en filas que ocupan
   el ancho completo del contenedor, escalando cada fila (sin recortar, solo
   cambia de tamaño). Como TODAS las filas —incluida la última— llenan el
   ancho, el final de la galería siempre queda alineado igual que el resto. */
function galleryLayoutConfig(){
  const w = window.innerWidth;
  if(w >= 1024) return { gap: 12, targetHeight: 260 };
  if(w >= 640)  return { gap: 10, targetHeight: 220 };
  if(w >= 480)  return { gap: 8,  targetHeight: 180 };
  return { gap: 8, targetHeight: 150 };
}

function createGalleryMedia(item){
  return new Promise(resolve => {
    if(item.type === 'video'){
      const v = document.createElement('video');
      // sin autoplay/preload=auto: solo se descargan los metadatos acá;
      // la reproducción real la dispara el IntersectionObserver de abajo
      // cuando el tile entra en pantalla, para no bajar ~16MB de video de un
      // solo golpe al cargar la página
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
      const finish = () => resolve({ el: v, ratio: (v.videoWidth && v.videoHeight) ? v.videoWidth / v.videoHeight : 16/9 });
      v.addEventListener('loadedmetadata', finish, { once:true });
      v.addEventListener('error', finish, { once:true });
      v.src = item.src;
    } else {
      const img = document.createElement('img');
      img.alt = item.alt;
      img.decoding = 'async';
      const finish = () => resolve({ el: img, ratio: (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 0.75 });
      img.addEventListener('load', finish, { once:true });
      img.addEventListener('error', finish, { once:true });
      img.src = item.src;
      if(img.complete && img.naturalWidth) finish();
    }
  });
}

function layoutGalleryJustified(grid, entries){
  const { gap, targetHeight } = galleryLayoutConfig();
  const containerWidth = grid.clientWidth || grid.parentElement.clientWidth;

  grid.innerHTML = '';

  const n = entries.length;
  const prefix = [0]; // suma acumulada de proporciones
  entries.forEach(e => prefix.push(prefix[prefix.length - 1] + e.ratio));

  // alto que tendría una fila formada por las piezas i..j-1 al llenar el ancho
  function rowHeight(i, j){
    return (containerWidth - gap * (j - i - 1)) / (prefix[j] - prefix[i]);
  }
  // qué tan lejos queda esa fila del alto ideal (las muy altas pesan un poco más)
  function rowCost(i, j){
    const h = rowHeight(i, j);
    if(!(h > 0)) return Infinity;
    const dev = (h - targetHeight) / targetHeight;
    return dev > 0 ? dev * dev * 1.5 : dev * dev;
  }

  // reparte las piezas (manteniendo su orden) en filas para que TODAS —la
  // última incluida— queden lo más cerca posible del alto ideal, en vez de que
  // la última fila salga mucho más alta que el resto
  const best = new Array(n + 1).fill(Infinity);
  const from = new Array(n + 1).fill(0);
  best[0] = 0;
  for(let j = 1; j <= n; j++){
    for(let i = Math.max(0, j - 12); i < j; i++){
      const c = best[i] + rowCost(i, j);
      if(c < best[j]){ best[j] = c; from[j] = i; }
    }
  }
  const rows = [];
  for(let j = n; j > 0; j = from[j]) rows.unshift([from[j], j]);

  rows.forEach(([i, j]) => {
    const h = rowHeight(i, j);
    const rowEl = document.createElement('div');
    rowEl.className = 'gallery-row';
    for(let k = i; k < j; k++){
      const { tile, ratio } = entries[k];
      tile.style.width = (ratio * h) + 'px';
      tile.style.height = h + 'px';
      rowEl.appendChild(tile);
    }
    grid.appendChild(rowEl);
  });
}

function renderGallery(){
  const grid = $('#galleryGrid');
  grid.innerHTML = '';

  Promise.all(GALLERY_ITEMS.map((item, i) => createGalleryMedia(item).then(({ el, ratio }) => {
    const tile = document.createElement('div');
    tile.className = 'gallery-tile reveal';
    tile.dataset.index = i;
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', `Ver ${item.type === 'video' ? 'video' : 'foto'}: ${item.alt}`);
    tile.appendChild(el);
    return { tile, ratio };
  }))).then(entries => {
    layoutGalleryJustified(grid, entries);
    attachGalleryTileHandlers();

    // estos tiles se crearon después del barrido inicial de initReveal(),
    // así que se suman al mismo observer para que también aparezcan con fade-in
    if(revealObserver) $$('.gallery-tile.reveal', grid).forEach(el => revealObserver.observe(el));

    // los videos de la galería solo se reproducen mientras su tile está
    // visible (y se pausan al salir de pantalla), para ahorrar datos/batería
    const galleryVideoObserver = new IntersectionObserver(videoEntries => {
      videoEntries.forEach(entry => {
        if(entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    }, { threshold: 0.25 });
    $$('.gallery-tile video', grid).forEach(video => galleryVideoObserver.observe(video));
  });

  // si cambia el ancho de ventana (o gira el celular) hay que recalcular
  // las filas; reacomodamos los mismos tiles sin recrearlos (así los
  // videos no se reinician)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const tiles = $$('.gallery-tile', grid);
      if(!tiles.length) return;
      const entries = tiles.map(tile => {
        const media = tile.querySelector('img, video');
        const ratio = media.tagName === 'VIDEO'
          ? ((media.videoWidth && media.videoHeight) ? media.videoWidth / media.videoHeight : 16/9)
          : ((media.naturalWidth && media.naturalHeight) ? media.naturalWidth / media.naturalHeight : 0.75);
        return { tile, ratio };
      });
      layoutGalleryJustified(grid, entries);
    }, 200);
  });

  let currentIndex = 0;
  const lightbox = $('#lightbox');
  const lightboxVideo = $('#lightboxVideo');
  // los videos de la galería nunca llevan sonido, ni aunque intenten activarlo
  lightboxVideo.muted = true;
  lightboxVideo.addEventListener('volumechange', () => {
    if(!lightboxVideo.muted) lightboxVideo.muted = true;
  });
  function openLightbox(i){
    currentIndex = i;
    updateLightbox();
    lightbox.classList.add('open');
  }
  function closeLightbox(){
    lightboxVideo.pause();
    lightbox.classList.remove('open');
  }
  function updateLightbox(){
    const item = GALLERY_ITEMS[currentIndex];
    const imgEl = $('#lightboxImg');
    lightboxVideo.pause();
    if(item.type === 'video'){
      lightboxVideo.src = item.src;
      lightboxVideo.loop = true;
      lightboxVideo.style.display = '';
      imgEl.style.display = 'none';
      lightboxVideo.play().catch(() => {});
    } else {
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      imgEl.style.display = '';
      lightboxVideo.removeAttribute('src');
      lightboxVideo.style.display = 'none';
    }
    $('#lightboxLabel').textContent = `${item.type === 'video' ? 'Video' : 'Foto'} ${currentIndex+1} de ${GALLERY_ITEMS.length}`;
    $('#lightboxCaption').textContent = item.alt;
  }
  function attachGalleryTileHandlers(){
    $$('.gallery-tile', grid).forEach(tile => {
      tile.addEventListener('click', () => openLightbox(parseInt(tile.dataset.index)));
      tile.addEventListener('keypress', e => { if(e.key === 'Enter') openLightbox(parseInt(tile.dataset.index)); });
    });
  }
  $('#lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
  $('#lightboxPrev').addEventListener('click', () => openLightbox((currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length));
  $('#lightboxNext').addEventListener('click', () => openLightbox((currentIndex + 1) % GALLERY_ITEMS.length));
  document.addEventListener('keydown', e => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    if(e.key === 'ArrowRight') openLightbox((currentIndex + 1) % GALLERY_ITEMS.length);
  });
}

/* ============================================================
   NAV, SCROLL REVEAL, WHATSAPP GENERAL LINKS
   ============================================================ */
function initNavScroll(){
  const nav = $('#nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive:true });
}

function initMobileMenu(){
  const toggle = $('#navToggle');
  const menu = $('#mobileMenu');
  const backdrop = $('#mobileMenuBackdrop');
  const closeBtn = $('#mobileMenuClose');
  if(!toggle || !menu) return;

  function closeMenu(){
    menu.classList.remove('open');
    backdrop?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu(){
    menu.classList.add('open');
    backdrop?.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if(menu.classList.contains('open')) closeMenu(); else openMenu();
  });
  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);
  // cerrar al tocar un enlace del menú (así se ve el scroll a la sección)
  $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
  // cerrar si se agranda la ventana hasta el menú de escritorio
  window.addEventListener('resize', () => { if(window.innerWidth >= 900) closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
}

/* compartido con renderGallery(): sus tiles se crean después (esperan a que
   carguen las fotos/videos), así que se agregan a este mismo observer
   cuando ya existen, en vez de perderse por llegar tarde al barrido inicial */
let revealObserver;
function initReveal(){
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));
}

function initGeneralWhatsapp(){
  const genericMsg = '¡Hola! Quiero más información sobre Cascadas Pozo Azul';
  const link = waLink(genericMsg);
  ['floatWaBtn','contactWaBtn','footerWaBtn'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.href = link;
  });

  const campingBtn = $('#campingWaBtn');
  if(campingBtn){
    campingBtn.href = waLink(
`¡Hola! Quiero información sobre la *zona de camping* de Cascadas Pozo Azul

Precio: ${formatCRC(CONFIG.camping.price)}

¿Me confirman disponibilidad y qué debo llevar? ¡Gracias!`);
  }

  $('#contactPhoneLabel').textContent = CONFIG.phoneDisplay;
  $('#footerPhoneLabel').textContent = 'WhatsApp: ' + CONFIG.phoneDisplay;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  renderCabins();
  initTickets();
  renderPackages();
  renderGallery();
  initNavScroll();
  initMobileMenu();
  initGeneralWhatsapp();
  requestAnimationFrame(() => { $('#heroContent').classList.add('in'); });
  initReveal();

  // hero uses its own reveal (not observed since visible on load)
  $('#heroContent').classList.add('reveal');

});
