(function(){
  const STORAGE_KEY = 'pozoazul_a11y';
  const html = document.documentElement;

  const toggle = document.getElementById('a11yToggle');
  const panel = document.getElementById('a11yPanel');
  const closeBtn = document.getElementById('a11yClose');
  const resetBtn = document.getElementById('a11yReset');
  const toggleBtns = document.querySelectorAll('[data-a11y-toggle]');
  const fontStepBtns = document.querySelectorAll('[data-a11y-fontstep]');
  const fontResetBtn = document.querySelector('[data-a11y-fontreset]');

  if(!toggle || !panel) return;

  const TOGGLE_KEYS = ['contrast', 'grayscale', 'underline-links', 'readable-font', 'spacing', 'pause-anim', 'big-cursor'];
  const FONT_CLASSES = ['a11y-fs-1', 'a11y-fs-2', 'a11y-fs-3'];

  let state = { fontStep: 0, toggles: {} };

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw) state = Object.assign(state, JSON.parse(raw));
    }catch(e){}
  }

  function saveState(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  }

  function applyFontStep(){
    FONT_CLASSES.forEach(c => html.classList.remove(c));
    if(state.fontStep > 0) html.classList.add(FONT_CLASSES[state.fontStep - 1]);
  }

  function loadReadableFont(){
    if(document.getElementById('a11yReadableFont')) return;
    const link = document.createElement('link');
    link.id = 'a11yReadableFont';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap';
    document.head.appendChild(link);
  }

  function applyToggle(key, on){
    if(key === 'readable-font' && on) loadReadableFont();
    html.classList.toggle('a11y-' + key, on);
    const btn = document.querySelector(`[data-a11y-toggle="${key}"]`);
    if(btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if(key === 'pause-anim') setVideosPaused(on);
  }

  function setVideosPaused(paused){
    document.querySelectorAll('video').forEach(v => {
      try{
        if(paused){ v.dataset.a11yWasPlaying = v.paused ? '0' : '1'; v.pause(); }
        else if(v.dataset.a11yWasPlaying === '1'){ v.play().catch(()=>{}); }
      }catch(e){}
    });
  }

  function applyAll(){
    applyFontStep();
    TOGGLE_KEYS.forEach(key => applyToggle(key, !!state.toggles[key]));
  }

  function openPanel(){
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick, true);
  }
  function closePanel(){
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutsideClick, true);
  }
  function onKeydown(e){
    if(e.key === 'Escape'){ closePanel(); toggle.focus(); }
  }
  function onOutsideClick(e){
    if(!panel.contains(e.target) && e.target !== toggle){ closePanel(); }
  }

  toggle.addEventListener('click', () => {
    if(panel.hidden) openPanel(); else closePanel();
  });
  closeBtn && closeBtn.addEventListener('click', () => { closePanel(); toggle.focus(); });

  fontStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = parseInt(btn.dataset.a11yFontstep, 10);
      state.fontStep = Math.min(3, Math.max(0, state.fontStep + dir));
      applyFontStep();
      saveState();
    });
  });
  fontResetBtn && fontResetBtn.addEventListener('click', () => {
    state.fontStep = 0;
    applyFontStep();
    saveState();
  });

  toggleBtns.forEach(btn => {
    const key = btn.dataset.a11yToggle;
    btn.addEventListener('click', () => {
      state.toggles[key] = !state.toggles[key];
      applyToggle(key, state.toggles[key]);
      saveState();
    });
  });

  resetBtn && resetBtn.addEventListener('click', () => {
    state = { fontStep: 0, toggles: {} };
    applyAll();
    saveState();
  });

  loadState();
  applyAll();
})();
