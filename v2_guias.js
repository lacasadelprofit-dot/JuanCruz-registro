/* ── Guías de 20 preguntas: formulario → descarga automática en el idioma de la persona ──
   - Los PDF salen de Admin → Marketing → Regalos (campo "Área" + PDF ES / PT / EN).
   - Cada pedido queda en la tabla regalo_pedidos para contactar a la persona en el día
     (Admin → CRM → Guías pedidas). Si deja WhatsApp, también entra al CRM como prospecto. */
(function(){
  const SUPA_URL='https://vffmnyjjawvvctcqzkvj.supabase.co',SUPA_KEY='sb_publishable_A1rJIiXHSg6TQYT2gKQHUw_UTwmS76t',WA='541151758653';
  const sb=window.supabase?(window.__sbV2=window.__sbV2||supabase.createClient(SUPA_URL,SUPA_KEY)):null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* idioma: el que la persona eligió en la web, o el de su celular */
  function idioma(){
    let l='';try{l=localStorage.getItem('jcc_lang')||'';}catch(e){}
    if(!['es','pt','en'].includes(l)){const n=(navigator.language||'es').slice(0,2).toLowerCase();l=n==='pt'?'pt':n==='en'?'en':'es';}
    return l;
  }
  const T={
    es:{tit:'Tu guía de 20 preguntas',sub:'Dejá tu nombre y tu WhatsApp o email, y descargala ahora.',nombre:'Tu nombre',wa:'WhatsApp (con código de país)',mail:'Email',o:'o',btn:'Descargar mi guía ✦',err_nombre:'Escribí tu nombre.',err_contacto:'Dejá tu WhatsApp o tu email.',err_mail:'Revisá el email.',ok_t:'¡Tu guía está lista!',ok_p:'Tocá el botón para abrirla. Guardala para volver a ella cuando quieras.',ok_btn:'Abrir mi guía',pend_t:'¡Listo, ya la pediste!',pend_p:'Te la envío hoy por WhatsApp o email.',cerrar:'Cerrar',priv:'Uso tus datos solo para enviarte la guía y escribirte. Nada de spam.'},
    pt:{tit:'Seu guia de 20 perguntas',sub:'Deixe seu nome e seu WhatsApp ou e-mail, e baixe agora.',nombre:'Seu nome',wa:'WhatsApp (com código do país)',mail:'E-mail',o:'ou',btn:'Baixar meu guia ✦',err_nombre:'Escreva seu nome.',err_contacto:'Deixe seu WhatsApp ou seu e-mail.',err_mail:'Confira o e-mail.',ok_t:'Seu guia está pronto!',ok_p:'Toque no botão para abrir. Guarde para voltar a ele quando quiser.',ok_btn:'Abrir meu guia',pend_t:'Pronto, pedido feito!',pend_p:'Te envio hoje por WhatsApp ou e-mail.',cerrar:'Fechar',priv:'Uso seus dados só para te enviar o guia e te escrever. Nada de spam.'},
    en:{tit:'Your 20-question guide',sub:'Leave your name and your WhatsApp or email, and download it now.',nombre:'Your name',wa:'WhatsApp (with country code)',mail:'Email',o:'or',btn:'Download my guide ✦',err_nombre:'Please write your name.',err_contacto:'Leave your WhatsApp or your email.',err_mail:'Please check the email.',ok_t:'Your guide is ready!',ok_p:'Tap the button to open it. Save it to come back whenever you want.',ok_btn:'Open my guide',pend_t:'Done, request sent!',pend_p:"I'll send it to you today by WhatsApp or email.",cerrar:'Close',priv:'I only use your details to send you the guide and write to you. No spam.'}
  };
  const AREA_LBL={pt:{'Ser Infinito':'Ser Infinito',Propósito:'Propósito',Vínculos:'Vínculos',Cuerpo:'Corpo',Emprender:'Empreender',Viajes:'Viagens'},
                  en:{'Ser Infinito':'Infinite Being',Propósito:'Purpose',Vínculos:'Bonds',Cuerpo:'Body',Emprender:'Business',Viajes:'Travel'}};
  const areaLbl=(a,l)=>(AREA_LBL[l]&&AREA_LBL[l][a])||a;

  /* modal */
  const css=document.createElement('style');
  css.textContent=`.gm-ov{position:fixed;inset:0;background:rgba(34,24,14,.55);z-index:500;display:none;align-items:center;justify-content:center;padding:16px}
.gm-ov.open{display:flex}
.gm{background:#FAF7F2;border-radius:22px;max-width:440px;width:100%;padding:30px 28px;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.3)}
.gm-x{position:absolute;top:12px;right:14px;background:none;border:0;font-size:20px;cursor:pointer;color:#7A6E60}
.gm .gm-eb{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9A5C30;font-weight:600;margin-bottom:8px}
.gm .gm-btn{display:flex;align-items:center;justify-content:center;width:100%;margin-top:16px;padding:14px 22px;border-radius:40px;font:600 15px 'DM Sans',sans-serif;text-decoration:none;cursor:pointer;border:1.5px solid transparent;box-sizing:border-box}
.gm .gm-p{background:#C17A48;color:#fff}.gm .gm-p:hover{background:#9A5C30}
.gm .gm-s{border-color:#22180E;color:#22180E;background:transparent}
.gm *{box-sizing:border-box}
.gm h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:600;line-height:1.1;margin-bottom:8px;color:#22180E}
.gm p{color:#7A6E60;font-size:15px}
.gm input{width:100%;font:15px 'DM Sans',sans-serif;padding:13px 14px;border:1.5px solid #E6DDD0;border-radius:12px;background:#fff;margin-top:10px;outline:none}
.gm input:focus{border-color:#C17A48}
.gm .gm-o{text-align:center;font-size:12px;color:#9C8F7E;margin:8px 0 -2px}
.gm .gm-err{color:#A83C3C;font-size:13px;min-height:18px;margin-top:8px}
.gm .gm-priv{font-size:11.5px;color:#9C8F7E;margin-top:10px;text-align:center}`;
  document.head.appendChild(css);
  const ov=document.createElement('div');ov.className='gm-ov';ov.innerHTML='<div class="gm" role="dialog" aria-modal="true"><button class="gm-x" aria-label="Cerrar">✕</button><div class="gm-body"></div></div>';
  document.body.appendChild(ov);
  const body=ov.querySelector('.gm-body');
  const cerrar=()=>ov.classList.remove('open');
  ov.querySelector('.gm-x').onclick=cerrar;
  ov.addEventListener('click',e=>{if(e.target===ov)cerrar();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')cerrar();});

  let area='',lang='es',orig={origen:'portada'};
  /* claves de la ruleta → nombre del área */
  const AREA_KEY={Relaciones:'Vínculos',Identidad:'Ser Infinito'};
  function abrir(a,opts){
    opts=opts||{};area=AREA_KEY[a]||a;lang=['es','pt','en'].includes(opts.lang)?opts.lang:idioma();const t=T[lang];
    orig={origen:opts.origen||'portada',flyer:opts.flyer||null,ciudad:opts.ciudad||null};
    let guardado={};try{guardado=JSON.parse(localStorage.getItem('jcc_lead')||'{}')||{};}catch(e){}
    body.innerHTML=`<div class="gm-eb">${esc(areaLbl(area,lang))}</div><h3>${t.tit}</h3><p>${t.sub}</p>
      <input id="gmNom" type="text" autocomplete="name" placeholder="${t.nombre}" value="${esc(guardado.nombre||'')}">
      <input id="gmWa" type="tel" inputmode="tel" autocomplete="tel" placeholder="${t.wa}" value="${esc(guardado.celular||'')}">
      <div class="gm-o">${t.o}</div>
      <input id="gmMail" type="email" autocomplete="email" placeholder="${t.mail}" value="${esc(guardado.email||'')}">
      <input id="gmHp" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;height:0;opacity:0">
      <div class="gm-err" id="gmErr"></div>
      <button class="gm-btn gm-p" id="gmBtn">${t.btn}</button>
      <div class="gm-priv">${t.priv}</div>`;
    ov.classList.add('open');
    setTimeout(()=>document.getElementById('gmNom').focus(),50);
    document.getElementById('gmBtn').onclick=enviar;
  }

  async function buscarGuia(){
    if(!sb)return null;
    try{
      const {data}=await sb.from('regalos').select('id,data');
      const r=(data||[]).map(x=>({id:x.id,...(x.data||{})}))
        .find(x=>x.activo!==false&&x.area===area&&(!x.marca||x.marca==='jcc'||x.marca==='ambos'));
      if(!r)return null;
      return {id:r.id,nombre:r.nombre||('Guía de 20 preguntas · '+area),url:r['pdfUrl_'+lang]||r.pdfUrl||''};
    }catch(e){return null;}
  }

  async function enviar(){
    const t=T[lang],err=document.getElementById('gmErr'),btn=document.getElementById('gmBtn');
    if(document.getElementById('gmHp').value)return;
    const nombre=document.getElementById('gmNom').value.trim();
    const celular=document.getElementById('gmWa').value.replace(/\D/g,'');
    const email=document.getElementById('gmMail').value.trim();
    if(nombre.length<2){err.textContent=t.err_nombre;return;}
    if(!celular&&!email){err.textContent=t.err_contacto;return;}
    if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent=t.err_mail;return;}
    if(celular&&(celular.length<8||celular.length>15)){err.textContent=t.err_contacto;return;}
    err.textContent='';btn.disabled=true;btn.textContent='…';
    try{localStorage.setItem('jcc_lead',JSON.stringify({nombre,celular,email}));}catch(e){}
    const guia=await buscarGuia();
    const entregado=!!(guia&&guia.url);
    if(sb){
      const id='rp-'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
      try{await sb.from('regalo_pedidos').insert({id,data:{nombre,celular,email,area,idioma:lang,regalo:guia?guia.nombre:'Guía de 20 preguntas · '+area,regaloId:guia?guia.id:null,entregado,origen:orig.origen,flyer:orig.flyer,ciudad:orig.ciudad,contactado:false,ts:new Date().toISOString()}});}catch(e){}
      if(celular){try{await sb.rpc('guardar_prospecto',{p_celular:celular,p_nombre:nombre,p_campos:{fuente:'guia_20_preguntas',origen:orig.flyer?('flyer '+orig.flyer):orig.origen,email:email||undefined,lang,interes:area},p_regalo:guia?guia.nombre:'Guía de 20 preguntas · '+area});}catch(e){}}
      if(guia){try{await sb.from('regalo_eventos').insert({data:{tipo:'descarga',regaloId:guia.id,regaloNombre:guia.nombre,canal:orig.origen==='ruleta'?'ruleta':'portada_v2',flyer:orig.flyer,idioma:lang,area,fecha:new Date().toISOString().split('T')[0],ts:new Date().toISOString()}});}catch(e){}}
    }
    body.innerHTML=entregado
      ?`<div class="gm-eb">${esc(areaLbl(area,lang))}</div><h3>${t.ok_t}</h3><p>${t.ok_p}</p><a class="gm-btn gm-p" href="${esc(guia.url)}" target="_blank" rel="noopener">${t.ok_btn}</a>`
      :`<div class="gm-eb">${esc(areaLbl(area,lang))}</div><h3>${t.pend_t}</h3><p>${t.pend_p}</p><button class="gm-btn gm-s" id="gmCerrar">${t.cerrar}</button>`;
    const c=document.getElementById('gmCerrar');if(c)c.onclick=cerrar;
  }

  window.abrirGuia=abrir;
  document.querySelectorAll('[data-guia]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();abrir(b.dataset.guia,{origen:'portada'});}));
})();
