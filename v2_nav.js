/* Menú común de las páginas nuevas (un solo lugar para cambiarlo) — ES / PT / EN */
(function(){
  const LINKS=[
    ['aprender-barras.html',['Aprender Barras','Aprender Barras','Learn Bars']],
    ['sesiones.html',['Sesiones','Sessões','Sessions']],
    ['comunidad.html',['Comunidad','Comunidade','Community']],
    ['index.html#regalar',['Regalar','Presentear','Gift']],
    ['aliados.html',['Aliados','Parceiros','Partners']],
    ['camino.html',['Mi camino','Meu caminho','My path']],
    ['explorar.html',['Explorar','Explorar','Explore']]
  ];
  const I={es:0,pt:1,en:2};
  const lang=()=>{try{const l=localStorage.getItem('jcc_lang');if(I[l]!==undefined)return l;}catch(e){}return 'es';};
  const actual=(location.pathname.split('/').pop()||'index.html');
  const nav=document.getElementById('nav');
  function pintar(){
    if(!nav)return;const i=I[lang()];
    nav.innerHTML=LINKS.map(([h,t])=>`<a href="${h}"${h===actual?' class="on"':''}>${t[i]}</a>`).join('');
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  }
  pintar();
  document.addEventListener('v2lang',pintar);
  /* páginas con su propio cambio de idioma (Sesiones, Explorar, Tesoro): también cambian el menú */
  if(typeof window.setLang==='function'&&!window.setLang.__v2){
    const orig=window.setLang;
    window.setLang=function(l){const r=orig.apply(this,arguments);pintar();return r;};
  }
  /* botones de WhatsApp con mensaje precargado */
  document.querySelectorAll('[data-wa]').forEach(a=>{if(!a.href||a.getAttribute('href')===null){a.href='https://wa.me/541151758653?text='+encodeURIComponent(a.dataset.wa);a.target='_blank';a.rel='noopener';}});
})();
