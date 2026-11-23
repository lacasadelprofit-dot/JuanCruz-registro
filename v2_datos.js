/* ── Juan Cruz Consciencia · datos en vivo desde el admin de La Casa del Profit ──
   - Fechas de clase:      Admin → (fechas de clase)  → rpc clase_fechas_publicas
   - Encuentros de Barras: Admin → 🤝 Encuentros       → tabla encuentros
   Cada bloque tiene un contenido de respaldo en el HTML: si la base no responde, queda ese.
   Textos en ES / PT / EN vía v2_i18n.js (T = traducir). */
(function(){
  const SUPA_URL='https://vffmnyjjawvvctcqzkvj.supabase.co',SUPA_KEY='sb_publishable_A1rJIiXHSg6TQYT2gKQHUw_UTwmS76t',WA='541151758653';
  const T=s=>window.v2t?window.v2t(s):s;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const HOY=(()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
  const fD=(f,o)=>new Date(f+'T12:00:00').toLocaleDateString(window.v2loc?window.v2loc():'es-AR',o);
  const cap=t=>t?t.charAt(0).toUpperCase()+t.slice(1):'';
  const dm=f=>fD(f,{day:'numeric',month:'numeric'});
  const wa=t=>'https://wa.me/'+WA+'?text='+encodeURIComponent(t);
  const caja=f=>`<div class="fecha"><b>${fD(f,{day:'numeric'})}</b><span>${fD(f,{month:'short'}).replace('.','')}</span></div>`;

  function claseEvento(c){
    const det=[cap(fD(c.fecha,{weekday:'long'})),T(c.hora||''),T('8 horas'),c.lugar].filter(Boolean).map(esc).join(' · ');
    return `<div class="evento">${caja(c.fecha)}<div><h4>${T('Clase de Barras de Access®')}</h4><p>${det}</p></div>`+
      `<a class="btn btn-p btn-sm" href="${wa(T('Hola Juan Cruz, quiero reservar mi lugar en la clase de Barras del ')+dm(c.fecha))}" target="_blank" rel="noopener">${T('Reservar lugar ✦')}</a></div>`;
  }
  const claseVacia=()=>`<div class="evento"><div class="fecha"><b>✦</b><span>${T('pronto')}</span></div><div><h4>${T('Nuevas fechas muy pronto')}</h4><p>${T('Escribime y te aviso apenas haya fecha.')}</p></div>`+
    `<a class="btn btn-p btn-sm" href="${wa(T('Hola Juan Cruz, quiero enterarme de la próxima clase de Barras'))}" target="_blank" rel="noopener">${T('Avisame ✦')}</a></div>`;

  function barrasEvento(r){
    const det=[cap(fD(r.fecha,{weekday:'long'})),T(r.hora||''),r.aporte].filter(Boolean).map(esc).join(' · ');
    return `<div class="evento">${caja(r.fecha)}<div><h4>${T('Barras en ')}${esc(r.ciudad||'Búzios')}${r.lugar?' · '+esc(r.lugar):''}</h4><p>${det}</p></div>`+
      `<a class="btn btn-v btn-sm" href="${wa(T('Hola Juan Cruz, quiero ir al encuentro de Barras del ')+dm(r.fecha)+T(' en ')+[r.lugar,r.ciudad||'Búzios'].filter(Boolean).join(', '))}" target="_blank" rel="noopener">${T('Quiero ir')}</a></div>`;
  }
  const barrasVacio=()=>`<div class="evento"><div class="fecha"><b>✦</b><span>${T('pronto')}</span></div><div><h4>${T('Próximo encuentro muy pronto')}</h4><p>${T('Escribime y te aviso cuando haya fecha.')}</p></div>`+
    `<a class="btn btn-v btn-sm" href="${wa(T('Hola Juan Cruz, quiero enterarme del próximo encuentro de Barras en Búzios'))}" target="_blank" rel="noopener">${T('Avisame')}</a></div>`;

  if(!window.supabase)return;
  const sb=window.__sbV2=window.__sbV2||supabase.createClient(SUPA_URL,SUPA_KEY);

  const chip=document.getElementById('chipClase'),fechas=document.getElementById('claseFechas'),bHome=document.getElementById('barrasProxHome');
  let clases=null,barras=null;
  function pintar(){
    if(clases){
      if(chip){
        if(clases.length){const c=clases[0];chip.innerHTML=`${esc(chip.dataset.label||T('Próxima clase'))}<b>${esc(cap(fD(c.fecha,{weekday:'short',day:'numeric',month:'long'})))}</b>${[c.hora,c.lugar].filter(Boolean).map(esc).join(' · ')}`;}
        else chip.style.display='none';
      }
      if(fechas)fechas.innerHTML=clases.length?clases.map(claseEvento).join(''):claseVacia();
    }
    if(barras&&bHome)bHome.innerHTML=barras.length?barrasEvento(barras[0]):barrasVacio();
  }
  document.addEventListener('v2lang',pintar);

  if(chip||fechas){
    sb.rpc('clase_fechas_publicas').then(({data,error})=>{
      if(error||!Array.isArray(data))return;
      clases=data.filter(c=>c&&c.fecha&&c.fecha>=HOY).sort((a,b)=>(a.fecha+(a.hora||'')).localeCompare(b.fecha+(b.hora||'')));
      pintar();
    }).catch(()=>{});
  }
  if(bHome){
    sb.from('encuentros').select('data').then(({data,error})=>{
      if(error||!Array.isArray(data))return;
      barras=data.map(r=>r.data||{}).filter(r=>(r.tipo||'encuentro')==='encuentro'&&r.comunidad==='barras'&&r.activo!==false&&r.fecha&&r.fecha>=HOY)
        .sort((a,b)=>a.fecha.localeCompare(b.fecha));
      pintar();
    }).catch(()=>{});
  }
})();
