(function(){
'use strict';
var all=[];
function nyxiaEscape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function nyxiaInline(value){return nyxiaEscape(value).replace(/\*\*([^\n]+?)\*\*/g,'<strong>$1</strong>').replace(/__([^\n]+?)__/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g,'$1<em>$2</em>').replace(/`([^`\n]+)`/g,'<code>$1</code>');}
function nyxiaMarkdown(value){const lines=String(value??'').replace(/\r\n?/g,'\n').split('\n');let html='',paragraph=[],list='',items=[];function flushParagraph(){if(paragraph.length){html+='<p style="margin:0 0 12px">'+paragraph.map(nyxiaInline).join('<br>')+'</p>';paragraph=[];}}function flushList(){if(list){html+='<'+list+' style="margin:0 0 12px;padding-left:24px">'+items.map(v=>'<li>'+nyxiaInline(v)+'</li>').join('')+'</'+list+'>';list='';items=[];}}for(const line of lines){if(!line.trim()){flushParagraph();flushList();continue;}const heading=line.match(/^(#{1,6})\s+(.+)$/),unordered=line.match(/^\s*[-*+]\s+(.+)$/),ordered=line.match(/^\s*\d+[.)]\s+(.+)$/);if(heading){flushParagraph();flushList();const level=Math.min(heading[1].length+1,6);html+='<h'+level+'>'+nyxiaInline(heading[2])+'</h'+level+'>';}else if(unordered||ordered){flushParagraph();const type=unordered?'ul':'ol';if(list&&list!==type)flushList();list=type;items.push((unordered||ordered)[1]);}else{flushList();paragraph.push(line);}}flushParagraph();flushList();return html;}
function nyxiaPlain(value){return String(value??'').replace(/\*\*|__/g,'').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1$2').replace(/`([^`]+)`/g,'$1').replace(/^#{1,6}\s+/gm,'');}
function nyxiaCommissions(product){return '<p style="margin:14px 0;color:#F4C842">Voir l’offre pour connaître les commissions.</p>';}

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(p){var n=Number(p.price||0);if(!isFinite(n)||n<=0)return'';try{return n.toLocaleString('fr-CA',{style:'currency',currency:'CAD'})}catch(_){return n.toFixed(2)+' $'}}
function render(list){
 var h=document.getElementById('cards');
 if(!list.length){h.innerHTML='<div class="empty">Aucun produit du Cercle ne correspond à cette recherche.</div>';return}
 h.innerHTML=list.map(function(p,i){
   var d=nyxiaPlain(p.description_short||'').slice(0,155);
   return '<article class="card">'
    +'<div class="media">'+(p.image_url?'<img src="'+esc(p.image_url)+'" alt="'+esc(p.title||'')+'" loading="lazy">':'<span class="fallback">💜</span>')+'</div>'
    +'<div class="body"><div class="meta"><span>Répertoire NyXia</span><span>'+(p.join_type==='paid'?'Accès promoteur':'Cercle')+'</span></div>'
    +'<h3>'+esc(p.title||'Produit du Cercle')+'</h3>'
    +'<div class="desc">'+esc(d)+(d.length>=155?'…':'')+'</div>'
    +(money(p)?'<div class="price">'+esc(money(p))+'</div>':'')
    +'<div class="actions"><button class="btn primary" data-open="'+i+'">En Savoir Plus</button></div></div></article>'
 }).join('');
 document.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(){openDetail(list[Number(b.dataset.open)])}})
}
function openDetail(p){
 document.getElementById('detail-title').textContent=p.title||'Produit du Cercle';
 var img=document.getElementById('detail-image');if(p.image_url){img.src=p.image_url;img.hidden=false}else{img.hidden=true;img.removeAttribute('src')}
 document.getElementById('detail-text').innerHTML=nyxiaMarkdown(p.description_short||p.description_long||'')+nyxiaCommissions(p);
 var actions=[];
 var offer=String(p.affiliate_link||'').trim();
 if(offer)actions.push('<a class="btn" href="'+esc(offer)+'" target="_blank" rel="noopener">Voir l’offre</a>');
 actions.push('<a class="btn primary" href="https://www.universnyxia.top/nyxia/cercledentraide" target="_blank" rel="noopener">Rejoindre le Cercle</a>');
 actions.push('<a class="btn" href="https://promoteurs.nyxia.top/login.html" target="_blank" rel="noopener">Déjà membre ?</a>');
 document.getElementById('detail-actions').innerHTML=actions.join('');
 document.getElementById('detail').classList.add('open');
}
function close(){document.getElementById('detail').classList.remove('open')}
document.getElementById('detail-close').onclick=close;
document.getElementById('detail').onclick=function(e){if(e.target===this)close()};
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
document.getElementById('search').oninput=function(){var q=this.value.trim().toLowerCase();render(all.filter(function(p){return !q||[p.title,p.description_short,p.promo_guide].join(' ').toLowerCase().includes(q)}))};
fetch('/api/nyxia-universe/repertoire').then(function(r){return r.json().then(function(d){return{ok:r.ok,data:d}})}).then(function(res){
 if(!res.ok)throw Error(res.data.error||'Répertoire indisponible.');
 all=(res.data.products||[]).filter(function(p){return p.status==='active'||p.status==='published'||!p.status});
 render(all);
}).catch(function(e){document.getElementById('cards').innerHTML='<div class="error">'+esc(e.message)+'</div>'});
})();

