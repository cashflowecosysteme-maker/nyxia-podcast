if(window.top!==window)window.top.location.replace('/login.html'+window.location.search);

    /* ══════════════════════════════════
       AUTH CHECK — redirige si déjà connecté
    ══════════════════════════════════ */
    ;(function() {
      var token = sessionStorage.getItem('nyxia_token')
      if (token) {
        fetch('/api/check-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token })
        })
        .then(function(r) { return r.json() })
        .then(function(data) {
          if (data.valid) window.top.location.replace('/dashbord')
        })
        .catch(function(){})
      }
    })()

    /* ══════════════════════════════════
       LOGIN
    ══════════════════════════════════ */
    function doLogin() {
      var firstname = document.getElementById('firstname').value.trim()
      var email    = document.getElementById('email').value.trim()
      var password = document.getElementById('password').value
      var btn      = document.getElementById('btn-login')
      var spinner  = document.getElementById('spinner')
      var btnText  = document.getElementById('btn-text')
      var msgBox   = document.getElementById('msg-box')

      if (!firstname || !email || !password) {
        showMsg('Prénom, courriel et mot de passe requis.', 'error')
        return
      }

      btn.disabled    = true
      spinner.style.display = 'block'
      btnText.textContent   = 'Connexion...'
      msgBox.style.display  = 'none'

      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname: firstname, email: email, password: password })
      })
      .then(function(r) {
        return r.json().then(function(data) {
          data.__status = r.status;
          data.__ok = r.ok;
          return data;
        }).catch(function() {
          return { __status: r.status, __ok: r.ok, error: 'Réponse invalide du serveur.' };
        });
      })
      .then(function(data) {
        if (data.token && data.__ok !== false) {
          sessionStorage.setItem('nyxia_token', data.token)
          var nyxFirstName = String(data.firstname || '').trim()
          if (!nyxFirstName) {
            showMsg('Le prénom est requis pour entrer dans le portail.', 'error')
            sessionStorage.removeItem('nyxia_token')
            btn.disabled = false
            spinner.style.display = 'none'
            btnText.textContent = 'Se connecter'
            return
          }
          sessionStorage.setItem('nyxia_firstname', nyxFirstName)
          localStorage.setItem('nyxia_user_context', JSON.stringify({ firstname: nyxFirstName, email: email }))
          localStorage.removeItem('nyxia_username')
          showMsg('✓ Connexion réussie ! Redirection...', 'success')
          setTimeout(function() {
            window.top.location.replace('/dashbord')
          }, 1000)
        } else {
          showMsg(data.error || ('Identifiants incorrects. Code : ' + (data.__status || 'inconnu')), 'error')
          btn.disabled = false
          spinner.style.display = 'none'
          btnText.textContent   = 'Se connecter'
        }
      })
      .catch(function(err) {
        showMsg('Erreur de connexion : impossible de joindre le Worker Cloudflare. Vérifie le déploiement et le domaine.', 'error')
        btn.disabled = false
        spinner.style.display = 'none'
        btnText.textContent   = 'Se connecter'
      })
    }

    function showMsg(text, type) {
      var box = document.getElementById('msg-box')
      box.textContent    = text
      box.className      = 'msg-box ' + type
      box.style.display  = 'block'
    }

    function togglePw() {
      var input = document.getElementById('password')
      input.type = input.type === 'password' ? 'text' : 'password'
    }

    /* Enter = login */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin()
    })
  