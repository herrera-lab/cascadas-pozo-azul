// Bloqueo disuasivo de clic derecho y atajos de herramientas de desarrollo.
// No es una medida de seguridad real: cualquier persona puede ver el código igual.
(function(){
  // Se permite el menú contextual en links (WhatsApp, teléfono, correo, mapas) y en campos de texto
  const PERMITIDOS = 'a[href], input, textarea, select, [contenteditable="true"]';

  document.addEventListener('contextmenu', e => {
    if(e.target.closest && e.target.closest(PERMITIDOS)) return;
    e.preventDefault();
  });

  document.addEventListener('keydown', e => {
    const code = e.code;
    const ctrlShift = e.ctrlKey && e.shiftKey;  // Windows / Linux
    const cmdAlt = e.metaKey && e.altKey;       // Mac

    const bloquear =
      e.key === 'F12' ||
      ((ctrlShift || cmdAlt) && (code === 'KeyI' || code === 'KeyJ' || code === 'KeyC')) ||
      (e.ctrlKey && !e.shiftKey && !e.altKey && code === 'KeyU') ||
      (cmdAlt && code === 'KeyU');

    if(bloquear){
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();
