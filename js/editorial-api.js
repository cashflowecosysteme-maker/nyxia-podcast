/** Agenda éditorial NyXia — KV isolé par utilisateur et podcast. */
const R='nyxia:agenda:v1:';
const answer=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store'}});
const fail=(m,s=400)=>answer({error:m},s);
const valid=id=>/^[a-f0-9-]{36}$/.test(id);
const parse=async r=>{try{return await r.json()}catch{return null}};
const get=async(kv,k,def)=>{const raw=await kv.get(k);if(!raw)return def;try{return JSON.parse(raw)}catch{return def}};
const put=(kv,k,v)=>kv.put(k,JSON.stringify(v));
const allowedStatus=['idee','redaction','production','programme','publie'];
const allowedKind=['episode','publication','entrevue','autre'];
const allowedPlatforms=['Podcast','Facebook','Instagram','TikTok','YouTube','LinkedIn','Infolettre','Autre'];
const short=(v,max)=>String(v||'').trim().slice(0,max);
const dateOk=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v+'T12:00:00Z'));
export async function handleEditorial(request,env,verify){
 const path=new URL(request.url).pathname;if(!path.startsWith('/api/editorial/'))return null;
 const parts=path.slice('/api/editorial/'.length).split('/').filter(Boolean);
 if(parts.length<1||parts.length>2||!valid(parts[0])||(parts[1]&&!valid(parts[1])))return fail('Route invalide.',404);
 if(!env.CASHFLOW_KV)return fail('Stockage indisponible.',503);
 const token=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
 const auth=await verify(token);const email=String(auth?.email||'').trim().toLowerCase();
 if(!auth?.valid||!email)return fail('Session expirée.',401);
 const kv=env.CASHFLOW_KV,projectId=parts[0],entryId=parts[1];
 const owner='nolan:projects:v1:'+encodeURIComponent(email)+':'+projectId;
 if(!await kv.get(owner))return fail('Podcast introuvable.',404);
 const root=R+encodeURIComponent(email)+':'+projectId+':';const indexKey=root+'index';
 const itemKey=id=>root+'item:'+id;
 if(request.method==='GET'&&!entryId){
   const ids=await get(kv,indexKey,[]);const values=await Promise.all((Array.isArray(ids)?ids:[]).slice(0,500).map(id=>get(kv,itemKey(id),null)));
   return answer({items:values.filter(Boolean)});
 }
 if(request.method==='GET'&&entryId){const item=await get(kv,itemKey(entryId),null);return item?answer({item}):fail('Élément introuvable.',404)}
 if(request.method==='DELETE'&&entryId){
   const item=await get(kv,itemKey(entryId),null);if(!item)return fail('Élément introuvable.',404);
   await kv.delete(itemKey(entryId));const ids=await get(kv,indexKey,[]);await put(kv,indexKey,ids.filter(x=>x!==entryId));return answer({ok:true});
 }
 if((request.method==='POST'&&!entryId)||(request.method==='PUT'&&entryId)){
   const b=await parse(request);if(!b||typeof b!=='object')return fail('Données invalides.');
   if(!short(b.title,160))return fail('Titre obligatoire.');if(!dateOk(b.date))return fail('Date invalide.');
   if(!allowedStatus.includes(b.status)||!allowedKind.includes(b.kind))return fail('Statut ou type invalide.');
   if(!Array.isArray(b.platforms)||b.platforms.length>8||b.platforms.some(x=>!allowedPlatforms.includes(x)))return fail('Plateforme invalide.');
   if(String(b.content||'').length>40000||String(b.notes||'').length>12000)return fail('Contenu trop volumineux.',413);
   const prev=entryId?await get(kv,itemKey(entryId),null):null;
   if(entryId&&!prev)return fail('Élément introuvable.',404);
   if(entryId&&b.expectedVersion!==prev.version)return fail('Modification concurrente : actualise avant de sauvegarder.',409);
   const id=entryId||crypto.randomUUID(),now=new Date().toISOString();
   const item={id,projectId,title:short(b.title,160),date:b.date,kind:b.kind,status:b.status,platforms:b.platforms,content:short(b.content,40000),notes:short(b.notes,12000),episode:short(b.episode,120),sourceId:short(b.sourceId,36),version:(prev?.version||0)+1,createdAt:prev?.createdAt||now,updatedAt:now};
   await put(kv,itemKey(id),item);
   if(!entryId){const ids=await get(kv,indexKey,[]);if(ids.length>=500)return fail('Limite de 500 publications par podcast.',413);await put(kv,indexKey,[id,...ids])}
   return answer({item},entryId?200:201);
 }
 return fail('Méthode non autorisée.',405);
}
