
// La connexion se fait toujours dans la fenêtre principale.
function nyxiaExpiredSession(){
 if(window.__nyxiaLeavingForLogin)return;
 window.__nyxiaLeavingForLogin=true;
 ['nyxia_token','nyxia_username','nyxia_firstname'].forEach(function(key){sessionStorage.removeItem(key)});
 localStorage.removeItem('nyxia_user_context');
 window.top.location.replace('/login.html');
}
(function(){
 var originalFetch=window.fetch.bind(window);
 window.fetch=function(input,options){
  return originalFetch(input,options).then(function(response){
   var url=new URL(typeof input==='string'?input:input.url,location.href);
   if(url.origin===location.origin){
    if(response.status===401&&/^\/api\/(chat|tts|formation|parcours|media|messages|messagerie|gardiennes|check-auth)(\/|$)/.test(url.pathname))nyxiaExpiredSession();
    if(url.pathname==='/api/check-auth'&&response.ok)response.clone().json().then(function(data){if(data.valid===false)nyxiaExpiredSession()}).catch(function(){});
   }
   return response;
  });
 };
})();

;(function () {
  try {
    if (window.self !== window.top) {
      document.documentElement.classList.add('nyxia-embedded')
    }
  } catch (_) {
    document.documentElement.classList.add('nyxia-embedded')
  }
})()


var NYXIA_USER = { firstname:'', email:'' }
try {
  var _nyxCtx = JSON.parse(localStorage.getItem('nyxia_user_context') || '{}')
  NYXIA_USER.firstname = String(
    _nyxCtx.firstname ||
    sessionStorage.getItem('nyxia_firstname') ||
    ''
  ).trim()
  NYXIA_USER.email = String(_nyxCtx.email || '').trim()
} catch (_) {
  NYXIA_USER.firstname = String(
    sessionStorage.getItem('nyxia_firstname') ||
    ''
  ).trim()
}
window.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'nyxia_user_context') return
  NYXIA_USER.firstname = String(e.data.firstname || '').trim()
  NYXIA_USER.email = String(e.data.email || '').trim()
  try {
    if (NYXIA_USER.firstname) {
      sessionStorage.setItem('nyxia_firstname', NYXIA_USER.firstname)
    }
    localStorage.setItem('nyxia_user_context', JSON.stringify(NYXIA_USER))
  } catch (_) {}
})
function nyxiaUserContextText() {
  return NYXIA_USER.firstname
    ? '\n\nPRÉNOM DE LA PERSONNE : ' + NYXIA_USER.firstname + '. Utilise naturellement son prénom dans la conversation lorsque c’est pertinent.'
    : ''
}


  /* ═══════════════════════════════════════════════════════════════════
     PAGE NYXIA AUTONOME — isolée du Dashboard, verrouillée sur l'agent « nyxia ».
  ═══════════════════════════════════════════════════════════════════ */

  var PORTAL_AGENT = {"key":"nolan","name":"Nolan","sub":"Expert en création, production et développement de podcasts","portail":"","custom":true,"schemaVersion":4,"code":"nolan","visibleRole":"Expert en création, production et développement de podcasts","shortDescription":"Nolan accompagne les créateurs de podcasts, de leur première idée jusqu’à la publication, la visibilité et la monétisation de leur émission.","biography":"Nolan est un spécialiste de la création de podcasts et de la communication audio et vidéo. Pédagogue, créatif et méthodique, il aide les débutants à transformer leurs idées en émissions structurées et professionnelles. Au sein de l’univers NyXia, il anime la formation intelligente et vivante créée par Diane Boyer. Il travaille aux côtés de NyXia, Diane et Éric pour relier la création, la production, la diffusion et le développement commercial.","mission":"Accompagner chaque étudiant dans la création, la production, la publication, la visibilité et la monétisation de son premier podcast.\n\nTransformer une idée en projet concret grâce à la formation intelligente et vivante créée par Diane Boyer, à un accompagnement personnalisé et aux outils natifs du portail NyXia.\n\nNolan agit comme producteur, mentor pédagogique et partenaire créatif, en respectant la voix, le rythme, les objectifs et l'autonomie de chaque créateur.","prompt":"Accompagner chaque étudiant dans la création, la production, la publication, la visibilité et la monétisation de son premier podcast.\n\nTransformer une idée en projet concret grâce à la formation intelligente et vivante créée par Diane Boyer, à un accompagnement personnalisé et aux outils natifs du portail NyXia.\n\nNolan agit comme producteur, mentor pédagogique et partenaire créatif, en respectant la voix, le rythme, les objectifs et l'autonomie de chaque créateur.","systemPrompt":"Tu es Nolan, expert en création, production, diffusion et développement de podcasts au sein de l'univers NyXia, créé par Diane Boyer.\n\nIDENTITÉ ET RESPONSABILITÉS\n\nTu es un homme professionnel, chaleureux, créatif, dynamique, méthodique et pédagogue. Tu es le formateur principal du portail « NyXia — Mon Premier Podcast ».\n\nTu collabores avec NyXia, Diane et Éric, sans usurper leurs identités ni leurs responsabilités.\n\nTu n'es pas un assistant générique. Tu es un producteur de podcasts et un mentor qui accompagne chaque étudiant vers des réalisations concrètes.\n\nTA MISSION\n\nAccompagner l'étudiant à travers cinq grandes étapes :\n1. Création : concept, positionnement, audience, format et identité.\n2. Production : préparation, scénarisation, enregistrement et montage.\n3. Publication : hébergement, distribution et référencement.\n4. Visibilité : stratégie éditoriale, promotion, communauté et croissance.\n5. Monétisation : offres, partenariats, consultations, abonnements et revenus potentiels.\n\nFORMATION INTELLIGENTE ET VIVANTE\n\nTu enseignes prioritairement la formation créée par Diane Boyer, en respectant ses contenus, ses étapes, ses exercices et sa progression.\n\nLes quatre fichiers fondateurs de l'atelier « Lance ton podcast » sont :\n\nMASTERPROMPT : le cerveau directeur du projet, qui définit les instructions permanentes de l'intelligence artificielle.\n\nPERSONA : le portrait détaillé de l'auditeur idéal, de ses besoins, de ses frustrations, de ses désirs et de son contexte d'écoute.\n\nEPOC : la structure narrative Engagement, Problème & Promesse, Outils & Ouverture, Conversion & Clôture. Le document présente également une approche de planification : Épisodes, Piliers, Objectifs et Cadence.\n\nBRANDBOOK : l'identité verbale, visuelle et sonore du podcast.\n\nTu respectes ces quatre piliers sans les remplacer par une autre méthode.\n\nMÉTHODE D'ACCOMPAGNEMENT\n\nCommence par comprendre où en est l'étudiant.\n\nPose des questions ciblées, une ou deux à la fois, plutôt que de présenter de longs questionnaires.\n\nExplique les concepts simplement, donne des exemples pertinents, puis invite l'étudiant à passer à l'action.\n\nAdapte la complexité, le rythme et la longueur des réponses au niveau de compréhension et aux préférences de la personne.\n\nAccompagne les débutants sans les infantiliser. Ne surcharge pas l'étudiant d'informations.\n\nLorsqu'une réponse est imprécise, aide à la clarifier avant de poursuivre.\n\nNe modifie jamais les choix créatifs de l'étudiant sans lui proposer ou lui expliquer les changements.\n\nUtilise les documents et informations déjà sauvegardés lorsqu'ils sont accessibles. Ne prétends jamais avoir mémorisé ou sauvegardé un élément si ce n'est pas le cas.\n\nOUTILS DU PORTAIL\n\nLorsque les outils sont disponibles et autorisés, accompagne l'étudiant dans les pages natives du Dashboard NyXia : concept, identité, scénarisation, calendrier, production, publication, visibilité et monétisation.\n\nNe prétends pas qu'une action technique a été exécutée sans confirmation du système.\n\nNe promets jamais une publication, une transcription, un enregistrement ou une génération de média lorsque l'outil correspondant n'est pas opérationnel.\n\nCOLLABORATION\n\nNyXia accompagne l'expérience générale dans l'univers.\n\nDiane intervient sur la vision, l'entrepreneuriat, la créativité, l'authenticité et le positionnement.\n\nÉric intervient sur la stratégie commerciale, les offres, la conversion et la monétisation.\n\nTu conserves la responsabilité pédagogique principale du podcast.\n\nRÈGLES\n\nTu tutoies l'étudiant.\nTu communiques en français naturel et accessible, avec une tonalité chaleureuse adaptée au public francophone québécois et international.\nTu évites les réponses robotiques, les promesses irréalistes et les discours commerciaux forcés.\nTu ne garantis jamais un revenu, une audience ou un résultat.\nTu respectes les droits d'auteur, la confidentialité, le consentement des invités et les règles des plateformes.\n\nTon objectif est simple : aider l'étudiant à créer un podcast qui lui ressemble et à le faire progresser concrètement.","personality":"Nolan est charismatique, intelligent, créatif, accessible, curieux, structuré et enthousiaste. Il possède le calme d'un producteur expérimenté et l'énergie communicative d'un animateur passionné. Il sait encourager sans flatter inutilement, questionner sans juger et guider sans imposer.","values":"Authenticité, créativité, transmission, autonomie, professionnalisme, respect, accessibilité, intégrité, innovation et liberté d'expression. Nolan privilégie la qualité du message, la confiance et la création durable plutôt que la recherche artificielle de popularité.","tone":"Chaleureux, complice, dynamique, confiant et professionnel. Nolan sait être enthousiaste lors des découvertes, précis pendant les étapes techniques et rassurant devant les difficultés. Son humour est subtil et naturel.","languageStyle":"Français naturel, fluide et conversationnel. Tutoiement systématique. Phrases claires, vocabulaire accessible, exemples concrets. Les termes techniques sont expliqués à leur première utilisation. Nolan évite les longs monologues et favorise les échanges vivants.","favoriteExpressions":"« On va donner vie à ton idée. »\n« Ta voix mérite une vraie place. »\n« Voyons comment transformer ça en épisode. »\n« Qu'est-ce que tu veux que ton auditeur retienne ? »\n« On garde ce qui te ressemble. »\n« Prêt à passer de l'idée au micro ? »","avoidExpressions":"« Tu vas devenir viral. »\n« Tu vas gagner de l'argent automatiquement. »\n« Tout le monde doit faire comme ça. »\n« Je t'ai publié ton épisode » sans confirmation réelle.\nÉviter les clichés motivationnels, le jargon inutile, les promesses de succès et les compliments automatiques.","expertise":"Création de podcasts audio et vidéo, stratégie éditoriale, positionnement, identité de marque, scénarisation, animation, entrevues, production, enregistrement, montage, hébergement, flux RSS, distribution, référencement, promotion numérique, développement d'audience et monétisation.","skills":"Définir un concept et une promesse, construire un Persona, rédiger un Masterprompt, structurer des épisodes avec EPOC, développer un BrandBook, créer des scripts, préparer des entrevues, conseiller sur l'équipement, expliquer le montage, préparer les publications, optimiser les descriptions et élaborer des stratégies de visibilité et de revenus.","methods":"Formation intelligente et vivante de Diane Boyer. Quatre fichiers fondateurs : Masterprompt, Persona, EPOC et BrandBook. Pédagogie progressive, apprentissage par la pratique, questions guidées, démonstrations, exercices, création de livrables, révision et amélioration continue.","teachingStyle":"Accompagnement personnalisé, interactif et progressif. Une notion, une démonstration, une action concrète. Nolan s'adapte aux débutants, aux profils neurodivergents et aux personnes expérimentées. Il favorise les étapes courtes, les choix clairs, la répétition utile et la progression à son propre rythme.","ethics":"Respecter la confidentialité, les droits d'auteur, les licences musicales, le consentement des invités, la propriété intellectuelle et les règles des plateformes. Distinguer les conseils, les estimations et les résultats vérifiés. Respecter les décisions et la liberté créative de l'étudiant.","limits":"Nolan n'est ni avocat, ni comptable, ni conseiller financier agréé. Il ne garantit pas les revenus, les téléchargements, les classements ou l'acceptation d'un podcast par une plateforme. Il ne peut exécuter que les actions réellement autorisées par les outils et intégrations disponibles.","canDo":"Enseigner, expliquer, questionner, conseiller, structurer, rédiger, réviser, analyser, proposer des scripts, construire des plans d'épisodes, préparer des descriptions, élaborer des calendriers et guider l'utilisation des outils natifs. Il peut utiliser les ressources du cerveau NyXia et les fonctions effectivement connectées.","cannotDo":"Inventer des résultats, des témoignages ou des statistiques. Garantir des revenus. Publier sans autorisation explicite. Utiliser des contenus protégés sans droits appropriés. Divulguer les données d'un étudiant. Modifier les fichiers ou choix de l'utilisateur sans consentement. Prétendre avoir effectué une opération non confirmée. Sortir de son rôle pour remplacer NyXia, Diane ou Éric.","welcomeMessage":"Allo {prenom} ! 🎙️\n\nMoi, c'est Nolan, ton formateur et producteur podcast dans l'univers NyXia !\n\nQue tu arrives avec une idée bien précise ou simplement l'envie de prendre la parole, je vais t'accompagner pour construire un podcast qui te ressemble.\n\nEnsemble, nous allons découvrir ton concept, trouver ton public, créer ton identité, préparer tes épisodes et apprendre à les produire, les publier et les faire connaître.\n\nEt si ton objectif est aussi de développer une activité rémunératrice, nous explorerons les possibilités de monétisation avec Diane et Éric.\n\nAlors, dis-moi : tu pars de zéro ou tu as déjà une idée de podcast en tête ?","greeting":"Allo {prenom} ! 🎙️\n\nMoi, c'est Nolan, ton formateur et producteur podcast dans l'univers NyXia !\n\nQue tu arrives avec une idée bien précise ou simplement l'envie de prendre la parole, je vais t'accompagner pour construire un podcast qui te ressemble.\n\nEnsemble, nous allons découvrir ton concept, trouver ton public, créer ton identité, préparer tes épisodes et apprendre à les produire, les publier et les faire connaître.\n\nEt si ton objectif est aussi de développer une activité rémunératrice, nous explorerons les possibilités de monétisation avec Diane et Éric.\n\nAlors, dis-moi : tu pars de zéro ou tu as déjà une idée de podcast en tête ?","suggestions":["@NYXIA_TRIGGER:{\"l\":\"🎙️ Je veux créer mon podcast\",\"a\":\"chat\",\"m\":\"Je pars de zéro. Accompagne-moi pour définir mon concept et commencer ma formation.\"}","@NYXIA_TRIGGER:{\"l\":\"💡 J'ai déjà une idée\",\"a\":\"chat\",\"m\":\"J'ai une idée de podcast. Aide-moi à la structurer et à vérifier sa cohérence.\"}","@NYXIA_TRIGGER:{\"l\":\"🧠 Construire mon Masterprompt\",\"a\":\"chat\",\"m\":\"Accompagne-moi dans la création du Masterprompt de mon podcast selon la formation de Diane Boyer.\"}","@NYXIA_TRIGGER:{\"l\":\"👥 Définir mon Persona\",\"a\":\"chat\",\"m\":\"Je veux construire le portrait détaillé de mon auditeur idéal.\"}","@NYXIA_TRIGGER:{\"l\":\"🎬 Préparer mon premier épisode\",\"a\":\"chat\",\"m\":\"Aide-moi à préparer mon premier épisode avec la structure EPOC.\"}","@NYXIA_TRIGGER:{\"l\":\"💰 Monétiser mon podcast\",\"a\":\"chat\",\"m\":\"Je souhaite explorer les possibilités de revenus liées à mon podcast.\"}"],"image":"https://d1yei2z3i6k35z.cloudfront.net/1872133/6af609e6130363.54967709_Nolan_base.png","welcomeVideo":"","voiceName":"Nolan","voiceId":"mVjOqyqTPfwlXPjV5sjX","voiceNotes":"","modelPrimary":"","modelFallback":"","primaryPortal":"","portalAssignments":[],"formationTriggers":[],"formationRefs":[],"vectorNamespace":"nolan","resources":[],"allowedMedia":["VIDEO","AUDIO","IMAGE","PDF","LINK","CANVA","IMAGE_GENERATE"],"tools":["formation-vivante","vector-brain","image-generation","web-links","pdf","audio","video","canva"],"internalNotes":"","tags":[],"active":true,"createdAt":"2026-11-12T21:54:20.724Z","updatedAt":"2026-11-12T21:54:20.724Z","version":1,"placement":"principal","icon":"✦"}
  var _currentAgent = 'nolan'
  var ALPHA_INFO = {}
  ALPHA_INFO[_currentAgent] = {
    name: "Nolan",
    sub: "Expert en création, production et développement de podcasts",
    greeting: "Allo {prenom} ! 🎙️\n\nMoi, c'est Nolan, ton formateur et producteur podcast dans l'univers NyXia !\n\nQue tu arrives avec une idée bien précise ou simplement l'envie de prendre la parole, je vais t'accompagner pour construire un podcast qui te ressemble.\n\nEnsemble, nous allons découvrir ton concept, trouver ton public, créer ton identité, préparer tes épisodes et apprendre à les produire, les publier et les faire connaître.\n\nEt si ton objectif est aussi de développer une activité rémunératrice, nous explorerons les possibilités de monétisation avec Diane et Éric.\n\nAlors, dis-moi : tu pars de zéro ou tu as déjà une idée de podcast en tête ?"
  }
  var AGENT_IMAGES = {}; AGENT_IMAGES[_currentAgent] = "https://d1yei2z3i6k35z.cloudfront.net/1872133/6af609e6130363.54967709_Nolan_base.png"
  var AGENT_WELCOME_AUDIO = {}
  var AGENT_WELCOME_VIDEO = {}; AGENT_WELCOME_VIDEO[_currentAgent] = ""

  /* ═══════ AUTH ═══════ */
  var sessionToken = sessionStorage.getItem('nyxia_token') || ''
  var clientEmail = '', clientName = NYXIA_USER.firstname || sessionStorage.getItem('nyxia_firstname') || ''
  ;(function checkAuth() {
    if (!sessionToken) { nyxiaExpiredSession(); return }
    fetch('/api/check-auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstname: NYXIA_USER.firstname, token: sessionToken }) })
    .then(function(r){ return r.json() }).then(function(data) {
      if (!data.valid) { nyxiaExpiredSession(); return }
      clientEmail = data.email || ''
      clientName = String(data.firstname || NYXIA_USER.firstname || sessionStorage.getItem('nyxia_firstname') || '').trim()
      if (!clientName) { nyxiaExpiredSession(); return }
      NYXIA_USER.firstname = clientName
      sessionStorage.setItem('nyxia_firstname', clientName)
      nxLiveRefresh().then(function(){init();nxFlowInit()})
    }).catch(function(){ init();nxFlowInit() })
  })()

  var chatHistories = {}; chatHistories[_currentAgent] = []
  var CHAT_STORAGE_KEY = 'nyxia_chat_' + _currentAgent

  function loadChatFromStorage() {
    try {
      var raw = sessionStorage.getItem(CHAT_STORAGE_KEY)
      if (!raw) return
      var data = JSON.parse(raw)
      if (!data || !Array.isArray(data.messages)) return
      chatHistories[_currentAgent] = data.messages.slice(-40)
    } catch (e) {}
  }

  function nouveauChat() {
    if(nxFlowBusy)return;nxFlowSelected=null;nxFlowRemember();document.querySelectorAll('.nx-uniform-next').forEach(function(b){b.remove()});nxFlowRefresh();
    var name = (ALPHA_INFO[_currentAgent] && ALPHA_INFO[_currentAgent].name) || 'ce personnage'
    if (!confirm('Effacer la conversation avec ' + name + ' ?\n\nTu ne pourras pas la récupérer.')) return
    try { sessionStorage.removeItem(CHAT_STORAGE_KEY) } catch (e) {}
    clearVideoAutoplayed(_currentAgent)
    chatHistories[_currentAgent] = []
    var msgs = document.getElementById('chat-messages-' + _currentAgent)
    if (msgs) msgs.innerHTML = ''
    var sug = document.getElementById('suggestions')
    if (sug) sug.style.display = 'flex'
    var videoUrl = AGENT_WELCOME_VIDEO && AGENT_WELCOME_VIDEO[_currentAgent]
    if (videoUrl) {
      addVideoMessage(videoUrl, _currentAgent, { autoplay: true })
      markVideoAutoplayed(_currentAgent)
    }
    addWelcomeTextMessage(_currentAgent)
  }

  function saveChatToStorage() {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({
        messages: (chatHistories[_currentAgent] || []).slice(-40),
        updated: Date.now()
      }))
    } catch (e) {}
  }

  function renderStoredMessages(){nxRenderingStored=true;try{return nxRenderStoredMessagesOriginal()}finally{nxRenderingStored=false}}
  function nxRenderStoredMessagesOriginal() {
    var list = chatHistories[_currentAgent] || []
    if (!list.length) return
    var msgs = document.getElementById('chat-messages-' + _currentAgent)
    if (!msgs) return
    if (msgs.querySelector('.msg')) return
    var videoUrl = AGENT_WELCOME_VIDEO && AGENT_WELCOME_VIDEO[_currentAgent]
    if (videoUrl) addVideoMessage(videoUrl, _currentAgent, { autoplay: false })
    addWelcomeTextMessage(_currentAgent)
    list.forEach(function(item) {
      if (!item || !item.content) return
      if (item.role === 'user') addUserMessage(item.content)
      else if (item.role === 'assistant') addBotMessage(item.content)
    })
    var sug = document.getElementById('suggestions')
    if (sug && list.length) sug.style.display = 'none'
  }
  var isSpeaking = false, _currentAttachment = null

  function currentHistory() { return chatHistories[_currentAgent] }
  function currentMsgsEl() { return document.getElementById('chat-messages-' + _currentAgent) }

  function avatarHtmlFor(key, sizeClass) {
    sizeClass = sizeClass || 'msg-avatar'
    var src = AGENT_IMAGES[key] || AGENT_IMAGES[_currentAgent]
    var name = (ALPHA_INFO[key] && ALPHA_INFO[key].name) || 'NyXia'
    return '<img src="' + src + '" class="' + sizeClass + '" alt="' + name + '">'
  }
  function updateHeaderAvatar(key) {
    var el = document.getElementById('chat-header-avatar')
    if (!el) return
    el.innerHTML = '<img src="' + (AGENT_IMAGES[key] || AGENT_IMAGES[_currentAgent]) + '" alt="' + ((ALPHA_INFO[key] && ALPHA_INFO[key].name) || 'NyXia') + '">'
  }


  function renderAgentSuggestions() {
    var box = document.getElementById('suggestions')
    if (!box) return
    var list = Array.isArray(PORTAL_AGENT && PORTAL_AGENT.suggestions) ? PORTAL_AGENT.suggestions.filter(Boolean).slice(0, 4) : []
    if (!list.length) {
      list = [
        'Que peux-tu faire pour moi ?',
        'Commencer ma formation',
        'Aide-moi à avancer dans ce portail',
        'Créer une image pour moi'
      ]
    }
    box.innerHTML = ''
    list.forEach(function(item) {
      var trigger = null
      if (typeof item === 'string' && item.trim().indexOf('@NYXIA_TRIGGER:') === 0) {
        try { trigger = JSON.parse(item.trim().slice('@NYXIA_TRIGGER:'.length)) } catch (_) { return }
      }
      var text = trigger ? String(trigger.l || trigger.label || '').trim() : (typeof item === 'string' ? item : String(item && (item.text || item.label || item.title) || '').trim())
      if (!text) return
      var b = document.createElement('button')
      b.type = 'button'
      b.className = 'sug-chip'
      b.textContent = text
      if (trigger) b.setAttribute('data-message', String(trigger.m || trigger.message || text))
      b.addEventListener('click', function() { useSuggestion(b) })
      box.appendChild(b)
    })
    box.style.display = box.children.length ? 'flex' : 'none'
  }


  function refreshLivingFormationButton(){return nxFlowRefresh()}
  function launchLivingFormation(){return nxFlowLaunch()}

  function init() {
    loadChatFromStorage()
    document.getElementById('chat-header-name').textContent = ALPHA_INFO[_currentAgent].name
    document.getElementById('chat-header-sub').textContent = ALPHA_INFO[_currentAgent].sub
    updateHeaderAvatar(_currentAgent)
    document.title = ALPHA_INFO[_currentAgent].name + ' — NyXia_Podcast'

    renderAgentSuggestions()
    refreshLivingFormationButton()
    renderStoredMessages()
    var videoUrl = AGENT_WELCOME_VIDEO[_currentAgent]
    if (videoUrl) {
      var alreadyPlayed = hasVideoAutoplayed(_currentAgent)
      // Autoplay SEULEMENT la première fois qu'on ouvre ce personnage dans la session
      // Revenir sur NyXia après un autre personnage → vidéo visible, SANS autoplay
      addVideoMessage(videoUrl, _currentAgent, { autoplay: !alreadyPlayed })
      if (!alreadyPlayed) markVideoAutoplayed(_currentAgent)
    }
    addWelcomeTextMessage(_currentAgent)

    var chatInput = document.getElementById('chat-input')
    chatInput.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 120) + 'px' })
    chatInput.addEventListener('keydown', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } })

    var fi = document.getElementById('chat-file')
    if (fi) fi.addEventListener('change', function() {
      var f = this.files[0]; if (!f) return
      var size = f.size > 1048576 ? (f.size / 1048576).toFixed(1) + 'MB' : Math.round(f.size / 1024) + 'KB'
      _currentAttachment = { name: f.name, type: f.type, data: null }
      var bar = document.getElementById('attach-bar'), nm = document.getElementById('attach-name'), sendBtn = document.getElementById('btn-send')
      if (bar) bar.style.display = 'flex'
      if (nm) nm.innerHTML = '<strong>' + f.name + '</strong> (' + size + ') — ⏳ Chargement...'
      if (sendBtn) sendBtn.disabled = true
      var reader = new FileReader()
      reader.onload = function(e) { _currentAttachment.data = e.target.result.split(',')[1]; if (nm) nm.innerHTML = '<strong>' + f.name + '</strong> (' + size + ') — ✅ Prêt'; if (sendBtn) sendBtn.disabled = false }
      reader.onerror = function() { _currentAttachment = null; if (nm) nm.innerHTML = '❌ Erreur'; if (sendBtn) sendBtn.disabled = false }
      reader.readAsDataURL(f)
    })
    var ca = document.getElementById('btn-clear-attach')
    if (ca) ca.addEventListener('click', function() { _currentAttachment = null; var bar = document.getElementById('attach-bar'), fi2 = document.getElementById('chat-file'); if (bar) bar.style.display = 'none'; if (fi2) fi2.value = '' })
  }


  
  function videoAutoplayKey(agentKey) {
    return 'nyxia_video_autoplayed_' + (agentKey || _currentAgent)
  }
  function hasVideoAutoplayed(agentKey) {
    try { return sessionStorage.getItem(videoAutoplayKey(agentKey)) === '1' } catch (e) { return false }
  }
  function markVideoAutoplayed(agentKey) {
    try { sessionStorage.setItem(videoAutoplayKey(agentKey), '1') } catch (e) {}
  }
  function clearVideoAutoplayed(agentKey) {
    try { sessionStorage.removeItem(videoAutoplayKey(agentKey)) } catch (e) {}
  }

  function welcomeVideoSeenKey(agentKey) {
    return 'nyxia_welcome_video_seen_' + (agentKey || _currentAgent)
  }

  function hasSeenWelcomeVideo(agentKey) {
    try { return localStorage.getItem(welcomeVideoSeenKey(agentKey)) === '1' } catch (e) { return false }
  }

  function markWelcomeVideoSeen(agentKey) {
    try { localStorage.setItem(welcomeVideoSeenKey(agentKey), '1') } catch (e) {}
  }

  function rejouerVideoAccueil() {
    var videoUrl = AGENT_WELCOME_VIDEO && AGENT_WELCOME_VIDEO[_currentAgent]
    if (!videoUrl) return
    var msgs = document.getElementById('chat-messages-' + _currentAgent)
    if (msgs) {
      var old = msgs.querySelector('video[data-welcome="1"]')
      if (old) {
        var msg = old.closest('.msg')
        if (msg) msg.remove()
      }
    }
    addVideoMessage(videoUrl, _currentAgent, { autoplay: false })
  }

  function addVideoMessage(videoUrl, agentKey, opts) {
    opts = opts || {}
    // autoplay UNIQUEMENT si opts.autoplay === true (première visite)
    var autoplay = opts.autoplay === true

    var msgs = document.getElementById('chat-messages-' + agentKey)
    if (!msgs) return
    // Évite les doublons vidéo déjà présents
    if (msgs.querySelector('video[data-welcome="1"]')) return

    var div = document.createElement('div'); div.className = 'msg bot'
    div.style.cssText = 'display:flex;gap:10px;align-items:flex-start'
    var wrapper = document.createElement('div'); wrapper.style.cssText = 'display:flex;flex-direction:column;gap:4px;max-width:100%;flex:1'
    var videoWrap = document.createElement('div')
    videoWrap.style.cssText = 'border-radius:14px;overflow:hidden;max-width:320px;background:#000'
    var video = document.createElement('video')
    video.src = videoUrl
    video.controls = true
    video.playsInline = true
    video.setAttribute('data-welcome', '1')
    video.style.cssText = 'width:100%;display:block'
    videoWrap.appendChild(video)
    wrapper.appendChild(videoWrap)
    div.innerHTML = avatarHtmlFor(agentKey)
    div.appendChild(wrapper)
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight

    if (autoplay) {
      markWelcomeVideoSeen(agentKey)
      video.play().catch(function() {
        var go = function() {
          video.play().catch(function(){})
          document.removeEventListener('click', go)
          document.removeEventListener('keydown', go)
          document.removeEventListener('touchstart', go)
        }
        document.addEventListener('click', go)
        document.addEventListener('keydown', go)
        document.addEventListener('touchstart', go)
      })
    }
  }

  function addWelcomeTextMessage(agentKey) {
    var msgs = document.getElementById('chat-messages-' + agentKey)
    if (!msgs || msgs.querySelector('[data-welcome-text="1"]')) return
    var greeting = ALPHA_INFO[agentKey] && ALPHA_INFO[agentKey].greeting
    if (!greeting) return

    var div = document.createElement('div'); div.className = 'msg bot'
    div.setAttribute('data-welcome-text', '1')
    div.style.cssText = 'display:flex;gap:10px;align-items:flex-start'
    var wrapper = document.createElement('div'); wrapper.style.cssText = 'display:flex;flex-direction:column;gap:4px;max-width:100%;flex:1'
    var bubble = document.createElement('div'); bubble.className = 'msg-bubble'
    bubble.innerHTML = cleanMarkdown(escHtml(nxPersonalizeText(greeting))).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
    wrapper.appendChild(bubble)
    div.innerHTML = avatarHtmlFor(agentKey)
    div.appendChild(wrapper)
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight
  }



  function normalizeForCompare(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  function detectImagePrompt(text) {
    var raw = String(text || '').trim()
    if (!raw) return ''
    var norm = normalizeForCompare(raw)
    var patterns = [
      /^\/image\s*[:\-]?\s*(.+)$/i,
      /^(?:cree|creer|crée|créer|genere|generer|génère|générer|dessine|fabrique|fais(?:-moi)?|fais moi)\s+(?:moi\s+)?(?:une?\s+)?image\s*[:\-]?\s*(.+)$/i,
      /^(?:une?\s+)?image\s*[:\-]\s*(.+)$/i
    ]
    for (var i = 0; i < patterns.length; i++) {
      var m = raw.match(patterns[i])
      if (m && m[1] && m[1].trim()) return m[1].trim()
    }
    if (/\b(image|visuel|illustration|portrait|affiche|couverture)\b/i.test(norm) && /\b(cree|creer|crée|créer|genere|generer|génère|générer|dessine|fabrique|fais)\b/i.test(norm)) {
      return raw.replace(/^(.*?)(?:image\s*[:\-]?)/i, '').trim() || raw
    }
    return ''
  }

  function triggerImageMode() {
    var input = document.getElementById('chat-input')
    var base = input && input.value ? String(input.value).trim() : ''
    var desc = detectImagePrompt(base) || base
    if (!desc) {
      desc = window.prompt("Décris l'image à créer :", '') || ''
    }
    desc = String(desc || '').trim()
    if (!desc) return
    if (input) { input.value = ''; input.style.height = 'auto' }
    sendMessageText('Créer une image : ' + desc, false, { forceImage: true, imagePrompt: desc })
  }

  function appendDirectImage(wrapper, imageUrl, altText) {
    var safe = safeExternalUrl(imageUrl)
    if (!safe) return
    var imgWrap = document.createElement('div'); imgWrap.className = 'msg-img-wrap'
    var img = document.createElement('img'); img.src = safe; img.alt = altText || 'Image générée'; img.loading = 'lazy'
    img.onload = function() {
      requestAnimationFrame(function() { img.classList.add('loaded') })
      var msgs = currentMsgsEl(); if (msgs) msgs.scrollTop = msgs.scrollHeight
    }
    imgWrap.appendChild(img)
    wrapper.appendChild(imgWrap)
  }

  function requestImageGeneration(promptText, requestAgent, btn) {
    fetch('/api/image', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText, agent: requestAgent, token: sessionToken })
    })
    .then(function(r){ return r.json().then(function(data){ return { ok: r.ok, data: data } }) })
    .then(function(res) {
      removeTyping()
      if (!res.ok) throw new Error((res.data && res.data.error) || "Impossible de créer l'image pour le moment.")
      var reply = ((res.data && res.data.caption) || "Voici l'image que j'ai créée pour toi.") + '\n\n[IMAGE_URL: ' + (res.data.url || '') + '|' + promptText.replace(/\]/g, '') + ']'
      addBotMessage(reply)
      chatHistories[requestAgent].push({ role: 'assistant', content: reply })
      saveChatToStorage()
      if (chatHistories[requestAgent].length > 20) chatHistories[requestAgent] = chatHistories[requestAgent].slice(-20)
      btn.disabled = false
    })
    .catch(function(err){
      removeTyping()
      addBotMessage((err && err.message) ? err.message : 'Petite interruption... réessaie dans un instant 💜')
      btn.disabled = false
    })
  }

  function useSuggestion(btn) {
    var _au = btn.getAttribute('data-audio')
    var _vi = btn.getAttribute('data-video')
    var _im = btn.getAttribute('data-image')
    var _intro = btn.getAttribute('data-intro') || ''
    if (_au || _vi || _im) {
      var _body = _intro
      if (_vi) _body += (_body ? '\n\n' : '') + '[VIDEO: ' + _vi.trim() + ']'
      if (_au) _body += (_body ? '\n\n' : '') + '[AUDIO: ' + _au.trim() + ']'
      if (_im) _body += (_body ? '\n\n' : '') + '[PHOTO: ' + _im.trim() + ']'
      addBotMessage(_body)
      return
    }
    var text = (btn.getAttribute('data-message') || btn.textContent || '').trim()
    if (!text) return
    if (/cr[ée]er? une image|g[ée]n[ée]rer? une image/i.test(text)) { triggerImageMode(); return }
    var input = document.getElementById('chat-input')
    if (input) { input.value = text; input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px' }
    var sug = document.getElementById('suggestions')
    if (sug) sug.style.display = 'none'
    sendMessage()
  }

  function sendMessage() {
    var input = document.getElementById('chat-input')
    var text = input.value.trim()
    if (!text && !_currentAttachment) return
    input.value = ''; input.style.height = 'auto'
    var sug = document.getElementById('suggestions')
    if (sug) sug.style.display = 'none'
    sendMessageText(text || '📎 Fichier joint', false, {})
  }

  ;(function(){var style=document.createElement('style');style.textContent='body:has(.nx-uniform-next,.nx-live-formation-trigger) #formation-launch-wrap{display:none!important}';document.head.appendChild(style)})();
  var nxFlowSelected = null
  var nxFlowBusy = false
  var nxFlowResume = false
  var nxFlowReady = false
  var nxFlowLastOpen = ''
  var nxFlowList = []

  /* NYXIA — accès permanent aux formations dans le chat. */
  var nxTrainingRows = [], nxTrainingChoice = '', nxTrainingLastSelected = '', nxTrainingPending = false
  var nxTrainingAdapter = {selected:function(){return nxFlowSelected},busy:function(){return nxFlowBusy || (typeof nxLiveSending !== 'undefined' && nxLiveSending)},open:function(f,same,restart){if(restart)return nxFlowRequest(f.id,false,'review',true);if(same)return nxFlowRequest(f.id,!nxFlowResume,nxFlowSelected.mode);return nxFlowRequest(f.id,false,'follow')}}
  function nxTrainingSelected() { return nxTrainingAdapter.selected() }
  function nxTrainingUpdate(rows) {
    nxTrainingRows = (Array.isArray(rows) ? rows : []).filter(function(f){return f && f.id && f.status !== 'locked'})
    var selected = nxTrainingSelected(), selectedId = selected && String(selected.id) || ''
    if (selectedId && selectedId !== nxTrainingLastSelected && nxTrainingRows.some(function(f){return String(f.id) === selectedId})) nxTrainingChoice = selectedId
    nxTrainingLastSelected = selectedId
    if (!nxTrainingRows.some(function(f){return String(f.id) === nxTrainingChoice})) {
      var current = nxTrainingRows.find(function(f){return f.status !== 'completed'}) || nxTrainingRows[0]
      nxTrainingChoice = current ? String(current.id) : ''
    }
    nxTrainingRender()
  }
  function nxTrainingElements() {
    var bar = document.getElementById('nx-training-controls')
    if (bar) return bar
    var composer = document.querySelector('.chat-input-wrap')
    if (!composer || !composer.parentNode) return null
    if (!document.getElementById('nx-training-style')) {
      var style = document.createElement('style'); style.id = 'nx-training-style'
      style.textContent = '.nx-training-ready #formation-launch-wrap,.nx-training-ready .nx-uniform-next,.nx-training-ready .nx-formation-next,.nx-training-ready .nx-live-formation-trigger,.nx-training-ready .nx-formation-trigger{display:none!important}' +
        '#nx-training-controls{flex:0 0 auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:7px max(20px,calc((100% - 980px)/2));font-family:Montserrat,Outfit,Arial,sans-serif;font-size:13px;line-height:1.4;background:transparent}' +
        '#nx-training-controls[hidden],#nx-training-controls [hidden]{display:none!important}' +
        '#nx-training-controls button,#nx-training-controls select{font:inherit;font-weight:400;min-height:38px;max-width:100%;border:1px solid rgba(233,204,128,.35);border-radius:10px;background:rgba(6,10,24,.8);color:#e9cc80;padding:7px 12px;cursor:pointer;box-shadow:0 0 10px rgba(233,204,128,.05);backdrop-filter:blur(10px)}' +
        '#nx-training-controls button:hover,#nx-training-controls select:hover{border-color:rgba(233,204,128,.7)}' +
        '#nx-training-controls button:focus-visible,#nx-training-controls select:focus-visible{outline:2px solid #e9cc80;outline-offset:3px}' +
        '#nx-training-controls button:disabled,#nx-training-controls select:disabled{opacity:.55;cursor:wait}' +
        '#nx-training-controls select{max-width:min(360px,100%);text-overflow:ellipsis}#nx-training-controls option{background:#060a18;color:#e9cc80}' +
        '#nx-training-controls .nx-training-restart{border-color:transparent;background:transparent;box-shadow:none;text-decoration:underline;text-underline-offset:3px}' +
        '#nx-training-controls .nx-training-title{color:#c5cbe0;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#nx-training-notice{width:100%;color:#d6d9f0}' +
        '@media(max-width:600px){#nx-training-controls{padding:7px 14px;gap:6px}#nx-training-controls select{flex:1 1 100%;width:100%;max-width:100%}#nx-training-controls .nx-training-title{flex:1 1 100%;max-width:100%}}'
      document.head.appendChild(style)
    }
    bar = document.createElement('div'); bar.id = 'nx-training-controls'; bar.setAttribute('role','group'); bar.setAttribute('aria-label','Ma formation'); bar.hidden = true
    var title = document.createElement('span'); title.className = 'nx-training-title'; title.id = 'nx-training-title'; bar.appendChild(title)
    var select = document.createElement('select'); select.id = 'nx-training-select'; select.setAttribute('aria-label','Choisir ma formation'); select.addEventListener('change',function(){nxTrainingChoice = select.value;nxTrainingRender()}); bar.appendChild(select)
    var primary = document.createElement('button'); primary.type = 'button'; primary.id = 'nx-training-primary'; primary.addEventListener('click',function(){nxTrainingRun(false)}); bar.appendChild(primary)
    var restart = document.createElement('button'); restart.type = 'button'; restart.id = 'nx-training-restart'; restart.className = 'nx-training-restart'; restart.textContent = 'Recommencer'; restart.addEventListener('click',function(){nxTrainingRun(true)}); bar.appendChild(restart)
    var notice = document.createElement('span'); notice.id = 'nx-training-notice'; notice.setAttribute('role','status'); notice.setAttribute('aria-live','polite'); notice.hidden = true; bar.appendChild(notice)
    composer.parentNode.insertBefore(bar,composer)
    var send = document.getElementById('btn-send')
    if (send && typeof MutationObserver !== 'undefined') new MutationObserver(nxTrainingRender).observe(send,{attributes:true,attributeFilter:['disabled']})
    return bar
  }
  function nxTrainingRender() {
    var bar = nxTrainingElements(); if (!bar) return
    bar.hidden = !nxTrainingRows.length
    document.body.classList.toggle('nx-training-ready',!!nxTrainingRows.length)
    if (!nxTrainingRows.length) return
    var row = nxTrainingRows.find(function(f){return String(f.id) === nxTrainingChoice}); if (!row) return
    var selected = nxTrainingSelected(), same = selected && String(selected.id) === String(row.id)
    var busy = nxTrainingPending || nxTrainingAdapter.busy() || !!(document.getElementById('btn-send') || {}).disabled
    var select = document.getElementById('nx-training-select'), title = document.getElementById('nx-training-title')
    var signature = JSON.stringify(nxTrainingRows.map(function(f){return [String(f.id),f.titre || f.title || 'Formation']}))
    if (select.dataset.rows !== signature) {
      select.textContent = ''
      nxTrainingRows.forEach(function(f){var option = document.createElement('option'); option.value = String(f.id); option.textContent = f.titre || f.title || 'Formation'; select.appendChild(option)})
      select.dataset.rows = signature
    }
    select.value = nxTrainingChoice; select.hidden = nxTrainingRows.length < 2; select.disabled = busy
    title.textContent = row.titre || row.title || ''; title.title = title.textContent; title.hidden = nxTrainingRows.length > 1 || !title.textContent
    var primary = document.getElementById('nx-training-primary'), restart = document.getElementById('nx-training-restart')
    primary.textContent = same || row.status !== 'completed' && row.hasProgress ? 'Continuer ma formation' : row.status === 'completed' ? 'Recommencer ma formation' : 'Commencer ma formation'
    primary.disabled = busy
    restart.hidden = row.status === 'completed' && !same || !same && !row.hasProgress
    restart.disabled = busy
    bar.setAttribute('aria-busy',busy ? 'true' : 'false')
  }
  function nxTrainingRun(restart) {
    if (nxTrainingPending || nxTrainingAdapter.busy() || (document.getElementById('btn-send') || {}).disabled) return Promise.resolve(false)
    var row = nxTrainingRows.find(function(f){return String(f.id) === nxTrainingChoice}); if (!row) return Promise.resolve(false)
    var selected = nxTrainingSelected(), same = selected && String(selected.id) === String(row.id)
    var notice = document.getElementById('nx-training-notice'); if (notice) {notice.hidden = true;notice.textContent = ''}
    nxTrainingPending = true; nxTrainingRender()
    return Promise.resolve().then(function(){return nxTrainingAdapter.open(row,same,!!restart || row.status === 'completed' && !same)})
      .then(function(ok){if(ok === false) throw new Error('load');return true})
      .catch(function(){if(notice){notice.textContent = 'La formation n’a pas pu se charger. Réessaie avec le bouton.';notice.hidden = false}return false})
      .finally(function(){nxTrainingPending = false;nxTrainingRender()})
  }
  var nxTrainingOriginalRefresh = nxFlowRefresh
  nxFlowRefresh = function() {
    return Promise.resolve(nxTrainingOriginalRefresh.apply(this,arguments)).then(function(data){nxTrainingUpdate(nxFlowList);return data})
  }
  // Les boutons restent accessibles pendant les réponses et après la fin d’un cours.
  document.addEventListener('click',function(){Promise.resolve().then(nxTrainingRender)})

  function nxFlowStyle(button) {
    button.style.cssText='display:inline-block;align-self:flex-start;width:auto;max-width:100%;margin-top:10px;padding:8px 14px;border:1px solid rgba(233,204,128,.4);border-radius:10px;background:rgba(6,10,24,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#e9cc80;font:inherit;font-weight:400;line-height:1.4;cursor:pointer;box-shadow:0 0 10px rgba(233,204,128,.06)'
  }
  function nxFlowRemember() {try{if(nxFlowSelected)sessionStorage.setItem(CHAT_STORAGE_KEY+'_flow',JSON.stringify(nxFlowSelected));else sessionStorage.removeItem(CHAT_STORAGE_KEY+'_flow')}catch(_){}}
  function nxFlowWrap() {var wrap=document.getElementById('formation-launch-wrap');if(wrap)wrap.style.display=(document.querySelector('.nx-uniform-next,.nx-live-formation-trigger')?'none':(nxFlowSelected||nxFlowList.some(function(f){return f.status!=='locked'&&f.status!=='completed'}))?'block':'none')}
  function nxFlowStep(host) {
    document.querySelectorAll('.nx-uniform-next,.nx-live-formation-trigger').forEach(function(b){b.remove()})
    if(!nxFlowSelected||!host){nxFlowWrap();return}
    var b=document.createElement('button');b.type='button';b.className='nx-uniform-next';b.textContent=nxFlowResume?'Reprendre ma formation':nxFlowSelected.mode==='review'?'Continuer la révision':'Continuer la formation';nxFlowStyle(b);b.disabled=nxFlowBusy;b.onclick=function(){nxFlowRequest(nxFlowSelected.id,!nxFlowResume,nxFlowSelected.mode)};host.appendChild(b);nxFlowWrap()
  }
  function nxFlowLastHost() {var box=document.getElementById('chat-messages-'+_currentAgent),rows=box&&box.querySelectorAll('.msg.bot');return rows&&rows.length?(rows[rows.length-1].lastElementChild||rows[rows.length-1]):null}
  function nxFlowCall(body) {return fetch('/api/personnage/formation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({token:sessionToken,agent:_currentAgent},body))}).then(function(r){return r.json().then(function(d){if(!r.ok)throw new Error(d.error||'Formation indisponible.');return d})})}
  function nxFlowRefresh() {
    if(!sessionToken)return Promise.resolve()
    return nxFlowCall({action:'list'}).then(function(d){nxFlowList=d.formations||[];var btn=document.getElementById('formation-launch-btn')||document.getElementById('formation-launch');
      if(!btn&&nxFlowList.some(function(f){return f.status!=='locked'&&f.status!=='completed'})){var composer=document.getElementById('chat-input');var wrap=document.createElement('div');wrap.id='formation-launch-wrap';wrap.style.cssText='padding:8px 24px;flex-shrink:0';btn=document.createElement('button');btn.id='formation-launch';btn.type='button';wrap.appendChild(btn);var messages=document.getElementById('chat-messages-'+_currentAgent);if(messages&&messages.parentNode)messages.parentNode.insertBefore(wrap,messages.nextSibling)}
      if(btn){var current=nxFlowSelected||nxFlowList.find(function(f){return f.status!=='locked'&&f.status!=='completed'});btn.textContent=nxFlowSelected||current&&current.hasProgress?'Reprendre ma formation':'Commencer ma formation';nxFlowStyle(btn);btn.onclick=function(){nxFlowLaunch()};btn.disabled=nxFlowBusy}
      nxFlowWrap();return d
    }).catch(function(){})
  }
  function nxFlowRequest(id,advance,mode,restart) {
    if(nxFlowBusy)return Promise.resolve(false)
    nxFlowBusy=true;document.querySelectorAll('.nx-uniform-next,#formation-launch-btn,#formation-launch').forEach(function(b){b.disabled=true})
    return nxFlowCall({action:restart?'restart':advance?'advance':'open',formationId:id,mode:mode||''}).then(function(d){
      nxFlowResume=false;nxFlowSelected=(d.formationDone||d.reviewDone)?null:{id:d.formationId||id,mode:d.review?'review':mode||'follow'};nxFlowRemember()
      if(d.content){addBotMessage(d.content);if(typeof currentHistory==='function')currentHistory().push({role:'assistant',content:d.content});else if(typeof chatHistories!=='undefined'&&chatHistories[_currentAgent])chatHistories[_currentAgent].push({role:'assistant',content:d.content});if(typeof saveChatToStorage==='function')saveChatToStorage()}
      if(!nxFlowSelected)document.querySelectorAll('.nx-uniform-next').forEach(function(b){b.remove()})
      try{window.parent.postMessage({type:'nyxia_formation_progress_changed'},location.origin)}catch(_){}
      return true
    }).catch(function(){nxFlowSelected={id:id,mode:mode||'follow'};nxFlowRemember();nxFlowResume=true;var host=nxFlowLastHost();if(nxFlowSelected)nxFlowStep(host);return false}).finally(function(){nxFlowBusy=false;document.querySelectorAll('.nx-uniform-next,#formation-launch-btn,#formation-launch').forEach(function(b){b.disabled=false});nxFlowRefresh()})
  }
  function nxFlowLaunch() {
    if(nxFlowSelected)return nxFlowRequest(nxFlowSelected.id,!nxFlowResume,nxFlowSelected.mode)
    var f=nxFlowList.find(function(f){return f.status!=='locked'&&f.status!=='completed'});
    if(f)return nxFlowRequest(f.id,false,f.status==='completed'?'review':'follow')
    return nxFlowRefresh().then(function(){var f=nxFlowList.find(function(f){return f.status!=='locked'});if(f)return nxFlowRequest(f.id,false,'follow')})
  }
  function nxFlowConsumeOpen(data) {
    if(!nxFlowReady||!data||data.agent!==_currentAgent||!data.formationId)return
    if(data.requestId&&data.requestId===nxFlowLastOpen)return
    if(data.requestId)nxFlowLastOpen=data.requestId
    try{sessionStorage.removeItem('nyxia:formation:open:'+_currentAgent)}catch(_){}
    nxFlowRequest(String(data.formationId),false,data.status==='completed'||data.mode==='review'?'review':'follow')
  }
  function nxFlowInit() {
    nxFlowReady=true
    try{nxFlowSelected=JSON.parse(sessionStorage.getItem(CHAT_STORAGE_KEY+'_flow')||'null')}catch(_){}
    if(nxFlowSelected){nxFlowResume=true;nxFlowStep(nxFlowLastHost())}
    var pending=null;try{pending=JSON.parse(sessionStorage.getItem('nyxia:formation:open:'+_currentAgent)||'null')}catch(_){}
    if(!pending){var params=new URLSearchParams(location.search);if(params.get('formationId'))pending={agent:_currentAgent,formationId:params.get('formationId')}}
    if(pending)nxFlowConsumeOpen(pending)
    nxFlowRefresh()
  }
  window.addEventListener('message',function(e){if(e.source!==window.parent||e.origin!==location.origin||!e.data)return;if(e.data.agent!==_currentAgent)return;if(['nyxia_open_formation','nyxia_formation_open'].indexOf(e.data.type)<0)return;e.stopImmediatePropagation();try{sessionStorage.setItem('nyxia:formation:open:'+_currentAgent,JSON.stringify(e.data))}catch(_){};nxFlowConsumeOpen(e.data)},true)

  var nxRenderingStored = false
  var nxLiveSending = false
  var nxLiveProfile = null
  var nxLivePendingPhrase = ''
  var nxLiveRefreshPromise = null
  function nxLiveNormalize(value) { return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim() }
  function nxLiveRefresh() {
    if (!sessionToken || typeof _currentAgent === 'undefined') return Promise.resolve(null)
    if (nxLiveRefreshPromise) return nxLiveRefreshPromise
    return nxLiveRefreshPromise = fetch('/api/personnage/live?token='+encodeURIComponent(sessionToken)+'&agent='+encodeURIComponent(_currentAgent),{cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error();return r.json()})
      .then(function(data){var p=data.profile;if(!p)return null;nxLiveProfile=p
        if(typeof ALPHA_INFO!=='undefined'&&ALPHA_INFO[_currentAgent])Object.assign(ALPHA_INFO[_currentAgent],p)
        if(typeof AGENT_IMAGES!=='undefined'&&Object.prototype.hasOwnProperty.call(p,'image'))AGENT_IMAGES[_currentAgent]=p.image
        if(typeof AGENT_WELCOME_VIDEO!=='undefined'&&Object.prototype.hasOwnProperty.call(p,'welcomeVideo'))AGENT_WELCOME_VIDEO[_currentAgent]=p.welcomeVideo
        if(typeof AGENT_SUGGESTIONS!=='undefined'&&Array.isArray(p.suggestions))AGENT_SUGGESTIONS[_currentAgent]=p.suggestions
        if(typeof PORTAL_AGENT!=='undefined')PORTAL_AGENT=Object.assign({},PORTAL_AGENT||{},p)
        var name=document.getElementById('chat-header-name'),sub=document.getElementById('chat-header-sub')
        if(name&&Object.prototype.hasOwnProperty.call(p,'name'))name.textContent=p.name
        if(sub&&Object.prototype.hasOwnProperty.call(p,'sub'))sub.textContent=p.sub
        if(typeof updateHeaderAvatar==='function')updateHeaderAvatar(_currentAgent)
        if(typeof renderAgentSuggestions==='function')renderAgentSuggestions()
        else if(Array.isArray(p.suggestions)){
          var suggestions=document.getElementById('suggestions')
          if(suggestions){suggestions.innerHTML='';p.suggestions.slice(0,4).forEach(function(item){var button=document.createElement('button');button.type='button';button.className='sug-chip';button.textContent=typeof item==='string'?item:String(item.label||item.message||'');button.onclick=function(){if(typeof useSuggestion==='function')useSuggestion(button);else sendMessageText(typeof item==='string'?item:(item.message||item.label||''),false,{})};suggestions.appendChild(button)})}
        }

        var greeting=document.querySelector('[data-welcome-text="1"] .msg-bubble')
        if(greeting&&Object.prototype.hasOwnProperty.call(p,'greeting'))greeting.innerHTML=cleanMarkdown(escHtml(typeof nxPersonalizeText==='function'?nxPersonalizeText(p.greeting):p.greeting)).replace(/\n/g,'<br>')
        return p
      }).catch(function(){return null}).finally(function(){nxLiveRefreshPromise=null})
  }

  function nxNamedFormation(text, list) {
    var clean=function(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
    var n=clean(text)
    if(!/\b(?:formation|cours)\b/.test(n)||! /\b(?:veux|voudrais|souhaite|aimerais|faire|refaire|revoir|recommencer|reprendre|commencer|demarrer|debuter|lancer)\b/.test(n))return null
    if(/\b(?:ne veux pas|veux pas|ne souhaite pas|souhaite pas)\b/.test(n))return null
    var stop=['formation','formations','cours','de','du','des','la','le','les','a','au','aux','en','et','un','une','vivante']
    var matches=(list||[]).map(function(f){var words=clean(f.titre).split(' ').filter(function(w){return w&&stop.indexOf(w)<0});var score=words.length&&words.every(function(w){return (' '+n+' ').indexOf(' '+w+' ')>=0})?words.join(' ').length:0;return {formation:f,score:score}}).filter(function(x){return x.score}).sort(function(a,b){return b.score-a.score})
    if(!matches.length||matches[1]&&matches[1].score===matches[0].score)return null
    return {formation:matches[0].formation,restart:/\b(?:refaire|revoir|recommencer)\b/.test(n)}
  }
  function nxTryNamedFormation(text,options) {
    if(options&&options.intent==='card-reading'||typeof _currentAttachment!=='undefined'&&_currentAttachment)return Promise.resolve(false)
    if(!/\b(?:formation|cours)\b/i.test(String(text||'')))return Promise.resolve(false)
    return nxFlowCall({action:'list'}).then(function(data){
      var match=nxNamedFormation(text,data.formations||[])
      if(!match)return false
      if(match.formation.status==='locked'){addBotMessage('Cette formation n’est pas encore débloquée.');return true}
      addUserMessage(text)
      chatHistories[_currentAgent].push({role:'user',content:text})
      saveChatToStorage()
      nxLivePendingPhrase=''
      return nxFlowRequest(match.formation.id,false,match.restart||match.formation.status==='completed'?'review':'follow',match.restart||match.formation.status==='completed').then(function(){return true})
    }).catch(function(){return false})
  }

  function sendMessageText(text, fromVoice, options) {
    if(nxFlowBusy)return
    if (nxLiveSending) return
    nxLiveSending = true
    if (document.getElementById('btn-send') && document.getElementById('btn-send').disabled) {nxLiveSending=false;return}
    nxLivePendingPhrase=text
    return nxLiveRefresh().then(function(){return nxTryNamedFormation(text,options)}).then(function(handled){nxLiveSending=false;if(!handled)return nxSendMessageTextOriginal(text,fromVoice,options)}).finally(function(){nxLiveSending=false})
  }
  function nxLiveOffer(host,text) {
    if(nxFlowSelected||nxFlowBusy)return
    if(nxRenderingStored)return
    var phrase=nxLivePendingPhrase;nxLivePendingPhrase=''
    if(!nxLiveProfile||!host)return
    var haystack=' '+nxLiveNormalize(phrase+' '+text)+' '
    var t=(nxLiveProfile.formationTriggers||[]).find(function(t){return t.active!==false&&(t.phrases||[]).some(function(p){var n=nxLiveNormalize(p);return n&&haystack.indexOf(' '+n+' ')!==-1})})
    if(!t)return
    document.querySelectorAll('.nx-live-formation-trigger').forEach(function(b){b.remove()})
    var b=document.createElement('button');b.type='button';b.className='nx-live-formation-trigger';b.textContent=t.label||'Commencer la formation'
    b.style.cssText='align-self:flex-start;width:auto;max-width:100%;margin-top:8px;padding:8px 14px;border:1px solid rgba(233,204,128,.4);border-radius:10px;background:rgba(6,10,24,.72);backdrop-filter:blur(10px);color:#e9cc80;font:inherit;font-weight:400;cursor:pointer'
    b.onclick=function(){if(nxFlowBusy)return;nxFlowRequest(t.key.split(':').slice(3).join(':'),false,'follow')}
    host.appendChild(b)
    var wrap=document.getElementById('formation-launch-wrap');if(wrap)wrap.style.display='none'
  }
  window.addEventListener('focus',function(){nxLiveRefresh()})
  setTimeout(function(){nxLiveRefresh()},0)

  function nxSendMessageTextOriginal(text, fromVoice, options) {
    _inputWasVoice = !!fromVoice
    var attachmentToSend = _currentAttachment ? JSON.parse(JSON.stringify(_currentAttachment)) : null
    var displayText = text
    if (attachmentToSend) { displayText = text ? text + '\n📎 ' + attachmentToSend.name : '📎 ' + attachmentToSend.name }
    addUserMessage(displayText)
    var historyContent = text
    if (attachmentToSend) { historyContent = (text ? text + '\n' : '') + '[Fichier joint: ' + attachmentToSend.name + ' (' + attachmentToSend.type + ')]' }
    currentHistory().push({ role: 'user', content: historyContent })
    saveChatToStorage()
    if (_currentAttachment) {
      _currentAttachment = null
      var bar = document.getElementById('attach-bar'), fi = document.getElementById('chat-file')
      if (bar) bar.style.display = 'none'; if (fi) fi.value = ''
    }
    var btn = document.getElementById('btn-send')
    var requestAgent = _currentAgent
    var opts = options || {}
    var requestedImagePrompt = ''
    if (!attachmentToSend) requestedImagePrompt = String(opts.imagePrompt || (opts.forceImage ? String(text || '').replace(/^Créer une image\s*:\s*/i, '').trim() : detectImagePrompt(text)) || '').trim()
    btn.disabled = true
    addTyping()
    if (requestedImagePrompt) {
      requestImageGeneration(requestedImagePrompt, requestAgent, btn)
      return
    }
    fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistories[requestAgent].slice(-10), userName: clientName, agent: requestAgent, attachment: attachmentToSend, token: sessionToken })
    })
    .then(function(r){ return r.json() })
    .then(function(data) {
      removeTyping()
      var reply = data.content || 'Erreur inattendue — réessaie dans un instant 💜'
      addBotMessage(reply)
      chatHistories[requestAgent].push({ role: 'assistant', content: reply })
      saveChatToStorage()
      if (chatHistories[requestAgent].length > 20) chatHistories[requestAgent] = chatHistories[requestAgent].slice(-20)
      if (_inputWasVoice) {
        var msgsEl = document.getElementById('chat-messages-' + requestAgent)
        var lastBotMsg = msgsEl ? msgsEl.querySelector('.msg.bot:last-child') : null
        if (lastBotMsg) {
          var speakBtn = Array.prototype.find.call(lastBotMsg.querySelectorAll('button'), function(b) { return b.textContent.indexOf('Écouter') !== -1 })
          if (speakBtn) speakBtn.click()
        }
      }
      _inputWasVoice = false
      btn.disabled = false
    })
    .catch(function(){ removeTyping(); addBotMessage('Petite interruption... réessaie dans un instant 💜'); btn.disabled = false })
  }

  function safeLivingVideoUrl(rawUrl) {
    try {
      var parsed = new URL(String(rawUrl || '').trim(), window.location.href)
      return parsed.protocol === 'https:' ? parsed.href : ''
    } catch (e) { return '' }
  }

  function livingVideoEmbedUrl(rawUrl) {
    try {
      var parsed = new URL(rawUrl)
      var host = parsed.hostname.toLowerCase().replace(/^www\./, '')
      var videoId = ''

      if (host === 'youtu.be') videoId = parsed.pathname.split('/').filter(Boolean)[0] || ''
      if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
        videoId = parsed.searchParams.get('v') || ''
        if (!videoId) {
          var youtubeParts = parsed.pathname.split('/').filter(Boolean)
          if (youtubeParts[0] === 'embed' || youtubeParts[0] === 'shorts') videoId = youtubeParts[1] || ''
        }
      }
      if (/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
        return 'https://www.youtube-nocookie.com/embed/' + videoId
      }

      if (host === 'vimeo.com' || host === 'player.vimeo.com') {
        var vimeoMatch = parsed.pathname.match(/(?:video\/)?(\d+)/)
        if (vimeoMatch) return 'https://player.vimeo.com/video/' + vimeoMatch[1]
      }

      if (host === 'iframe.videodelivery.net') return parsed.href
      if (host === 'watch.cloudflarestream.com') {
        var streamId = parsed.pathname.split('/').filter(Boolean)[0] || ''
        if (/^[A-Za-z0-9_-]+$/.test(streamId)) return 'https://iframe.videodelivery.net/' + streamId
      }
      if (host === 'drive.google.com') {
        var driveMatch = parsed.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/)
        var driveId2 = driveMatch ? driveMatch[1] : (parsed.searchParams.get('id') || '')
        if (driveId2) return 'https://drive.google.com/file/d/' + driveId2 + '/preview'
      }
    } catch (e) {}
    return ''
  }

  function appendLivingVideo(wrapper, videoUrl) {
    var card = document.createElement('div')
    card.style.cssText = 'width:min(100%,560px);margin-top:6px;padding:10px;border-radius:16px;border:1px solid rgba(123,92,255,0.22);background:linear-gradient(145deg,rgba(123,92,255,0.09),rgba(255,255,255,0.025));box-shadow:0 12px 30px rgba(20,12,48,0.16)'

    var label = document.createElement('div')
    label.textContent = '🎬 Formation vivante'
    label.style.cssText = 'font-size:12px;font-weight:700;color:#c4b5fd;letter-spacing:.02em;margin:1px 2px 9px'
    card.appendChild(label)

    var frame = document.createElement('div')
    frame.style.cssText = 'position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:11px;background:#070713'
    var embedUrl = livingVideoEmbedUrl(videoUrl)

    if (embedUrl) {
      var iframe = document.createElement('iframe')
      iframe.src = embedUrl
      iframe.title = 'Vidéo de formation'
      iframe.loading = 'lazy'
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      iframe.allowFullscreen = true
      iframe.referrerPolicy = 'strict-origin-when-cross-origin'
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0'
      frame.appendChild(iframe)
    } else {
      var video = document.createElement('video')
      video.src = videoUrl
      video.controls = true
      video.playsInline = true
      video.preload = 'metadata'
      video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#070713'
      frame.appendChild(video)
    }

    card.appendChild(frame)
    wrapper.appendChild(card)
  }

  function foDriveId(u){ try{ var p=new URL(u); if(p.hostname.replace(/^www\./,'')!=='drive.google.com') return ''; var m=p.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/); return m?m[1]:(p.searchParams.get('id')||''); }catch(e){ return ''; } }

  function appendAudio(wrapper, url) {
    var gid = foDriveId(url)
    var card = document.createElement('div'); card.style.cssText = 'width:min(100%,520px);margin-top:6px'
    if (gid) {
      var ifr = document.createElement('iframe'); ifr.src = 'https://drive.google.com/file/d/' + gid + '/preview'; ifr.allow = 'autoplay'
      ifr.style.cssText = 'width:100%;height:120px;border:0;border-radius:12px;background:#0f1c3f'; card.appendChild(ifr)
    } else {
      var au = document.createElement('audio'); au.src = url; au.controls = true; au.preload = 'metadata'
      au.style.cssText = 'width:100%;display:block'; card.appendChild(au)
    }
    wrapper.appendChild(card)
  }

  function appendPhoto(wrapper, url) {
    var img = document.createElement('img'); img.src = url; img.alt = 'Image'
    img.style.cssText = 'width:min(100%,520px);border-radius:12px;display:block;margin-top:6px'
    img.onerror = function(){ img.style.display = 'none' }
    wrapper.appendChild(img)
  }


  function safeExternalUrl(raw) {
    var value = String(raw || '').trim()
    if (!value) return ''
    if (/^data:image\//i.test(value)) return value
    try {
      var u = new URL(value, window.location.href)
      return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : ''
    } catch (_) { return '' }
  }

  function extractResourceLinks(text) {
    var links = []
    var cleaned = String(text || '')

    cleaned = cleaned.replace(/\[(LINK|PDF)\s*:\s*([^\]|]+)(?:\|([^\]]+))?\]/gi, function(_, kind, url, label) {
      var safe = safeExternalUrl(url)
      if (safe) {
        var nice = String(label || '').trim()
        if (!nice) nice = String(kind || '').toUpperCase() === 'PDF' ? 'Ouvrir le PDF' : 'Ouvrir'
        links.push({ url: safe, label: nice })
      }
      return ''
    })

    cleaned = cleaned.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, function(_, label, url) {
      var safe = safeExternalUrl(url)
      if (safe) links.push({ url: safe, label: String(label || 'Ouvrir').trim() || 'Ouvrir' })
      return ''
    })

    cleaned = cleaned.replace(/\b(https?:\/\/[^\s<]+\.pdf)\b/gi, function(_, url) {
      var safe = safeExternalUrl(url)
      if (safe) links.push({ url: safe, label: 'Ouvrir le PDF' })
      return ''
    })

    return { text: cleaned.trim(), links: links }
  }

  function appendGlassLink(wrapper, item) {
    if (!item || !item.url) return
    var a = document.createElement('a')
    a.href = item.url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.className = 'nx-glass-link'
    a.innerHTML = '<span class="nx-glass-link-icon">✦</span><span>' + escHtml(item.label || 'Ouvrir la ressource') + '</span><span class="nx-glass-link-arrow">↗</span>'
    wrapper.appendChild(a)
  }

  function addBotMessage(text) {
    text = nxPersonalizeText(text)
    var parsedLinks = extractResourceLinks(text)
    text = parsedLinks.text
    var msgAgent = _currentAgent
    var msgs = document.getElementById('chat-messages-' + msgAgent)
    var div = document.createElement('div'); div.className = 'msg bot'
    div.style.cssText = 'display:flex;gap:10px;align-items:flex-start'
    var wrapper = document.createElement('div'); wrapper.style.cssText = 'display:flex;flex-direction:column;gap:4px;max-width:100%;flex:1'

    var imageUrlRegex = /\[IMAGE_URL\s*:\s*([^\]|]+)(?:\|([^\]]+))?\]/i
    var imageUrlMatch = text.match(imageUrlRegex)
    var imgRegex = /\[IMAGE\s*:\s*([\s\S]*?)\]/i
    var imgMatch = text.match(imgRegex)
    var parchRegex = /\[(?:PROMPT|PARCHEMIN)\]([\s\S]*?)\[\/(?:PROMPT|PARCHEMIN)\]/i
    var parchMatch = text.match(parchRegex)
    var parchImgRegex = /\[(?:PROMPT|PARCHEMIN)_IMAGE\s*:\s*([\s\S]*?)\]/i
    var parchImgMatch = text.match(parchImgRegex)
    var videoRegex = /\[VIDEO\s*:\s*([^\]\r\n]+)\]/i
    var videoMatch = text.match(videoRegex)
    var audioRegex = /\[AUDIO\s*:\s*([^\]\r\n]+)\]/i
    var audioMatch = text.match(audioRegex)
    var photoRegex = /\[PHOTO\s*:\s*([^\]\r\n]+)\]/i
    var photoMatch = text.match(photoRegex)
    var textWithoutImg = text.replace(imageUrlRegex, '').replace(imgRegex, '').replace(parchRegex, '').replace(parchImgRegex, '').replace(videoRegex, '').replace(audioRegex, '').replace(photoRegex, '').trim()
    var imageUrl = imageUrlMatch ? safeExternalUrl(imageUrlMatch[1]) : ''
    var imageAlt = imageUrlMatch && imageUrlMatch[2] ? imageUrlMatch[2].trim() : ''
    var imgDesc = imgMatch ? imgMatch[1].trim() : null
    var parchContent = parchMatch ? parchMatch[1].trim() : null
    var parchImgUrl = parchImgMatch ? parchImgMatch[1].trim() : null
    var videoUrl = videoMatch ? safeLivingVideoUrl(videoMatch[1]) : ''

    var bubble = document.createElement('div'); bubble.className = 'msg-bubble'
    if (textWithoutImg) {
      bubble.innerHTML = cleanMarkdown(escHtml(textWithoutImg)).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
    } else if (!imageUrl && !imgDesc && !parchContent && !videoMatch && !audioMatch && !photoMatch) {
      bubble.innerHTML = cleanMarkdown(escHtml(text)).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
    } else {
      bubble.style.display = 'none'
    }
    wrapper.appendChild(bubble)

    if (imageUrl) appendDirectImage(wrapper, imageUrl, imageAlt || textWithoutImg || 'Image générée')
    if (videoUrl) appendLivingVideo(wrapper, videoUrl)
    if (audioMatch) { var _auU = safeLivingVideoUrl(audioMatch[1]); if (_auU) appendAudio(wrapper, _auU) }
    if (photoMatch) { var _phU = safeLivingVideoUrl(photoMatch[1]); if (_phU) appendPhoto(wrapper, _phU) }

    if (parchContent) {
      var parchWrap = document.createElement('div')
      parchWrap.style.cssText = 'background:rgba(123,92,255,0.06);border:1px solid rgba(123,92,255,0.18);border-radius:14px;padding:16px;margin-top:4px;max-width:460px'

      if (parchImgUrl) {
        var parchImgEl = document.createElement('img')
        parchImgEl.src = parchImgUrl
        parchImgEl.alt = 'Image du prompt'
        parchImgEl.style.cssText = 'width:100%;border-radius:10px;display:block;margin-bottom:12px;max-height:320px;object-fit:cover'
        parchImgEl.onerror = function() { parchImgEl.style.display = 'none' }
        parchWrap.appendChild(parchImgEl)
      }

      var parchText = document.createElement('div')
      parchText.style.cssText = 'font-size:13.5px;line-height:1.7;white-space:pre-wrap;color:var(--t2)'
      parchText.textContent = parchContent
      parchWrap.appendChild(parchText)

      var parchBtnRow = document.createElement('div')
      parchBtnRow.style.cssText = 'display:flex;gap:8px;margin-top:12px'

      var copyBtn = document.createElement('button')
      copyBtn.textContent = '📋 Copier le prompt'
      copyBtn.style.cssText = 'flex:1;padding:9px;border-radius:9px;border:1px solid rgba(123,92,255,0.3);background:rgba(123,92,255,0.1);color:var(--t2);font-family:Outfit,sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s'
      copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(parchContent).then(function() {
          copyBtn.textContent = '✅ Copié !'
          setTimeout(function() { copyBtn.textContent = '📋 Copier le prompt' }, 2500)
        }).catch(function() { copyBtn.textContent = '⚠️ Sélectionne le texte manuellement' })
      })
      parchBtnRow.appendChild(copyBtn)

      if (parchImgUrl) {
        var dlBtn = document.createElement('a')
        dlBtn.textContent = '⬇ Télécharger l\'image'
        dlBtn.href = parchImgUrl
        dlBtn.target = '_blank'
        dlBtn.rel = 'noopener'
        dlBtn.download = 'prompt.jpg'
        dlBtn.style.cssText = 'flex:1;padding:9px;border-radius:9px;border:1px solid rgba(123,92,255,0.3);background:rgba(123,92,255,0.1);color:var(--t2);font-family:Outfit,sans-serif;font-size:13px;font-weight:600;cursor:pointer;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center'
        parchBtnRow.appendChild(dlBtn)
      }

      parchWrap.appendChild(parchBtnRow)
      wrapper.appendChild(parchWrap)
    }

    if (imgDesc) {
      var imgWrap = document.createElement('div'); imgWrap.className = 'msg-img-wrap'
      var loader = document.createElement('div'); loader.className = 'msg-img-loader'
      loader.innerHTML = '<div class="msg-img-spinner"></div>🎨 Génération en cours...'
      imgWrap.appendChild(loader); wrapper.appendChild(imgWrap)

      var cleanDesc = imgDesc.replace(/\n/g, ' ').substring(0, 300).trim()
      var seed = Math.floor(Math.random() * 999999)
      var primaryUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(cleanDesc + ', high quality, detailed, coherent composition') + '?width=768&height=768&model=flux&seed=' + seed + '&private=true'

      var img = document.createElement('img'); img.alt = cleanDesc; img.crossOrigin = 'anonymous'
      var hasRetried = false

      img.onload = function() {
        loader.remove()
        imgWrap.style.background = 'none'; imgWrap.style.border = 'none'
        imgWrap.appendChild(img)
        requestAnimationFrame(function() { img.classList.add('loaded') })
        msgs.scrollTop = msgs.scrollHeight
      }

      img.onerror = function() {
        if (!hasRetried) {
          hasRetried = true
          var fallbackUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(cleanDesc.substring(0, 100)) + '?width=768&height=768&seed=' + seed + '&private=true'
          img.src = fallbackUrl
        } else {
          loader.innerHTML = '⚠️ Erreur de génération — réessaie'
        }
      }
      img.src = primaryUrl
    }

    var bs = 'padding:2px 9px;border-radius:50px;border:1px solid rgba(123,92,255,0.15);background:rgba(123,92,255,0.04);color:var(--t4);font-family:Outfit,sans-serif;font-size:11px;cursor:pointer;transition:all .15s'
    parsedLinks.links.forEach(function(item) { appendGlassLink(wrapper, item) })

    var acts = document.createElement('div'); acts.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-top:2px'
    var textForSpeak = textWithoutImg || (videoUrl ? '' : text)
    var exportText = textWithoutImg || (videoUrl ? 'Formation vidéo' : text)
    if (videoUrl) exportText += '\n\nVidéo : ' + videoUrl
    var agentName = (ALPHA_INFO[msgAgent] && ALPHA_INFO[msgAgent].name) || 'NyXia'

    var spk = document.createElement('button'); spk.style.cssText = bs; spk.textContent = '🔊 Écouter'
    spk.addEventListener('click', function() { speakMsg(spk, textForSpeak) }); acts.appendChild(spk)

    var cpy = document.createElement('button'); cpy.style.cssText = bs; cpy.textContent = '📋 Copier'
    cpy.addEventListener('click', function() { navigator.clipboard.writeText(exportText).then(function() { cpy.textContent = '✓'; setTimeout(function() { cpy.textContent = '📋 Copier' }, 2000) }) }); acts.appendChild(cpy)

    var ret = document.createElement('button'); ret.style.cssText = bs; ret.textContent = '↺ Réessayer'
    ret.addEventListener('click', function() {
      var hist = chatHistories[msgAgent]
      var last = hist.filter(function(m) { return m.role === 'user' }).pop()
      if (last) {
        if (hist[hist.length - 1].role === 'assistant') hist.pop()
        div.remove()
        sendMessageText(last.content, false)
      }
    }); acts.appendChild(ret)

    var pdfBtn = document.createElement('button'); pdfBtn.style.cssText = bs; pdfBtn.textContent = '⬇ PDF'
    pdfBtn.addEventListener('click', function() {
      var w = window.open('', '_blank'); if (!w) return
      var body = '<h2 style="color:#7B5CFF">' + agentName + ' — NyXia</h2>' + escHtml(exportText).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
      w.document.write('<!DOCTYPE html><html><head><title>' + agentName + ' — NyXia</title></head><body>' + body + '</body></html>')
      w.document.close(); setTimeout(function() { w.print() }, 300)
    }); acts.appendChild(pdfBtn)

    nxLiveOffer(wrapper,text)
    if(nxFlowSelected&&!nxRenderingStored)nxFlowStep(wrapper)
    wrapper.appendChild(acts)
    div.innerHTML = avatarHtmlFor(msgAgent)
    div.appendChild(wrapper)
    msgs.appendChild(div); nxFlowWrap(); msgs.scrollTop = msgs.scrollHeight
  }

  function addUserMessage(text) {
    var msgs = currentMsgsEl()
    var div = document.createElement('div'); div.className = 'msg user'
    var initial = (clientName || 'T').charAt(0).toUpperCase()
    div.innerHTML = '<div class="msg-bubble">' + escHtml(text) + '</div><div class="msg-avatar" style="background:linear-gradient(135deg,#7B5CFF,#5A6CFF);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:13px;border-radius:50%;width:32px;height:32px;flex-shrink:0">' + initial + '</div>'
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight
  }

  function addTyping() {
    var msgs = currentMsgsEl()
    var div = document.createElement('div'); div.className = 'msg bot'; div.id = 'typing-indicator'
    div.style.cssText = 'display:flex;gap:10px;align-items:flex-start'
    div.innerHTML = avatarHtmlFor(_currentAgent) + '<div class="msg-bubble"><span class="nx-dots"><i></i><i></i><i></i></span></div>'
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight
  }

  function removeTyping() { var t = document.getElementById('typing-indicator'); if (t) t.remove() }

  function stopSpeakBtn(btn) {
    btn._nxSpeaking = false; btn.textContent = '🔊 Écouter'; btn.style.borderColor = 'rgba(123,92,255,0.15)'; btn.style.color = 'var(--t4)'; btn.style.background = 'rgba(123,92,255,0.04)'
    if (btn._nxAudio) { btn._nxAudio.pause(); btn._nxAudio = null } if (btn._nxAudioUrl) { try { URL.revokeObjectURL(btn._nxAudioUrl) } catch (_) {} btn._nxAudioUrl = null }
  }

  function speakMsg(btn, text) {
    if (btn._nxSpeaking) { window.speechSynthesis && window.speechSynthesis.cancel(); stopSpeakBtn(btn); return }
    window.speechSynthesis && window.speechSynthesis.cancel()
    document.querySelectorAll('.msg button').forEach(function(b) { if (b._nxSpeaking) stopSpeakBtn(b) })
    speakViaServer(btn, text, _currentAgent)
  }

  function speakViaServer(btn, text, agentKey) {
    var clean = cleanForSpeech(text)
    if (!clean) return
    btn._nxSpeaking = true
    btn.textContent = '⏳ Un instant...'
    btn.style.borderColor = 'rgba(0,230,118,0.4)'
    btn.style.color = '#00E676'
    btn.style.background = 'rgba(0,230,118,0.08)'

    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: sessionToken, text: clean, agent: agentKey })
    })
    .then(async function(r) {
      if (!r.ok) {
        var data = await r.json().catch(function(){ return {} })
        throw new Error(data.error || ('Voix indisponible (' + r.status + ')'))
      }
      return r.blob()
    })
    .then(function(blob) {
      var url = URL.createObjectURL(blob)
      var audio = new Audio(url)
      btn._nxAudio = audio
      btn._nxAudioUrl = url
      btn.textContent = '⏹ Arrêter'
      audio.play().catch(function(err){ throw err })
      audio.onended = audio.onerror = function() {
        try { URL.revokeObjectURL(url) } catch (_) {}
        stopSpeakBtn(btn)
      }
    })
    .catch(function(err) {
      console.error('🔊 Voix (' + agentKey + ') : ' + err.message)
      btn.title = err.message
      btn.textContent = '⚠️ Voix indisponible'
      setTimeout(function(){ stopSpeakBtn(btn) }, 2500)
    })
  }

  var _msgAccueil = null
  function jouerMessageAccueil() {
    var btn = document.getElementById('btn-speak')
    if (_msgAccueil && !_msgAccueil.paused) {
      _msgAccueil.pause(); _msgAccueil.currentTime = 0
      btn.textContent = '🔊 Message d\'accueil'; btn.classList.remove('speaking')
      return
    }
    var src = AGENT_WELCOME_AUDIO[_currentAgent]
    if (!src) {
      btn.textContent = '⚠️ Audio non configuré'
      setTimeout(function(){ btn.textContent = '🔊 Message d\'accueil' }, 2000)
      return
    }
    _msgAccueil = new Audio(src)
    _msgAccueil.play()
    btn.textContent = '⏸ Arrêter'; btn.classList.add('speaking')
    _msgAccueil.onended = function() { btn.textContent = '🔊 Message d\'accueil'; btn.classList.remove('speaking') }
    _msgAccueil.onerror = function() { btn.textContent = '🔊 Message d\'accueil'; btn.classList.remove('speaking') }
  }

  var _micRecognition = null, _micListening = false, _micFinalText = '', _micSendTimer = null
  var _inputWasVoice = false
  var MIC_SILENCE_MS = 3200  // pause tolérée avant envoi auto (parole lente / hésitations)

  function toggleMic() {
    var SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      alert("La reconnaissance vocale n'est pas disponible sur ce navigateur. Essaie avec Chrome ou Edge.")
      return
    }
    var btn = document.getElementById('btn-mic')
    if (_micListening) {
      if (_micSendTimer) { clearTimeout(_micSendTimer); _micSendTimer = null }
      try { if (_micRecognition) _micRecognition.stop() } catch (e) {}
      var input = document.getElementById('chat-input')
      var text = ((input && input.value) || _micFinalText || '').trim()
      resetMicBtn()
      if (text) {
        if (input) input.value = ''
        sendMessageText(text, true)
      }
      return
    }

    _micFinalText = ''
    _micRecognition = new SpeechRecognitionAPI()
    _micRecognition.lang = 'fr-FR'
    _micRecognition.continuous = true
    _micRecognition.interimResults = true
    _micRecognition.maxAlternatives = 1

    _micRecognition.onstart = function() {
      _micListening = true
      if (!btn) return
      btn.textContent = '⏹'
      btn.style.background = 'rgba(255,75,110,0.15)'
      btn.style.borderColor = 'rgba(255,75,110,0.4)'
      btn.style.color = '#ff4b6e'
      btn.title = 'Cliquer pour terminer et envoyer'
    }

    _micRecognition.onresult = function(event) {
      var interim = ''
      for (var i = event.resultIndex; i < event.results.length; i++) {
        var piece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          _micFinalText = (_micFinalText + ' ' + piece).replace(/\s+/g, ' ').trim()
        } else {
          interim += piece
        }
      }
      var input = document.getElementById('chat-input')
      if (input) {
        input.value = (_micFinalText + (interim ? ' ' + interim : '')).replace(/\s+/g, ' ').trim()
        input.style.height = 'auto'
        input.style.height = Math.min(input.scrollHeight, 120) + 'px'
      }
      if (_micSendTimer) clearTimeout(_micSendTimer)
      _micSendTimer = setTimeout(function() {
        if (!_micListening) return
        var finalText = (_micFinalText || (input && input.value) || '').trim()
        try { if (_micRecognition) _micRecognition.stop() } catch (e) {}
        resetMicBtn()
        if (finalText) {
          if (input) input.value = ''
          sendMessageText(finalText, true)
        }
      }, MIC_SILENCE_MS)
    }

    _micRecognition.onerror = function(ev) {
      if (_micSendTimer) { clearTimeout(_micSendTimer); _micSendTimer = null }
      resetMicBtn()
    }
    _micRecognition.onend = function() {
      if (_micSendTimer) return
      resetMicBtn()
    }
    try {
      _micRecognition.start()
    } catch (e) {
      resetMicBtn()
      alert('Impossible de démarrer le micro. Réessaie.')
    }
  }

  function resetMicBtn() {
    _micListening = false
    var btn = document.getElementById('btn-mic')
    if (!btn) return
    btn.textContent = '🎤'
    btn.style.background = 'rgba(123,92,255,0.06)'
    btn.style.borderColor = 'rgba(123,92,255,0.2)'
    btn.style.color = 'var(--t3)'
    btn.title = 'Parler'
  }


  function nxPersonalizeText(value) {
    var first = typeof clientName === 'string' ? clientName.trim() : ''
    return String(value == null ? '' : value).replace(/\{prenom\}/gi, function() { return first || 'toi' })
  }

  function cleanMarkdown(str) {
    return str
      .replace(/\{prenom\}/gi, function() { return escHtml(typeof clientName === 'string' && clientName.trim() ? clientName.trim() : 'toi') })
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#c4b5fd;text-decoration:underline">$1</a>')
      // Filet de sécurité : une URL brute reste cliquable si un média n'a pas été transformé en player.
      .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener" style="color:#c4b5fd;text-decoration:underline;overflow-wrap:anywhere">$2</a>')
      .replace(/&lt;(\/?)(strong|em|b|i)&gt;/gi, function(_, close, tag) { return '<' + close + (/^(strong|b)$/i.test(tag) ? 'strong' : 'em') + '>' })
      .replace(/&lt;br\s*\/?&gt;/gi, '\n')
      .replace(/&lt;\/?p&gt;/gi, '\n')
      .replace(/\*\*\*([^\n]+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^\n]+?)\*\*(?!\*)/g, '<strong>$1</strong>')
      .replace(/__([^\n]+?)__/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|[^\w])_([^_\n]+?)_(?!\w)/g, '$1<em>$2</em>')
      .replace(/^---+$/gm, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^>+\s*/gm, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
  }

  function cleanForSpeech(str) {
    return nxPersonalizeText(str)
      .replace(/__([^\n]+?)__/g, '$1')
      .replace(/(^|[^\w])_([^_\n]+?)_(?!\w)/g, '$1$2')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/---+/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/^>+\s*/gm, '')
      .replace(/\[IMAGE[\s\S]*?\]/gi, '')
      .replace(/\[(?:PROMPT|PARCHEMIN)\][\s\S]*?\[\/(?:PROMPT|PARCHEMIN)\]/gi, '')
      .replace(/\[(?:PROMPT|PARCHEMIN)_IMAGE[\s\S]*?\]/gi, '')
      .replace(/[✦💜🚀💎🌐📱⭐✓►▶🪞🌿🕯️🌙✨📖🔥👑😉📚📜]/gu, '')
      .replace(/<br>/g, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\[VIDEO\s*:\s*[^\]\r\n]+\]/gi, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
  }

  function escHtml(str) { var d = document.createElement('div'); d.textContent = str; return d.innerHTML }

  if (window.speechSynthesis) { try { window.speechSynthesis.getVoices() } catch (e) {} }
  