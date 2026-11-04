const $=s=>document.querySelector(s),R=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const n=s=>String(s).trim().toLowerCase();
let reservados=[],cat="Todos";
const dlg=$("#dlg");
function abrir(h){$("#dlgc").innerHTML=h;dlg.showModal();}
$("#fechar").onclick=()=>dlg.close();
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
const mb=$("#mb"),nav=$("#nav");
mb.onclick=()=>{const o=nav.classList.toggle("on");mb.setAttribute("aria-expanded",o)};
nav.onclick=()=>{nav.classList.remove("on");mb.setAttribute("aria-expanded",false)};
$("#prazo").textContent=$("#prazo2").textContent=CONFIG.prazo;
$("#mapa").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(CONFIG.local);

// ===== Envio para a planilha (Google Apps Script) =====
function enviar(dados){return fetch(CONFIG.formEndpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(dados)})}

// ===== Confirmação de presença =====
const rsvp=$("#rsvp"),tg=[...document.querySelectorAll(".toggle button")],qtd=$("#qtd"),nomes=$("#nomes"),acomp=$("#acomp"),msg=$("#msg");
let vai="";
function aviso(t){msg.textContent=t;msg.hidden=!t}
tg.forEach(b=>b.onclick=()=>{vai=b.dataset.v;tg.forEach(x=>x.setAttribute("aria-checked",x===b));acomp.hidden=vai!=="Sim";if(vai!=="Sim"){qtd.value="0";desenha()}
b.closest(".field").classList.remove("err");aviso("")});
function desenha(){const k=+qtd.value,at=[...nomes.querySelectorAll("input")].map(i=>i.value);
nomes.innerHTML=Array.from({length:k},(_,i)=>`<div class="field"><label for="ac${i}">Nome do acompanhante ${i+1}</label><input id="ac${i}" name="ac${i}" type="text" autocomplete="off" value="${esc(at[i]||"")}"></div>`).join("")}
qtd.onchange=desenha;
rsvp.onsubmit=async e=>{e.preventDefault();aviso("");
const nome=$("#nome");let erro=false;
nome.closest(".field").classList.toggle("err",!nome.value.trim());
tg[0].closest(".field").classList.toggle("err",!vai);
if(!nome.value.trim()||!vai){aviso("Preencha seu nome e diga se poderá comparecer.");return}
const dados={tipo:"presenca",nome:nome.value.trim(),telefone:$("#tel").value.trim(),comparecer:vai,
acompanhantes:[...nomes.querySelectorAll("input")].map(i=>i.value.trim()).filter(Boolean).join("; "),
quantidade:vai==="Sim"?qtd.value:"0",enviadoEm:new Date().toLocaleString("pt-BR")};
if(!CONFIG.formEndpoint){aviso("O envio ainda não foi configurado (veja o LEIA-ME).");return}
const bt=$("#enviar");bt.disabled=true;bt.textContent="Enviando...";
try{await enviar(dados);
rsvp.hidden=true;$("#ok").hidden=false;
$("#ok h3").textContent=vai==="Sim"?"Que alegria!":"Obrigado por avisar!";
$("#ok p").textContent=vai==="Sim"?"Sua presença está confirmada. Estamos ansiosos para celebrar com você!":"Sentiremos sua falta, mas agradecemos o carinho."}
catch(err){aviso("Não foi possível enviar agora. Tente novamente.");bt.disabled=false;bt.textContent="Enviar resposta"}};

// ===== Lista de presentes: duas caixas =====
const paineis={lista:$("#p-lista"),vaquinha:$("#p-vaquinha")};
function mostrar(k){Object.entries(paineis).forEach(([n,el])=>el.hidden=n!==k);if(k)paineis[k].scrollIntoView({behavior:"smooth",block:"start"})}
document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>mostrar(b.dataset.open));
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{mostrar(null);$("#presentes").scrollIntoView({behavior:"smooth"})});
function pre(base,entry,nome){if(!base)return"";return entry?base+(base.includes("?")?"&":"?")+"usp=pp_url&"+entry+"="+encodeURIComponent(nome):base}
function foto(img,nome){return img?`<img src="${esc(img)}" alt="${esc(nome)}" loading="lazy">`:`<div class="ph" role="img" aria-label="Sem foto"><i></i></div>`}
function tick(){const d=new Date(CONFIG.data)-new Date();if(d<=0){$("#cd").innerHTML="<b>Chegou o dia!</b>";return}
const t=[["dias",86400000],["horas",3600000],["min",60000],["seg",1000]];let r=d;
$("#cd").innerHTML=t.map(([l,m])=>{const v=Math.floor(r/m);r-=v*m;return`<div><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`}).join("")}
tick();setInterval(tick,1000);
function livres(){return PRESENTES.filter(p=>!p.reservado&&!reservados.includes(n(p.nome)))}
function filtros(){const cs=["Todos",...new Set(PRESENTES.map(p=>p.cat))];
$("#filtros").innerHTML=cs.map(c=>`<button aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
document.querySelectorAll("#filtros button").forEach(b=>b.onclick=()=>{cat=b.dataset.c;filtros();grid()})}
function grid(){const l=livres().filter(p=>cat==="Todos"||p.cat===cat);
$("#grid").innerHTML=l.length?l.map((p,i)=>`<article class="card">${foto(p.img,p.nome)}<div class="cb"><p class="sm">${esc(p.cat)}</p><h3>${esc(p.nome)}</h3><button class="btn" data-i="${PRESENTES.indexOf(p)}">Escolher este presente</button><a class="btn alt" href="${esc(p.url)}" target="_blank" rel="noopener">Ver produto</a></div></article>`).join(""):"<p class='c'>Todos os presentes desta categoria já foram escolhidos. Obrigado!</p>";
document.querySelectorAll("#grid [data-i]").forEach(b=>b.onclick=()=>escolher(PRESENTES[b.dataset.i]))}
function escolher(p){
abrir(`<h3>Escolher este presente</h3><p><b>${esc(p.nome)}</b></p><p>Para reservar, digite seu nome. Reservar não é comprar: depois é só abrir o produto na loja.</p><form id="fr" class="field" style="margin:18px 0 0"><label for="rn">Seu nome</label><input id="rn" autocomplete="name" required><p class="msg" id="rm" hidden style="margin-top:14px"></p><button class="btn" type="submit" style="margin-top:22px">Reservar este presente</button></form>`);
$("#fr").onsubmit=async e=>{e.preventDefault();const nm=$("#rn").value.trim(),m=$("#rm");
if(!nm){m.hidden=false;m.textContent="Digite seu nome.";return}
if(!CONFIG.formEndpoint){m.hidden=false;m.textContent="O envio ainda não foi configurado.";return}
try{await enviar({tipo:"reserva",nome:nm,presente:p.nome});reservados.push(n(p.nome));grid();
$("#dlgc").innerHTML=`<h3>Presente reservado!</h3><p>Obrigado, ${esc(nm)}! Reservamos <b>${esc(p.nome)}</b> para você.</p><a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">Abrir produto na loja</a>`}
catch(err){m.hidden=false;m.textContent="Não foi possível reservar agora. Tente novamente."}}}
function vaq(){$("#vgrid").innerHTML=VAQUINHA.map((v,i)=>{const pc=Math.min(100,v.arrecadado/v.meta*100),ok=v.arrecadado>=v.meta;
return`<article class="card">${foto(v.img,v.nome)}<div class="cb"><h3>${esc(v.nome)}</h3><div class="bar" role="progressbar" aria-valuenow="${Math.round(pc)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pc}%"></i></div><div class="v"><span>Meta ${R(v.meta)}</span><span>Arrecadado ${R(v.arrecadado)}</span></div><div class="v"><span>Falta ${R(Math.max(0,v.meta-v.arrecadado))}</span></div>${ok?`<div class="ok">Presente conquistado!</div>`:`<button class="btn" data-v="${i}">Contribuir para este presente</button>`}</div></article>`}).join("");
document.querySelectorAll("#vgrid [data-v]").forEach(b=>b.onclick=()=>contribuir(VAQUINHA[b.dataset.v]))}
function contribuir(v){const falta=v.meta-v.arrecadado;
abrir(`<h3>${esc(v.nome)}</h3>`+
(CONFIG.pix?`<p>1. Faça o Pix${CONFIG.pixNome?" para <b>"+esc(CONFIG.pixNome)+"</b>":""}:</p><div class="pix"><span>${esc(CONFIG.pix)}</span><button class="btn alt" id="cp">Copiar chave</button></div>`:`<p class="note">A chave Pix ainda não foi configurada.</p>`)+
`<p>2. Depois, avise sua contribuição:</p><form id="fc"><div class="field" style="margin-bottom:24px"><label for="cn">Seu nome</label><input id="cn" autocomplete="name"></div><div class="field" style="margin-bottom:24px"><label for="cv">Valor (R$)</label><input id="cv" inputmode="decimal"></div><div class="field" style="margin-bottom:24px"><label for="cm">Mensagem (opcional)</label><input id="cm"></div><label style="font-size:14px;display:flex;gap:8px;align-items:center;margin-bottom:8px"><input type="checkbox" id="ca"> Prefiro ficar anônimo</label><p class="msg" id="cmsg" hidden style="margin-top:12px"></p><button class="btn" type="submit" style="margin-top:14px">Avisar minha contribuição</button></form><p style="font-size:13px;color:var(--g)">Sua contribuição aparece na barra assim que você avisar aqui.</p>`);
const c=$("#cp");if(c)c.onclick=async()=>{try{await navigator.clipboard.writeText(CONFIG.pix);c.textContent="Copiado!"}catch(e){c.textContent="Copie manualmente"}};
$("#fc").onsubmit=async e=>{e.preventDefault();const m=$("#cmsg"),nm=$("#cn").value.trim(),vl=$("#cv").value.trim();
if(!vl||(!nm&&!$("#ca").checked)){m.hidden=false;m.textContent="Informe o valor e seu nome (ou marque anônimo).";return}
if(!CONFIG.formEndpoint){m.hidden=false;m.textContent="O envio ainda não foi configurado.";return}
try{await enviar({tipo:"contribuicao",nome:$("#ca").checked?"Anônimo":nm,valor:vl,mensagem:$("#cm").value.trim(),presente:v.nome});
const vn=parseFloat(vl.replace(/[^\d.,]/g,"").replace(/\./g,"").replace(",","."))||0;v.arrecadado+=vn;vaq();
$("#dlgc").innerHTML=`<h3>Obrigado!</h3><p>Recebemos seu aviso. A barra será atualizada em instantes.</p>`}
catch(err){m.hidden=false;m.textContent="Não foi possível enviar agora. Tente novamente."}}}
filtros();grid();vaq();
if(CONFIG.formEndpoint)fetch(CONFIG.formEndpoint).then(r=>r.json()).then(j=>{reservados=(j.reservados||[]).map(n);
const t=j.arrecadado||{};VAQUINHA.forEach(v=>{v.arrecadado=(v.arrecadado||0)+(t[n(v.nome)]||0)});grid();vaq()}).catch(()=>{});