/** NyXia Podcast — Mémoire multiprojets (Cloudflare KV, v1)
 * Module autonome : aucune modification du moteur Formation Vivante.
 * API: GET /api/nolan/projects, POST /api/nolan/projects,
 * GET/PATCH /api/nolan/projects/:id, GET/PUT /api/nolan/projects/:id/documents/:type
 * Auth: callback verify(token) -> {valid,email}, depuis le Worker existant.
 */
const ROOT='nolan:projects:v1:';
const DOCUMENTS=new Set(['masterprompt','persona','epoc','brandbook','adn','episodes','decisions','corrections','notes']);
const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store'}});
const bad=(message,status=400)=>respond({error:message},status);
const safeEmail=email=>String(email||'').trim().toLowerCase();
const key=(email,id)=>ROOT+encodeURIComponent(email)+':'+id;
const indexKey=email=>key(email,'index');
const cleanTitle=value=>String(value||'').trim().slice(0,120);
const cleanText=value=>String(value||'').slice(0,120000);
const idValid=id=>/^[a-f0-9-]{36}$/.test(id);
async function read(kv,k,fallback=null){try{const v=await kv.get(k);return v?JSON.parse(v):fallback}catch{return fallback}}
async function write(kv,k,value){await kv.put(k,JSON.stringify(value))}
export async function handleNolanProjects(request,env,verify){
 const url=new URL(request.url);
 if(!url.pathname.startsWith('/api/nolan/projects'))return null;
 if(!env.CASHFLOW_KV)return bad('Stockage indisponible.',503);
 const token=request.headers.get('Authorization')?.replace(/^Bearer\s+/i,'')||url.searchParams.get('token')||'';
 const auth=await verify(token);
 if(!auth?.valid||!safeEmail(auth.email))return bad('Session expirée.',401);
 const email=safeEmail(auth.email),kv=env.CASHFLOW_KV;
 const parts=url.pathname.slice('/api/nolan/projects'.length).split('/').filter(Boolean);
 if(parts.length>3)return bad('Route inconnue.',404);
 const [id,sub,type]=parts;
 if(id&&!idValid(id))return bad('Projet invalide.',400);
 const body=async()=>{try{return await request.json()}catch{return null}};
 if(!id){
   if(request.method==='GET'){
     const index=await read(kv,indexKey(email),[]);
     return respond({projects:Array.isArray(index)?index:[]});
   }
   if(request.method==='POST'){
     const input=await body(),title=cleanTitle(input?.title);
     if(!title)return bad('Le titre du podcast est obligatoire.');
     const projectId=crypto.randomUUID(),now=new Date().toISOString();
     const project={id:projectId,title,description:cleanText(input?.description).slice(0,1000),status:'exploration',createdAt:now,updatedAt:now};
     await write(kv,key(email,projectId),project);
     const index=await read(kv,indexKey(email),[]);
     await write(kv,indexKey(email),[project,...(Array.isArray(index)?index:[])]);
     return respond({project},201);
   }
   return bad('Méthode non autorisée.',405);
 }
 const project=await read(kv,key(email,id));
 if(!project)return bad('Podcast introuvable.',404);
 if(!sub){
   if(request.method==='GET')return respond({project});
   if(request.method==='PATCH'){
     const input=await body();if(!input||typeof input!=='object')return bad('Données invalides.');
     const updated={...project};
     if('title'in input){updated.title=cleanTitle(input.title);if(!updated.title)return bad('Titre obligatoire.');}
     if('description'in input)updated.description=cleanText(input.description).slice(0,1000);
     if('status'in input){if(!['exploration','preparation','actif','pause','archive'].includes(input.status))return bad('Statut invalide.');updated.status=input.status;}
     updated.updatedAt=new Date().toISOString();
     await write(kv,key(email,id),updated);
     const index=await read(kv,indexKey(email),[]);
     await write(kv,indexKey(email),(Array.isArray(index)?index:[]).map(p=>p.id===id?updated:p));
     return respond({project:updated});
   }
   return bad('Méthode non autorisée.',405);
 }
 if(sub!=='documents'||!DOCUMENTS.has(type))return bad('Document inconnu.',404);
 const docKey=key(email,id)+':document:'+type;
 if(request.method==='GET')return respond({document:await read(kv,docKey,{type,content:'',version:0,status:'brouillon'})});
 if(request.method==='PUT'){
   const input=await body();if(typeof input?.content!=='string')return bad('Contenu obligatoire.');
   if(input.content.length>120000)return bad('Document trop volumineux.',413);
   const previous=await read(kv,docKey,{version:0});
   if(input.expectedVersion!==previous.version)return bad('Le document a été modifié ailleurs. Recharge avant de remplacer.',409);
   const status=input.status||'brouillon';if(!['brouillon','propose','valide','publie'].includes(status))return bad('Statut invalide.');
   const doc={type,content:input.content,version:previous.version+1,status,updatedAt:new Date().toISOString()};
   // Historique de versions : jamais d'écrasement silencieux.
   if(previous.version)await write(kv,docKey+':v'+previous.version,previous);
   await write(kv,docKey,doc);
   return respond({document:doc});
 }
 return bad('Méthode non autorisée.',405);
}
