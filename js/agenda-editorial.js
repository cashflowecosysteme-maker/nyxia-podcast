(()=>{'use strict';
const $=id=>document.getElementById(id),token=sessionStorage.getItem('nyxia_token')||'';
const types={monetisation:['💰 Stratégie de monétisation','Propose 3 modèles de revenus réalistes adaptés au podcast, leurs prérequis, les risques et un plan de test mesurable. Aucune promesse de revenus.'],accroche:['🎯 Accroches d’épisode','Écris 5 accroches fortes pour cet épisode, avec 3 tonalités, sans promesses trompeuses.'],metaphore:['✨ Créateur de métaphores','Propose 5 métaphores originales, accessibles à mon Persona, pour expliquer cette idée.'],titre:['📝 Titres impactants','Propose 12 titres précis, variés et adaptés à un podcast, sans sensationnalisme trompeur.'],multiplicateur:['♻️ Multiplicateur de contenu','Transforme cet épisode ou extrait en : 3 publications Facebook, 2 carrousels de 5 slides, 3 scripts de reels, 1 infolettre, 1 publication LinkedIn et 5 extraits courts. N’invente pas de citations ni de faits absents. Structure chaque contenu séparément.'],scripteur:['🎤 Scripteur d’entrevue','Crée un script complet d’entrevue de 30 minutes : ouverture, présentation, 8 questions ouvertes, relances, transitions, conclusion et appel à l’action pertinent.'],preparation:['📋 Préparation d’entrevue','Crée une fiche de préparation : objectif, angle, recherche à vérifier, informations à demander à l’invité, logistique, consentement, questions sensibles et checklist avant/pendant/après. Ne prétends pas avoir recherché la personne.'],calendrier:['🗓️ Plan éditorial 12 mois','Propose une stratégie éditoriale annuelle réaliste : 12 thèmes mensuels, cadence soutenable, formats et plateformes, puis un exemple détaillé de 4 semaines. Pas de dates inventées.']};
const platforms=['Podcast','Facebook','Instagram','TikTok','YouTube','LinkedIn','Infolettre','Autre'];
let projects=[],projectId='',items=[],month=new Date(new Date().getFullYear(),new Date().getMonth(),1),selected=null,selectedTool='',ericHistory=[],ericBusy=false;
const iso=d=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
const dateParse=s=>new Date(s+'T12:00:00');
const status=s=>{$('status').textContent=s||''};const aiStatus=s=>{$('ai-status').textContent=s||''};
function storageKey(){let user={};try{user=JSON.parse(localStorage.getItem('nyxia_user_context')||'{}')}catch{}return 'nyxia:nolan:active:'+String(user.email||'').toLowerCase()}
async function api(url,method='GET',body){if(!token)throw Error('Session expirée. Reconnecte-toi.');const r=await fetch(url,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'});let data={};try{data=await r.json()}catch{}if(!r.ok)throw Error(data.error||'Erreur '+r.status);return data}
const base=()=>'/api/editorial/'+projectId;
async function init(){try{const data=await api('/api/nolan/projects');projects=data.projects||[];const sel=$('project');sel.replaceChildren();for(const p of projects){const o=document.createElement('option');o.value=p.id;o.textContent=p.title;sel.append(o)}const fromUrl=new URLSearchParams(location.search).get('project'),saved=localStorage.getItem(storageKey());projectId=projects.find(p=>p.id===fromUrl)?.id||projects.find(p=>p.id===saved)?.id||projects[0]?.id||'';if(!projectId){status('Crée d’abord un podcast dans Mes Podcasts.');$('new').disabled=true;return}sel.value=projectId;localStorage.setItem(storageKey(),projectId);await load()}catch(e){status(e.message)}}
async function load(){try{const d=await api(base());items=d.items||[];render();status(items.length+' élément(s) dans cet agenda.')}catch(e){status(e.message)}}
function filtered(){return items.filter(x=>!$('filter').value||x.status===$('filter').value).sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title))}
function render(){const view=$('mode').value,arr=filtered(),c=$('calendar');c.replaceChildren();const list=$('items');list.replaceChildren();const add=(el,txt,cls)=>{const x=document.createElement(el);x.textContent=txt;if(cls)x.className=cls;return x};
 for(const x of arr){const box=add('div','', 'listitem');box.append(add('strong',x.date+' · '+x.title),add('p',x.kind+' · '+x.status+' · '+x.platforms.join(', '),'small muted'));const btn=add('button','Modifier');btn.onclick=()=>edit(x);box.append(btn);list.append(box)}if(!arr.length)list.append(add('p','Aucune publication enregistrée.','muted'));
 const start=new Date(month);if(view==='week'){const diff=(start.getDay()+6)%7;start.setDate(start.getDate()-diff);$('period').textContent='Semaine du '+start.toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'})}else $('period').textContent=month.toLocaleDateString('fr-CA',{month:'long',year:'numeric'});
 if(view==='list'){for(const x of arr){const b=add('button',x.date+' · '+x.title+' · '+x.status,'event');b.onclick=()=>edit(x);c.append(b)}return}
 const grid=add('div','','grid');c.append(grid);for(const day of ['L','M','M','J','V','S','D'])grid.append(add('div',day,'weekday'));
 const days=view==='week'?7:42;if(view==='month'){start.setDate(1);start.setDate(start.getDate()-(start.getDay()+6)%7)}
 for(let i=0;i<days;i++){const d=new Date(start);d.setDate(start.getDate()+i);const date=iso(d),cell=add('div','','day');if(view==='month'&&d.getMonth()!==month.getMonth())cell.style.opacity='.48';const num=add('div',String(d.getDate()),'num');cell.append(num);cell.onclick=()=>edit(null,date);for(const x of arr.filter(v=>v.date===date)){const b=add('button',x.title,'event '+(x.kind==='episode'?'episode':''));b.title=x.title+' — '+x.status;b.onclick=e=>{e.stopPropagation();edit(x)};cell.append(b)}grid.append(cell)}
}
function edit(x,date){selected=x||null;$('editor').classList.remove('hide');$('editor-title').textContent=x?'Modifier : '+x.title:'Nouvelle publication';$('title').value=x?.title||'';$('date').value=x?.date||date||iso(new Date());$('kind').value=x?.kind||'publication';$('state').value=x?.status||'idee';$('episode').value=x?.episode||'';$('content').value=x?.content||'';$('notes').value=x?.notes||'';document.querySelectorAll('[data-platform]').forEach(c=>c.checked=!!x?.platforms.includes(c.value));$('delete').disabled=!x;$('duplicate').disabled=!x;$('editor').scrollIntoView({behavior:'smooth',block:'start'})}
function payload(){return {title:$('title').value.trim(),date:$('date').value,kind:$('kind').value,status:$('state').value,platforms:[...document.querySelectorAll('[data-platform]:checked')].map(x=>x.value),episode:$('episode').value,content:$('content').value,notes:$('notes').value,expectedVersion:selected?.version}}
async function save(){const b=payload();if(!b.title){status('Le titre est obligatoire.');return}const btn=$('save');btn.disabled=true;try{const d=await api(base()+(selected?'/'+selected.id:''),selected?'PUT':'POST',b);selected=d.item;await load();status('Publication enregistrée.');$('editor').classList.add('hide')}catch(e){status(e.message)}finally{btn.disabled=false}}
async function remove(){if(!selected||!confirm('Supprimer définitivement cette publication ?'))return;try{await api(base()+'/'+selected.id,'DELETE');selected=null;$('editor').classList.add('hide');await load()}catch(e){status(e.message)}}
function csv(){const fields=['date','title','kind','status','platforms','episode','content','notes'];const q=v=>'"'+String(Array.isArray(v)?v.join('; '):v||'').replaceAll('"','""')+'"';const text='\ufeff'+[fields.join(';'),...filtered().map(x=>fields.map(f=>q(x[f])).join(';'))].join('\r\n');const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));a.href=url;a.download='nyxia-agenda-'+projectId+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
async function startTool(key){
 if(!projectId){aiStatus('Sélectionne d’abord un podcast.');return}
 const p=projects.find(x=>x.id===projectId);
 aiStatus('Préparation du contexte pour le véritable Chat Éric…');
 try{
  const context=await Promise.all(['persona','brandbook','epoc'].map(async t=>{
   try{const d=await api('/api/nolan/projects/'+encodeURIComponent(projectId)+'/documents/'+t);return {type:t,content:String(d.document?.content||'').slice(0,2800)}}
   catch{return {type:t,content:''}}
  }));
  const payload={tool:key,title:types[key][0],goal:types[key][1],projectId,projectTitle:p?.title||'Podcast actif',context};
  sessionStorage.setItem('nyxia:eric:tool-handoff:v1',JSON.stringify(payload));
  if(window.parent!==window && typeof window.parent.openEricPodcastTool==='function'){
    window.parent.openEricPodcastTool(key);
  }else{location.href='/chat-eric.html?outil='+encodeURIComponent(key);}
 }catch(e){aiStatus('Impossible de préparer l’outil : '+e.message)}
}
for(const [key,v] of Object.entries(types)){
 const b=document.createElement('button');b.className='tool';b.type='button';
 const strong=document.createElement('strong');strong.textContent=v[0];
 b.append(strong,document.createTextNode('Créer avec Éric dans son vrai chat'));
 b.onclick=()=>startTool(key);$('tools').append(b)
}
for(const pl of platforms){const label=document.createElement('label');label.className='check';const cb=document.createElement('input');cb.type='checkbox';cb.value=pl;cb.dataset.platform='1';label.append(cb,document.createTextNode(pl));$('platforms').append(label)}
$('back').onclick=()=>location.href='/mes-podcasts.html';$('project').onchange=()=>{projectId=$('project').value;localStorage.setItem(storageKey(),projectId);selected=null;$('editor').classList.add('hide');load()};$('filter').onchange=render;$('mode').onchange=render;
$('prev').onclick=()=>{month.setMonth(month.getMonth()+($('mode').value==='week'?0:-1));if($('mode').value==='week')month.setDate(month.getDate()-7);render()};$('next').onclick=()=>{month.setMonth(month.getMonth()+($('mode').value==='week'?0:1));if($('mode').value==='week')month.setDate(month.getDate()+7);render()};$('today').onclick=()=>{month=new Date(new Date().getFullYear(),new Date().getMonth(),1);render()};$('new').onclick=()=>edit(null);$('save').onclick=save;$('delete').onclick=remove;$('cancel').onclick=()=>$('editor').classList.add('hide');$('duplicate').onclick=()=>{if(!selected)return;const title=$('title').value;edit(null,$('date').value);$('title').value=title+' (copie)'};$('export').onclick=csv;

init();})();