/* Menú común de las páginas nuevas (un solo lugar para cambiarlo) */
(function(){
  const LINKS=[
    ['aprender-barras.html','Aprender Barras'],
    ['sesiones.html','Sesiones'],
    ['comunidad.html','Comunidad'],
    ['index.html#regalar','Regalar'],
    ['aliados.html','Aliados'],
    ['camino.html','Mi camino'],
    ['explorar.html','Explorar']
  ];
  const actual=(location.pathname.split('/').pop()||'index.html');
  const nav=document.getElementById('nav');
  if(nav){
    nav.innerHTML=LINKS.map(([h,t])=>`<a href="${h}"${h===actual?' class="on"':''}>${t}</a>`).join('');
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  }
  /* botones de WhatsApp con mensaje precargado */
  document.querySelectorAll('[data-wa]').forEach(a=>{if(!a.href||a.getAttribute('href')===null){a.href='https://wa.me/541151758653?text='+encodeURIComponent(a.dataset.wa);a.target='_blank';a.rel='noopener';}});
})();
