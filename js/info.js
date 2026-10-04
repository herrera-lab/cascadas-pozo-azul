(function(){
  const panel = document.getElementById('informacion');
  if(!panel) return;
  const closeBtn = document.getElementById('infoPozoClose');
  let lastFocus = null;

  function open(push){
    if(!panel.hidden) return;
    lastFocus = document.activeElement;
    panel.hidden = false;
    panel.scrollTop = 0;
    // Diferido: el cierre del menú móvil (main.js) restablece overflow después de este click
    setTimeout(() => { if(!panel.hidden) document.body.style.overflow = 'hidden'; }, 0);
    if(push) history.pushState({ infoPozo:true }, '', '#informacion');
    closeBtn?.focus({ preventScroll:true });
  }

  function close(fromHistory){
    if(panel.hidden) return;
    panel.hidden = true;
    document.body.style.overflow = '';
    if(!fromHistory){
      if(history.state && history.state.infoPozo) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
    lastFocus?.focus?.({ preventScroll:true });
  }

  document.querySelectorAll('a[href="#informacion"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); open(true); });
  });
  closeBtn?.addEventListener('click', () => close(false));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') close(false); });
  window.addEventListener('popstate', () => {
    if(location.hash === '#informacion') open(false); else close(true);
  });

  if(location.hash === '#informacion') open(false);
})();
