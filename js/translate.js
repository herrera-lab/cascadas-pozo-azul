/* Selector de idioma — usa el widget de Google Translate.
   El español es el idioma original; se ofrecen inglés, alemán, francés y
   portugués. El script de Google solo se descarga cuando alguien elige un
   idioma distinto al español (o si ya lo había elegido en una visita anterior).

   La traducción se activa fijando la cookie "googtrans" y recargando la
   página: el widget la lee al iniciar y traduce el contenido automáticamente.
   (Disparar un evento "change" sintético en el <select> oculto del widget
   ya no es confiable: Google lo ignora en la mayoría de los casos.) */
(function(){
  const STORAGE_KEY = 'pozoazul_lang';
  const SUPPORTED = ['es', 'en', 'de', 'fr', 'pt'];
  const select = document.getElementById('langSelect');
  if(!select) return;

  // Textos fijos que reemplazan la traducción automática de Google cuando
  // hace falta una redacción exacta en inglés en lugar de la que genera el
  // widget. La clave es el id del elemento en el HTML.
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

  function loadWidget(){
    window.googleTranslateElementInit = function(){
      new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,de,fr,pt',
        autoDisplay: false
      }, 'google_translate_element');
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
    // recargar para que el widget lea la cookie desde cero y traduzca (o
    // deje de traducir) todo el contenido de la página de forma consistente
    location.reload();
  });

  // si ya había un idioma distinto de español guardado, cargar el widget
  // para que traduzca según la cookie que se fijó en la visita anterior
  if(current !== 'es'){
    if(current === 'en') applyEnglishOverrides();
    setTranslateCookie(current);
    loadWidget();
  }
})();
