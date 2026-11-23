/* ── Juan Cruz Consciencia · datos en vivo desde el admin de La Casa del Profit ──
   - Fechas de clase:      Admin → (fechas de clase)  → rpc clase_fechas_publicas
   - Encuentros de Barras: Admin → 🤝 Encuentros       → tabla encuentros
   Cada bloque tiene un contenido de respaldo en el HTML: si la base no responde, queda ese. */
(function(){
  const SUPA_URL='https://vffmnyjjawvvctcqzkvj.supabase.co',SUPA_KEY='sb_publishable_A1rJIiXHSg6TQYT2gKQHUw_UTwmS76t',WA='541151758653';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const HOY=(()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
  const fD=(f,o)=>new Date(f+'T12:00:00').toLocaleDateString('es-AR',o);
  const cap=t=>t?t.charAt(0).toUpperCase()+t.slice(1):'';
  const dm=f=>fD(f,{day:'numeric',month:'numeric'});
  const wa=t=>'https://wa.me/'+WA+'?text='+encodeURIComponent(t);
  const caja=f=>`<div class="fecha"><b>${fD(f,{day:'numeric'})}</b><span>${fD(f,{month:'short'}).replace('.','')}</span></div>`;

  function claseEvento(c){
    const det=[cap(fD(c.fecha,{weekday:'long'})),c.hora,'8 horas',c.lugar].filter(Boolean).map(esc).join(' · ');
    return `<div class="evento">${caja(c.fecha)}<div><h4>Clase de Barras de Access®</h4><p>${det}</p></div>`+
      `<a class="btn btn-p btn-sm" href="${wa('Hola Juan Cruz, quiero reservar mi lugar en la clase de Barras del '+dm(c.fecha))}" target="_blank" rel="noopener">Reservar lugar ✦</a></div>`;
  }
  const claseVacia=`<div class="evento"><div class="fecha"><b>✦</b><span>pronto</span></div><div><h4>Nuevas fechas muy pronto</h4><p>Escribime y te aviso apenas haya fecha.</p></div>`+
    `<a class="btn btn-p btn-sm" href="${wa('Hola Juan Cruz, quiero enterarme de la próxima clase de Barras')}" target="_blank" rel="noopener">Avisame ✦</a></div>`;

  function barrasEvento(r){
    const det=[cap(fD(r.fecha,{weekday:'long'})),r.hora,r.aporte].filter(Boolean).map(esc).join(' · ');
    return `<div class="evento">${caja(r.fecha)}<div><h4>Barras en ${esc(r.ciudad||'Búzios')}${r.lugar?' · '+esc(r.lugar):''}</h4><p>${det}</p></div>`+
      `<a class="btn btn-v btn-sm" href="${wa('Hola Juan Cruz, quiero ir al encuentro de Barras del '+dm(r.fecha)+' en '+[r.lugar,r.ciudad||'Búzios'].filter(Boolean).join(', '))}" target="_blank" rel="noopener">Quiero ir</a></div>`;
  }
  const barrasVacio=`<div class="evento"><div class="fecha"><b>✦</b><span>pronto</span></div><div><h4>Próximo encuentro muy pronto</h4><p>Escribime y te aviso cuando haya fecha.</p></div>`+
    `<a class="btn btn-v btn-sm" href="${wa('Hola Juan Cruz, quiero enterarme del próximo encuentro de Barras en Búzios')}" target="_blank" rel="noopener">Avisame</a></div>`;

  if(!window.supabase)return;
  const sb=window.__sbV2=window.__sbV2||supabase.createClient(SUPA_URL,SUPA_KEY);

  const chip=document.getElementById('chipClase'),fechas=document.getElementById('claseFechas');
  if(chip||fechas){
    sb.rpc('clase_fechas_publicas').then(({data,error})=>{
      if(error||!Array.isArray(data))return;
      const fut=data.filter(c=>c&&c.fecha&&c.fecha>=HOY).sort((a,b)=>(a.fecha+(a.hora||'')).localeCompare(b.fecha+(b.hora||'')));
      if(chip){
        if(fut.length){const c=fut[0];chip.innerHTML=`${esc(chip.dataset.label||'Próxima clase')}<b>${esc(cap(fD(c.fecha,{weekday:'short',day:'numeric',month:'long'})))}</b>${[c.hora,c.lugar].filter(Boolean).map(esc).join(' · ')}`;}
        else chip.style.display='none';
      }
      if(fechas)fechas.innerHTML=fut.length?fut.map(claseEvento).join(''):claseVacia;
    }).catch(()=>{});
  }

  const bHome=document.getElementById('barrasProxHome');
  if(bHome){
    sb.from('encuentros').select('data').then(({data,error})=>{
      if(error||!Array.isArray(data))return;
      const prox=data.map(r=>r.data||{}).filter(r=>(r.tipo||'encuentro')==='encuentro'&&r.comunidad==='barras'&&r.activo!==false&&r.fecha&&r.fecha>=HOY)
        .sort((a,b)=>a.fecha.localeCompare(b.fecha));
      bHome.innerHTML=prox.length?barrasEvento(prox[0]):barrasVacio;
    }).catch(()=>{});
  }
})();
