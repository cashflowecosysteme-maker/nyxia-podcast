
var params = new URLSearchParams(location.search);
var token = params.get('t') || params.get('token') || sessionStorage.getItem('nyxia_token') || '';
var username = localStorage.getItem('nyxia_username') || '';
if(token) sessionStorage.setItem('nyxia_token', token);
if(!token){
  window.location.replace('/login');
} else {
  fetch('/api/check-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: token })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    if(!data || !data.valid){ window.location.replace('/login'); return; }
    if(data.firstname) username = data.firstname;
  })
  .catch(function(){ window.location.replace('/login'); });
}
if(window.self !== window.top) document.body.classList.add('embedded');

var ovilusMode = 'fluide';
var ovilusBusy = false;
var ovilusHistory = [];
var seanceOpen = false;
var lastAsked = '';
var veilSilentLeft = 0;
var baseTemp = 21.2 + Math.random()*0.8;
var emf = 0.12, temp = baseTemp, veil = 0;

function pickNextVeilMood(){ veilSilentLeft = 0; }
var seanceFresh = false;
var ovilusPendingRequest = null;


var DICT = [
  'oui','non','ici','près','loin','mère','père','fils','fille','nom','maison','eau','feu',
  'froid','chaud','porte','clé','photo','livre','bague','horloge','escalier','jardin',
  'attendre','partir','rester','pardon','amour','paix','lumière','souvenir',
  'enfant','frère','sœur','ami','mort','vie','reviens','écoute','regarde','gauche','droite',
  'devant','nuit','matin','hiver','automne','église','pierre','arbre','chien',
  'voix','silence','aide','doux','ancien','blanc','rouge','lettre','musique'
];
var PHON = ['ah','eh','iss','ane','or','ine','el','un','ka','ra','mi','ol','est','là','qui','pas','toi','nous'];
var currentSpirit = null;
var spiritStoryIndex = 0;
var grouchTurnsLeft = 0; // compatibilité interne, jamais utilisé pour une présence hostile
var CAST = [];
var CAST_INDEX = 0;
var CAST_URL = '/api/ovilus/cast';

function mapCastMember(d){
  var stories = (d.stories && d.stories.length) ? d.stories.slice() : [];
  if(d.circumstance && stories.indexOf(d.circumstance)<0) stories.unshift(d.circumstance);
  if(d.message && stories.indexOf(d.message)<0) stories.push(d.message);
  if(d.incomplete && stories.indexOf(d.incomplete)<0) stories.push(d.incomplete);
  if(d.unsaid && stories.indexOf(d.unsaid)<0) stories.push(d.unsaid);
  if(!stories.length) stories.push('Je suis là. C’est tout ce que je peux dire.');
  var first = (d.prenom || d.name || 'Présence').split(' ')[0];
  var born = d.born || (d.birth||'').slice(0,4);
  var died = d.died || (d.death||'').slice(0,4);
  return {
    id: d.id,
    name: d.name || [d.prenom,d.nom].filter(Boolean).join(' '),
    prenom: d.prenom || first,
    nom: d.nom || '',
    born: born, died: died,
    era: (born||'?') + '-' + (died||'?'),
    tone: 'story',
    voice: 'story',
    words: (d.name||first).toLowerCase().split(/\s+/).concat(['ici','près','nom']),
    intro: first + '. ' + (born||'') + (died ? ' à ' + died : '') + '. C’est mon tour.',
    stories: stories,
    leaveLine: 'Je quitte. ' + first + ' n’a plus rien à ajouter.'
  };
}
async function loadCast(){
  try{
    var r = await fetch(CAST_URL + '?t=' + encodeURIComponent(token));
    var data = await r.json();
    if(data && data.defunts && data.defunts.length){
      CAST = data.defunts.map(mapCastMember);
      CAST_INDEX = 0;
      return true;
    }
  }catch(e){}
  return false;
}

/* Esprits ancrés 1920–2026, récits crédibles (Québec / francophonie). */
var SPIRITS = [
  { name:'Émile', born:1901, died:1978, era:'1920-1978', tone:'story', voice:'grave',
    intro:'Émile. Je suis là.',
    words:['usine','hiver','famille','souvenir','ici'],
    stories:['Je suis là. Pose ta question.', 'Je me souviens surtout de ma famille et du travail.', 'Je ne sais pas quoi ajouter pour le moment.'] },
  { name:'Mariette', born:1918, died:1996, era:'1918-1996', tone:'story', voice:'douce',
    intro:'Mariette. Je suis là.',
    words:['famille','maison','souvenir','paix','ici'],
    stories:['Je suis là. Je t’écoute.', 'Il y a des souvenirs que je préfère garder doucement.', 'Je ne sais pas répondre à ça maintenant.'] },
  { name:'Thérèse', born:1933, died:2011, era:'1933-2011', tone:'story', voice:'femme',
    intro:'Thérèse. Je suis là.',
    words:['école','famille','souvenir','ici','paix'],
    stories:['Je suis là. Une question à la fois.', 'Je peux répondre si je sais.', 'Je préfère rester silencieuse plutôt que d’inventer.'] }
];

function attachSpirit(){
  if(CAST.length){
    currentSpirit = CAST[CAST_INDEX % CAST.length];
  } else {
    currentSpirit = SPIRITS[Math.floor(Math.random()*SPIRITS.length)] || null;
  }
  spiritStoryIndex = 0;
  grouchTurnsLeft = 0;
  return currentSpirit;
}
function nextOnStage(){
  if(!CAST.length){ attachSpirit(false); return currentSpirit; }
  CAST_INDEX = (CAST_INDEX + 1) % CAST.length;
  attachSpirit(false);
  ovilusLog('Une autre présence avance — ' + currentSpirit.name);
  return currentSpirit;
}
function maybeHijack(){
  // Léna-Ovilus : aucun changement de présence aléatoire.
  return false;
}

function setMeters(){
  document.getElementById('emfFill').style.width = Math.min(100, emf*22) + '%';
  document.getElementById('emfVal').textContent = emf.toFixed(2) + ' µT';
  var tPct = Math.max(8, Math.min(100, (temp-16)*12));
  document.getElementById('tmpFill').style.width = tPct + '%';
  document.getElementById('tmpVal').textContent = temp.toFixed(1) + ' °C';
  document.getElementById('veilFill').style.width = Math.round(veil) + '%';
  document.getElementById('veilVal').textContent = seanceOpen ? (veil>70?'mince':'ouvert') : 'fermé';
}
function driftMeters(){
  if(seanceOpen){
    emf += (Math.random()-0.45)*0.35;
    emf = Math.max(0.08, Math.min(4.8, emf));
    temp += (Math.random()-0.62)*0.08;
    temp = Math.max(16.4, Math.min(baseTemp+0.3, temp));
    veil += (Math.random()-0.35)*4;
    veil = Math.max(18, Math.min(96, veil));
  } else {
    emf += (0.12-emf)*0.15 + (Math.random()-0.5)*0.02;
    temp += (baseTemp-temp)*0.08;
    veil += (0-veil)*0.2;
  }
  setMeters();
}
setInterval(driftMeters, 700);
setMeters();

/* Audio : souffle radio + coups */
var audioCtx = null, noiseNodes = null, noiseOn = false;
function ctx(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function startNoise(){
  var ac = ctx();
  var bufSize = 2*ac.sampleRate;
  var buf = ac.createBuffer(1, bufSize, ac.sampleRate);
  var data = buf.getChannelData(0);
  for(var i=0;i<bufSize;i++) data[i] = (Math.random()*2-1)*0.35;
  var src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
  var filter = ac.createBiquadFilter(); filter.type='bandpass'; filter.frequency.value=1200; filter.Q.value=0.6;
  var gain = ac.createGain(); gain.gain.value=0.07;
  src.connect(filter); filter.connect(gain); gain.connect(ac.destination); src.start();
  var sweep = setInterval(function(){
    if(!noiseOn){ clearInterval(sweep); return; }
    filter.frequency.value = 400 + Math.random()*2800;
    gain.gain.value = 0.04 + Math.random()*0.06;
  }, 280);
  noiseNodes = {src:src, filter:filter, gain:gain, sweep:sweep};
}
function stopNoise(){
  if(!noiseNodes) return;
  try{ noiseNodes.src.stop(); }catch(e){}
  clearInterval(noiseNodes.sweep);
  noiseNodes = null;
}
function toggleNoise(){
  noiseOn = !noiseOn;
  document.getElementById('btnNoise').classList.toggle('on', noiseOn);
  document.getElementById('btnNoise').textContent = noiseOn ? '📻 Souffle actif' : '📻 Souffle radio';
  if(noiseOn) startNoise(); else stopNoise();
}
function playKnock(n){
  n = n || 1;
  var ac = ctx();
  for(var i=0;i<n;i++){
    (function(i){
      setTimeout(function(){
        var o = ac.createOscillator();
        var g = ac.createGain();
        o.type = 'sine'; o.frequency.value = 90 + Math.random()*30;
        g.gain.setValueAtTime(0.0001, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.45, ac.currentTime+0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+0.18);
        o.connect(g); g.connect(ac.destination);
        o.start(); o.stop(ac.currentTime+0.2);
      }, i*220);
    })(i);
  }
}
function manualKnock(){ if(seanceOpen) playKnock(1); }

function setControls(on){
  document.getElementById('ovilusCrystal').disabled = !on;
  document.getElementById('ovilusTypedQuestion').disabled = !on;
  document.getElementById('btnConsult').disabled = !on;
  document.getElementById('btnOpen').disabled = on;
  document.getElementById('btnClose').disabled = !on;
}

function openSeance(){
  if(seanceOpen) return;
  unlockOvilusSpeech();
  seanceOpen = true;
  loadCast().then(function(){ beginSeanceVoice(); });
}
function beginSeanceVoice(){
  document.body.classList.add('seance-on');
  setControls(true);
  veil = 18; emf = 0.35; temp = baseTemp - 0.2;
  currentSpirit = null;
  spiritStoryIndex = 0;
  ovilusHistory = [];
  pickNextVeilMood();
  seanceFresh = true;
  ovilusPendingRequest = null;
  var box = document.getElementById('ovilusScreenBox');
  box.classList.add('scan');
  var screen = document.getElementById('ovilusScreen');
  screen.classList.remove('lit');
  screen.textContent = '— — —';
  document.getElementById('ovilusStatus').textContent = 'Cercle ouvert — le voile est silencieux';
  document.getElementById('ovilusQuestion').textContent = 'Attends. Pose une question si tu veux. Rien ne garantit une réponse.';
  ovilusLog('Cercle ouvert' + (username ? ' — ' + username : '') + '. Silence.');
  playKnock(1);
  if(!noiseOn) toggleNoise();
}

function closeSeance(){
  if(!seanceOpen) return;
  seanceOpen = false;
  document.body.classList.remove('seance-on');
  setControls(false);
  var box = document.getElementById('ovilusScreenBox');
  box.classList.remove('scan','flicker');
  document.getElementById('ovilusScreen').classList.remove('lit');
  document.getElementById('ovilusScreen').textContent = 'MERCI — CERCLE FERMÉ';
  document.getElementById('ovilusStatus').textContent = 'Séance close. Repose-toi.';
  document.getElementById('ovilusQuestion').textContent = 'Le cercle est fermé.';
  ovilusLog('Cercle fermé. Remerciement à ' + (currentSpirit ? currentSpirit.name : 'la présence') + '.');
  currentSpirit = null;
  playKnock(3);
  if(noiseOn) toggleNoise();
  window.speechSynthesis && window.speechSynthesis.cancel();
}

function setOvilusDeviceType(type){
  document.getElementById('deviceTypePhone').classList.toggle('on', type==='phone');
  document.getElementById('deviceTypeComputer').classList.toggle('on', type==='computer');
  var hint = document.getElementById('deviceTypeHint');
  var motionBtnEl = document.getElementById('motionBtn');
  if(type==='phone'){
    hint.textContent = '📱 Idéal. Active la détection de mouvement, puis ouvre le cercle.';
    motionBtnEl.style.display = 'block';
    motionBtnEl.style.boxShadow = '0 0 16px rgba(123,92,255,0.5)';
  } else {
    hint.textContent = '💻 Micro ou question écrite. Ouvre le cercle avant de consulter.';
    motionBtnEl.style.display = 'none';
  }
}

function setOvilusMode(m){
  ovilusMode = m;
  document.getElementById('modeMots').classList.toggle('active', m==='mots');
  document.getElementById('modePhonetique').classList.toggle('active', m==='phonetique');
  document.getElementById('modeFluide').classList.toggle('active', m==='fluide');
}

function nowStamp(){
  var d = new Date();
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + ':' + String(d.getSeconds()).padStart(2,'0');
}
function ovilusLog(text){
  var log = document.getElementById('ovilusLog');
  if(log.children.length===1 && /Aucune/.test(log.children[0].textContent)) log.innerHTML='';
  var entry = document.createElement('div');
  entry.className = 'ovilus-log-entry';
  entry.innerHTML = '<span class="when">'+nowStamp()+'</span><b>'+String(text).replace(/</g,'&lt;')+'</b>';
  log.prepend(entry);
}

if('speechSynthesis' in window){
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = function(){ speechSynthesis.getVoices(); };
}
function speakBrowser(text){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  var utter = new SpeechSynthesisUtterance(text);
  var voices = speechSynthesis.getVoices();
  var frFr = voices.filter(function(v){ return v.lang && v.lang.toLowerCase()==='fr-fr'; });
  var maleHints = ['thomas','paul','daniel','nicolas','antoine','henri','guillaume','male','homme'];
  var picked = frFr.find(function(v){ var n=v.name.toLowerCase(); return maleHints.some(function(h){return n.indexOf(h)!==-1;}); }) || frFr[0];
  if(picked) utter.voice = picked;
  utter.lang = 'fr-FR';
  utter.rate = 0.78;
  utter.pitch = (picked && maleHints.some(function(h){return picked.name.toLowerCase().indexOf(h)!==-1;}) ? 0.82 : 0.72);
  speechSynthesis.speak(utter);
}
function unlockOvilusSpeech(){
  if(!('speechSynthesis' in window)) return;
  var u = new SpeechSynthesisUtterance(''); u.volume=0; speechSynthesis.speak(u);
  try{ ctx(); }catch(e){}
}

function pickFrom(arr, n){
  var out=[], copy=arr.slice();
  n = Math.min(n, copy.length);
  for(var i=0;i<n;i++){ var j=Math.floor(Math.random()*copy.length); out.push(copy.splice(j,1)[0]); }
  return out;
}
function biasFromQuestion(q){
  q = (q||'').toLowerCase();
  var extra = [];
  if(/qui|nom|esprit/.test(q)) extra.push('nom','ici','ancien');
  if(/mère|maman|père|papa|famille/.test(q)) extra.push('mère','père','maison','pardon');
  if(/amour|aime|cœur|coeur/.test(q)) extra.push('amour','reste','lien');
  if(/peur|danger/.test(q)) extra.push('paix','doux','non');
  if(/mort|parti|décéd/.test(q)) extra.push('près','paix','écoute');
  if(/où|place|maison/.test(q)) extra.push('maison','porte','jardin');
  return extra;
}
function answerFromSpirit(question){
  if(!currentSpirit) attachSpirit(false);
  var s = currentSpirit;
  var q = (question||'').toLowerCase();

  if(ovilusMode==='phonetique'){
    var bits = (s.words||[]).map(function(w){ return w.slice(0, Math.min(3,w.length)); });
    return pickFrom(PHON.concat(bits), 2+Math.floor(Math.random()*3)).join('  ');
  }
  if(ovilusMode==='mots'){
    var pool = (s.words||[]).concat(DICT);
    if(/qui|nom/.test(q)) pool = [s.name.split(' ')[0]].concat(pool);
    return pickFrom(pool, 1+Math.floor(Math.random()*3)).join(' · ');
  }

  if(/qui|nom|esprit|t['’ ]es qui/.test(q)){
    return s.name + '. ' + s.born + ' à ' + s.died + '. C’est moi.';
  }
  if(/année|quand|date|époque/.test(q)){
    return 'Je parle d’entre ' + s.era.replace('-',' et ') + '. Je suis parti en ' + String(s.died).slice(2) + '.';
  }

  if(spiritStoryIndex >= s.stories.length){
    return s.leaveLine || 'Je n’ai rien de plus à ajouter maintenant.';
  }
  var story = s.stories[spiritStoryIndex];
  spiritStoryIndex++;
  return story;
}
function localOvilusReply(question){
  return answerFromSpirit(question);
}

function typeOnScreen(text, done){
  var el = document.getElementById('ovilusScreen');
  var box = document.getElementById('ovilusScreenBox');
  el.classList.remove('lit');
  el.textContent = '';
  box.classList.add('flicker');
  setTimeout(function(){ box.classList.remove('flicker'); }, 500);
  var i = 0;
  var timer = setInterval(function(){
    i++;
    el.textContent = text.slice(0, i);
    if(i >= text.length){
      clearInterval(timer);
      el.classList.add('lit');
      if(done) done();
    }
  }, 38 + Math.random()*50);
}

function ovilusIsSilentReply(value){return !String(value||'').trim()||/^\s*(?:pas de r[eé]ponse|aucune r[eé]ponse|silence)[.!?…\s]*$/i.test(String(value))}
function clearOvilusSilentReply(){document.getElementById('ovilusScreen').textContent='';document.getElementById('ovilusScreen').classList.remove('lit');document.getElementById('ovilusStatus').textContent=''}
function showOvilusAnswer(response, extra){
  if(ovilusIsSilentReply(response)){clearOvilusSilentReply();return;}
  lastAsked = lastAsked || '(voix)';
  extra = null; // Léna-Ovilus : aucune interruption hostile ou voix surprise.
  if(ovilusMode==='fluide'){
    ovilusHistory.push({role:'user', content:lastAsked});
    ovilusHistory.push({role:'assistant', content:response});
    if(ovilusHistory.length>16) ovilusHistory = ovilusHistory.slice(-16);
  }
  emf = Math.min(4.8, emf + 0.8 + Math.random());
  temp = Math.max(16.6, temp - (0.4+Math.random()*0.8));
  veil = Math.min(96, veil + 8);
  document.getElementById('ovilusStatus').textContent = 'Mot capté';
  ovilusLog(response);
  typeOnScreen(response, function(){
    speakBrowser(response);
    if(Math.random()<0.45) playKnock(1+Math.floor(Math.random()*2));
  });
}

function ovilusConsult(){
  if(!seanceOpen){ document.getElementById('ovilusStatus').textContent = 'Ouvre le cercle d\'abord'; return; }
  if(ovilusBusy) return;
  unlockOvilusSpeech();
  var typed = document.getElementById('ovilusTypedQuestion');
  var question = typed.value.trim();
  if(!question && ovilusMode==='fluide'){
    document.getElementById('ovilusStatus').textContent = 'Pose une question d\'abord';
    return;
  }
  lastAsked = question;
  typed.value = '';
  ovilusBusy = true;
  document.getElementById('ovilusScreen').classList.remove('lit');
  document.getElementById('ovilusScreen').textContent = '·  ·  ·';
  document.getElementById('ovilusStatus').textContent = 'Écoute du voile…';
  emf += 0.4;

  var thinkDelay = 700 + Math.random()*900;

  setTimeout(function(){
    document.getElementById('ovilusStatus').textContent = 'Filtrage…';
    var isNew = seanceFresh;
    // The same question is retried with its original id when a response is lost.
    if(!ovilusPendingRequest || ovilusPendingRequest.question!==lastAsked || ovilusPendingRequest.mode!==ovilusMode){
      ovilusPendingRequest={question:lastAsked,mode:ovilusMode,token:token,history:ovilusHistory,newSeance:isNew,requestId:(window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2))};
    }
    seanceFresh = false;
    fetch('/api/ovilus/consult', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(ovilusPendingRequest)
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      ovilusBusy = false;
      if(data && !data.error)ovilusPendingRequest=null;
      if(data && (data.silence || !data.error && typeof data.response==='string' && ovilusIsSilentReply(data.response))){
        // Un silence de manifestation n'est pas une réponse : écran vide, aucune entrée dans le journal.
        document.getElementById('ovilusScreen').textContent = '';
        document.getElementById('ovilusScreen').classList.remove('lit');
        document.getElementById('ovilusStatus').textContent = '';
        return;
      }
      if(data && data.error){
        document.getElementById('ovilusStatus').textContent = data.error;
        return;
      }
      if(!data||!data.response){document.getElementById('ovilusStatus').textContent='Le voile est trouble, réessaie.';return;}
      var txt = compactSpirit(data.response);
      if((!data || !data.response)&&ovilusMode!=='fluide') document.getElementById('demoBanner').style.display='block';
      showOvilusAnswer(txt, null);
    })
    .catch(function(){
      ovilusBusy = false;
      document.getElementById('ovilusStatus').textContent='Le voile est trouble, réessaie.';
    });
  }, thinkDelay);
}

function compactSpirit(text){
  text = String(text||'').replace(/\s+/g,' ').trim();
  if(ovilusMode==='mots'){
    var words = text.split(/[\s,;.]+/).filter(Boolean).slice(0,4);
    return words.join(' · ');
  }
  if(ovilusMode==='phonetique'){
    return text.slice(0,22).toLowerCase().replace(/[aeiouy]{2,}/g,' ').replace(/\s+/g,'  ');
  }
  if(text.length>220) text = text.slice(0,220).replace(/\s+\S*$/,'') + '…';
  return text;
}

var ovilusMotionActive=false, ovilusLastAccel=null, ovilusShakeCooling=false;
var OVILUS_SHAKE_THRESHOLD=9, OVILUS_SHAKE_COOLDOWN=1400;
function handleOvilusMotion(e){
  var a = e.accelerationIncludingGravity || e.acceleration;
  if(!a || a.x===null) return;
  if(ovilusLastAccel){
    var delta = Math.abs(a.x-ovilusLastAccel.x)+Math.abs(a.y-ovilusLastAccel.y)+Math.abs(a.z-ovilusLastAccel.z);
    if(delta>2 && !ovilusBusy && !ovilusShakeCooling && seanceOpen)
      document.getElementById('ovilusStatus').textContent = 'Mouvement…. ('+delta.toFixed(1)+'/'+OVILUS_SHAKE_THRESHOLD+')';
    if(delta>OVILUS_SHAKE_THRESHOLD && !ovilusShakeCooling && !ovilusBusy && seanceOpen){
      ovilusShakeCooling = true;
      document.getElementById('ovilusCrystal').classList.add('listening');
      setTimeout(function(){ document.getElementById('ovilusCrystal').classList.remove('listening'); ovilusShakeCooling=false; }, OVILUS_SHAKE_COOLDOWN);
      ovilusConsult();
    }
  }
  ovilusLastAccel = {x:a.x,y:a.y,z:a.z};
}
function enableOvilusMotion(){
  var btn = document.getElementById('motionBtn');
  if(typeof DeviceMotionEvent!=='undefined' && typeof DeviceMotionEvent.requestPermission==='function'){
    DeviceMotionEvent.requestPermission().then(function(state){
      if(state==='granted'){
        addEventListener('devicemotion', handleOvilusMotion);
        ovilusMotionActive=true; btn.textContent='📳 Mouvement activé — secoue'; btn.disabled=true;
      } else document.getElementById('ovilusStatus').textContent='Accès au mouvement refusé';
    }).catch(function(){ document.getElementById('ovilusStatus').textContent='Mouvement indisponible'; });
  } else if('DeviceMotionEvent' in window){
    addEventListener('devicemotion', handleOvilusMotion);
    ovilusMotionActive=true; btn.textContent='📳 Mouvement activé — secoue'; btn.disabled=true;
  } else {
    document.getElementById('ovilusStatus').textContent='Mouvement non supporté'; btn.disabled=true;
  }
}

var SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition=null, ovilusListening=false, ovilusFinalTranscript='', ovilusSilenceTimer=null;
var OVILUS_SILENCE_MS=3500;
function ovilusResetSilence(){
  if(ovilusSilenceTimer) clearTimeout(ovilusSilenceTimer);
  ovilusSilenceTimer=setTimeout(function(){ if(ovilusListening){ try{recognition.stop();}catch(e){} } }, OVILUS_SILENCE_MS);
}
if(SpeechRecognitionCtor){
  recognition = new SpeechRecognitionCtor();
  recognition.lang='fr-FR'; recognition.continuous=true; recognition.interimResults=true;
  recognition.onstart=function(){ ovilusResetSilence(); };
  recognition.onresult=function(e){
    var interim='';
    for(var i=e.resultIndex;i<e.results.length;i++){
      var chunk=e.results[i][0].transcript;
      if(e.results[i].isFinal) ovilusFinalTranscript += chunk+' ';
      else interim += chunk;
    }
    var live=(ovilusFinalTranscript+interim).trim();
    if(live) document.getElementById('ovilusQuestion').textContent='« '+live+' »';
    ovilusResetSilence();
  };
  recognition.onend=function(){
    ovilusListening=false;
    if(ovilusSilenceTimer) clearTimeout(ovilusSilenceTimer);
    document.getElementById('ovilusCrystal').classList.remove('listening');
    var full=ovilusFinalTranscript.trim();
    if(full){ document.getElementById('ovilusTypedQuestion').value=full; ovilusConsult(); }
    else if(seanceOpen) document.getElementById('ovilusStatus').textContent='Présence invitée — une question à la fois';
  };
  recognition.onerror=function(){
    ovilusListening=false;
    if(ovilusSilenceTimer) clearTimeout(ovilusSilenceTimer);
    document.getElementById('ovilusCrystal').classList.remove('listening');
    document.getElementById('ovilusStatus').textContent='Micro indisponible';
  };
}
function ovilusListen(){
  if(!seanceOpen) return;
  if(!recognition){ document.getElementById('ovilusStatus').textContent='Dictée non supportée — écris'; return; }
  if(ovilusListening){ try{recognition.stop();}catch(e){} return; }
  unlockOvilusSpeech();
  ovilusFinalTranscript=''; ovilusListening=true;
  document.getElementById('ovilusCrystal').classList.add('listening');
  document.getElementById('ovilusStatus').textContent='Je t\'écoute…';
  try{ recognition.start(); }catch(e){}
}

document.getElementById('ovilusTypedQuestion').addEventListener('keydown', function(e){
  if(e.key==='Enter') ovilusConsult();
});
(function(){
  var isPhone = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || (navigator.maxTouchPoints>1 && screen.width<900);
  setOvilusDeviceType(isPhone?'phone':'computer');
})();
