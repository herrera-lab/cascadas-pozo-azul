(function(){
  const STORAGE_KEY = 'pozoazul_lang';
  const SUPPORTED = ['es', 'en', 'de', 'fr', 'pt'];
  const select = document.getElementById('langSelect');
  if(!select) return;

  const EN_OVERRIDES = {
    heroLead: 'Here you\'ll find the area\'s tallest waterfall, with a 155-meter drop.'
  };

  function applyEnglishOverrides(){
    Object.keys(EN_OVERRIDES).forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      el.setAttribute('translate', 'no');
      el.classList.add('notranslate');
      el.innerHTML = EN_OVERRIDES[id];
    });
  }

  let current = 'es';
  try{ current = localStorage.getItem(STORAGE_KEY) || 'es'; }catch(e){}
  if(!SUPPORTED.includes(current)) current = 'es';
  select.value = current;

  function setTranslateCookie(lang){
    const value = '/es/' + lang;
    const host = location.hostname;
    document.cookie = 'googtrans=' + value + '; path=/';
    if(host){
      document.cookie = 'googtrans=' + value + '; path=/; domain=' + host;
      document.cookie = 'googtrans=' + value + '; path=/; domain=.' + host;
    }
  }

  function clearTranslateCookie(){
    const past = 'Thu, 01 Jan 1970 00:00:00 GMT';
    const host = location.hostname;
    document.cookie = 'googtrans=; expires=' + past + '; path=/';
    if(host){
      document.cookie = 'googtrans=; expires=' + past + '; path=/; domain=' + host;
      document.cookie = 'googtrans=; expires=' + past + '; path=/; domain=.' + host;
    }
  }

  function triggerGoogleTranslateSelect(lang, attemptsLeft){
    if(attemptsLeft === undefined) attemptsLeft = 40;
    const combo = document.querySelector('#google_translate_element select.goog-te-combo');
    if(combo){
      if(combo.value !== lang){
        combo.value = lang;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }
    if(attemptsLeft <= 0){
      console.warn('[PozoAzul] El selector de Google Translate nunca apareció; la traducción pudo no activarse.');
      return;
    }
    setTimeout(() => triggerGoogleTranslateSelect(lang, attemptsLeft - 1), 250);
  }

  function loadWidget(lang){
    window.googleTranslateElementInit = function(){
      new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,de,fr,pt',
        autoDisplay: false
      }, 'google_translate_element');
      triggerGoogleTranslateSelect(lang);
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.onerror = () => {
      console.warn('[PozoAzul] No se pudo cargar el traductor de Google.');
      clearTranslateCookie();
      select.value = 'es';
      try{ localStorage.setItem(STORAGE_KEY, 'es'); }catch(e){}
    };
    document.head.appendChild(s);
  }

  select.addEventListener('change', () => {
    const lang = select.value;
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch(e){}

    if(lang === 'es'){
      clearTranslateCookie();
    }else{
      setTranslateCookie(lang);
    }
    location.reload();
  });

  if(current !== 'es'){
    if(current === 'en') applyEnglishOverrides();
    setTranslateCookie(current);
    loadWidget(current);
  }
})();
