/**
 * Alrafei CV - Linear / Stripe Dark Aesthetic Engine
 * 1. Bilingual Language Engine (Instant EN / AR toggle with localStorage persistence)
 * 2. Subtle card tilt: max ±6deg, spring-like easing, scale(1.02)
 * 3. Scroll-reveal: fade + translateY(20px) -> 0, 400ms, staggered by 80ms
 * 4. Skill rings: thin stroke 4px, animated stroke-dashoffset on entrance
 * 5. Three.js minimal geometric background (dark wireframe + gentle particles)
 * 6. Lucide Icons initialization
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Lucide Icons Initialization
     ========================================================================== */
  function initIcons() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  /* ==========================================================================
     2. Bilingual Language Switcher (EN / عربي)
     ========================================================================== */
  function setLanguage(lang) {
    var t = window.CV_TRANSLATIONS && window.CV_TRANSLATIONS[lang];
    if (!t) return;

    var html = document.documentElement;
    var body = document.body;

    html.lang = lang;
    html.dir = (lang === 'ar' ? 'rtl' : 'ltr');

    var btnEn = document.getElementById('lang-en');
    var btnAr = document.getElementById('lang-ar');

    if (lang === 'ar') {
      document.title = "الرفيع بابكر — مهندس برمجيات ومطور Full-Stack";
      body.classList.add('font-arabic');
      body.classList.remove('font-sans');
      if (btnAr) {
        btnAr.className = "px-2.5 py-1 rounded-lg transition-all font-semibold lang-btn active-lang bg-emerald-500 text-slate-950 shadow-sm";
      }
      if (btnEn) {
        btnEn.className = "px-2.5 py-1 rounded-lg transition-all font-semibold lang-btn text-slate-400 hover:text-slate-200";
      }
    } else {
      document.title = "Alrafei Babiker — Software Engineer & Full-Stack Developer";
      body.classList.add('font-sans');
      body.classList.remove('font-arabic');
      if (btnEn) {
        btnEn.className = "px-2.5 py-1 rounded-lg transition-all font-semibold lang-btn active-lang bg-emerald-500 text-slate-950 shadow-sm";
      }
      if (btnAr) {
        btnAr.className = "px-2.5 py-1 rounded-lg transition-all font-semibold lang-btn text-slate-400 hover:text-slate-200";
      }
    }

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Update all inputs with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });

    // Store in localStorage
    try {
      localStorage.setItem('cv_lang', lang);
    } catch (e) {}

    // Update form alert language if currently visible
    updateAlertLanguage(lang);

    // Re-render any dynamically affected icons
    initIcons();
  }

  function initLanguageSwitcher() {
    var btnEn = document.getElementById('lang-en');
    var btnAr = document.getElementById('lang-ar');

    if (btnEn) {
      btnEn.addEventListener('click', function () {
        setLanguage('en');
      });
    }

    if (btnAr) {
      btnAr.addEventListener('click', function () {
        setLanguage('ar');
      });
    }

    // Load saved or default language
    var savedLang = 'en';
    try {
      savedLang = localStorage.getItem('cv_lang') || 'en';
    } catch (e) {}

    setLanguage(savedLang);
  }

  /* ==========================================================================
     3. Subtle Spring-like Tilt (max ±6deg per design.md)
     ========================================================================== */
  function initTiltEngine() {
    var cards = document.querySelectorAll('.tilt-enabled');
    var maxTilt = 6; // strictly ±6 degrees per design.md

    cards.forEach(function (card) {
      var ticking = false;

      function applyTilt(clientX, clientY) {
        var rect = card.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        var x = clientX - rect.left;
        var y = clientY - rect.top;

        var offsetX = (x / rect.width) * 2 - 1;
        var offsetY = (y / rect.height) * 2 - 1;

        offsetX = Math.max(-1, Math.min(1, offsetX));
        offsetY = Math.max(-1, Math.min(1, offsetY));

        var rotX = -offsetY * maxTilt;
        var rotY = offsetX * maxTilt;

        card.style.transition = 'transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 160ms ease-out';
        card.style.transform =
          'perspective(800px) rotateX(' +
          rotX.toFixed(2) +
          'deg) rotateY(' +
          rotY.toFixed(2) +
          'deg) scale3d(1.02, 1.02, 1.02)';
      }

      function resetTilt() {
        card.style.transition = 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 200ms ease-out';
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }

      card.addEventListener('mousemove', function (e) {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            applyTilt(e.clientX, e.clientY);
            ticking = false;
          });
          ticking = true;
        }
      });

      card.addEventListener('mouseleave', resetTilt);

      // Touch events for mobile
      card.addEventListener(
        'touchstart',
        function (e) {
          if (e.touches && e.touches[0]) {
            applyTilt(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );

      card.addEventListener('touchend', resetTilt);
      card.addEventListener('touchcancel', resetTilt);
    });
  }

  /* ==========================================================================
     4. Scroll-Reveal (Staggered by 80ms per card)
     ========================================================================== */
  function initScrollReveal() {
    var cards = document.querySelectorAll('.reveal-card');

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) {
        c.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            obs.unobserve(el);

            var siblings = Array.prototype.slice.call(el.parentNode.children);
            var index = siblings.indexOf(el);
            var delay = Math.min(index * 80, 400); // 80ms stagger per design.md

            setTimeout(function () {
              el.classList.add('revealed');
            }, delay);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach(function (c) {
      observer.observe(c);
    });
  }

  /* ==========================================================================
     5. Animated Skill Rings (Thin stroke 4px, Emerald Gradient, JetBrains Mono)
     ========================================================================== */
  function initSkillRings() {
    var skillCards = document.querySelectorAll('.skill-card');
    var circumference = 226.19; // 2 * PI * 36 (radius = 36 for 80px SVG)

    // Ensure all rings start with full offset (empty circle)
    skillCards.forEach(function (card) {
      var ring = card.querySelector('.skill-ring-progress');
      var text = card.querySelector('.skill-percent-number');
      if (ring) {
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
      }
      if (text) {
        text.textContent = '0%';
      }
    });

    function animateSkill(card) {
      if (card.dataset.animated === 'true') return;
      card.dataset.animated = 'true';

      var targetPct = parseInt(card.getAttribute('data-percent') || 80, 10);
      var ring = card.querySelector('.skill-ring-progress');
      var text = card.querySelector('.skill-percent-number');

      var duration = 1800; // 1.8s smooth drawing animation
      var targetOffset = circumference - (targetPct / 100) * circumference;

      if (ring) {
        ring.style.transition = 'stroke-dashoffset ' + (duration / 1000) + 's cubic-bezier(0.16, 1, 0.3, 1)';
        requestAnimationFrame(function () {
          ring.style.strokeDashoffset = targetOffset;
        });
      }

      var startTime = null;
      function stepCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var currentVal = Math.round(ease * targetPct);

        if (text) text.textContent = currentVal + '%';

        if (progress < 1) {
          window.requestAnimationFrame(stepCounter);
        } else {
          if (text) text.textContent = targetPct + '%';
        }
      }

      window.requestAnimationFrame(stepCounter);
    }

    if (!('IntersectionObserver' in window)) {
      skillCards.forEach(function (card) {
        animateSkill(card);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var card = entry.target;
            obs.unobserve(card);
            animateSkill(card);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    skillCards.forEach(function (c) {
      observer.observe(c);
    });
  }

  /* ==========================================================================
     6. Minimalist Geometric Three.js Hero Canvas
     ========================================================================== */
  function initThreeHero() {
    if (typeof THREE === 'undefined') return;

    var canvas = document.getElementById('hero-three-canvas');
    if (!canvas) return;

    var container = canvas.parentElement;
    var width = container.clientWidth || window.innerWidth;
    var height = container.clientHeight || 550;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 22;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
    } catch (e) {
      return;
    }

    var group = new THREE.Group();
    scene.add(group);

    // Minimal dark wireframe Icosahedron with emerald stroke
    var geo = new THREE.IcosahedronGeometry(7.5, 1);
    var mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    var mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Subtle inner core
    var coreGeo = new THREE.OctahedronGeometry(4, 0);
    var coreMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    var coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Floating subtle ambient particles
    var particleCount = 45;
    var particlesGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var particleMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.2,
      transparent: true,
      opacity: 0.4
    });
    var particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    // Resize
    window.addEventListener(
      'resize',
      function () {
        var w = container.clientWidth || window.innerWidth;
        var h = container.clientHeight || 550;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      },
      { passive: true }
    );

    // Smooth subtle rotation loop
    function animate() {
      window.requestAnimationFrame(animate);
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
      coreMesh.rotation.x -= 0.0025;
      coreMesh.rotation.y -= 0.0035;
      particles.rotation.y += 0.0008;
      renderer.render(scene, camera);
    }
    animate();
  }

  /* ==========================================================================
     7. Mobile Navigation Drawer Engine
     ========================================================================== */
  function initMobileMenu() {
    var toggleBtn = document.getElementById('mobile-menu-toggle');
    var closeBtn = document.getElementById('mobile-menu-close');
    var backdrop = document.getElementById('mobile-menu-backdrop');
    var drawer = document.getElementById('mobile-menu-drawer');
    var navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer) return;

    function openMenu() {
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (drawer.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMenu();
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ==========================================================================
     8. Contact Form AJAX Submission (No Redirects)
     ========================================================================== */
  var currentFormAlertType = null;

  function updateAlertLanguage(lang) {
    if (!currentFormAlertType) return;
    var t = window.CV_TRANSLATIONS && window.CV_TRANSLATIONS[lang];
    var alertMsg = document.getElementById('contact-alert-msg');
    if (!t || !alertMsg) return;

    if (currentFormAlertType === 'success') {
      alertMsg.textContent = t.form_success || (lang === 'ar' ? 'تم إرسال رسالتك بنجاح! ✅' : 'Your message has been sent successfully! ✅');
    } else if (currentFormAlertType === 'activation') {
      alertMsg.textContent = t.form_activation || (lang === 'ar' ? '⚠️ خطوة تفعيل مطلوبة لمرة واحدة: أرسلت خدمة FormSubmit رسالة تفعيل إلى إيميلك (alrafeaalimam@gmail.com). يرجى فتح بريدك (وافحص مجلد Spam/الرسائل غير المرغوب فيها) والضغط على "Activate Form" لتفعيل استلام الرسائل فوراً.' : '⚠️ Activation Required: FormSubmit has sent a verification email to alrafeaalimam@gmail.com. Please open your Gmail (check Spam/Junk folder too) and click "Activate Form" to enable submissions.');
    } else if (currentFormAlertType === 'error') {
      alertMsg.textContent = t.form_error || (lang === 'ar' ? 'حدث خطأ أثناء الإرسال، يُرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again or reach out directly.');
    }
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    var alertBox = document.getElementById('contact-alert');
    var alertMsg = document.getElementById('contact-alert-msg');
    var alertIcon = document.getElementById('contact-alert-icon');
    var submitBtn = document.getElementById('contact-submit-btn');

    if (!form || !submitBtn) return;

    function showAlert(type, message) {
      if (!alertBox || !alertMsg) return;
      currentFormAlertType = type;

      alertBox.className = "p-4 rounded-xl border text-sm font-mono flex items-center gap-3 mb-6 transition-all duration-300";
      if (type === 'success') {
        alertBox.classList.add('bg-emerald-950/50', 'border-emerald-500/50', 'text-emerald-300');
        if (alertIcon) alertIcon.innerHTML = '<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400 shrink-0"></i>';
      } else if (type === 'activation') {
        alertBox.classList.add('bg-amber-950/50', 'border-amber-500/50', 'text-amber-300');
        if (alertIcon) alertIcon.innerHTML = '<i data-lucide="mail-check" class="w-5 h-5 text-amber-400 shrink-0"></i>';
      } else {
        alertBox.classList.add('bg-rose-950/50', 'border-rose-500/50', 'text-rose-300');
        if (alertIcon) alertIcon.innerHTML = '<i data-lucide="alert-circle" class="w-5 h-5 text-rose-400 shrink-0"></i>';
      }
      alertMsg.textContent = message;
      alertBox.classList.remove('hidden');
      initIcons();

      try {
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var currentLang = document.documentElement.lang || 'en';
      var t = (window.CV_TRANSLATIONS && window.CV_TRANSLATIONS[currentLang]) || {};

      var sendingText = (t && t.form_sending) || (currentLang === 'ar' ? 'جاري إرسال الرسالة...' : 'Sending Message...');
      var successText = (t && t.form_success) || (currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح! ✅' : 'Your message has been sent successfully! ✅');
      var activationText = (t && t.form_activation) || (currentLang === 'ar' ? '⚠️ خطوة تفعيل مطلوبة لمرة واحدة: أرسلت خدمة FormSubmit رسالة تفعيل إلى إيميلك (alrafeaalimam@gmail.com). يرجى فتح بريدك (وافحص مجلد Spam/الرسائل غير المرغوب فيها) والضغط على "Activate Form" لتفعيل استلام الرسائل فوراً.' : '⚠️ Activation Required: FormSubmit has sent a verification email to alrafeaalimam@gmail.com. Please open your Gmail (check Spam/Junk folder too) and click "Activate Form" to enable submissions.');
      var errorText = (t && t.form_error) || (currentLang === 'ar' ? 'حدث خطأ أثناء الإرسال، يُرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again or reach out directly.');

      // Hide previous alert
      if (alertBox) alertBox.classList.add('hidden');
      currentFormAlertType = null;

      // Loading state on submit button
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
      submitBtn.innerHTML = '<svg class="animate-spin inline-block w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-slate-950" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg><span>' + sendingText + '</span>';

      var formData = new FormData(form);
      var payload = {
        name: formData.get('name') || '',
        email: formData.get('_replyto') || '',
        _replyto: formData.get('_replyto') || '',
        _subject: formData.get('Subject') || 'New message from CV Portfolio',
        Subject: formData.get('Subject') || 'New message from CV Portfolio',
        message: formData.get('message') || '',
        _captcha: 'false',
        _template: 'table'
      };

      var endpoint = form.getAttribute('action') || 'https://formsubmit.co/ajax/alrafeaalimam@gmail.com';
      if (endpoint.indexOf('/ajax/') === -1) {
        endpoint = endpoint.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      }

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, status: response.status, data: data };
        }).catch(function () {
          return { ok: response.ok, status: response.status, data: null };
        });
      })
      .then(function (res) {
        var data = res.data;
        var msg = (data && data.message) ? String(data.message).toLowerCase() : '';
        var isActivation = msg.indexOf('activat') !== -1 || msg.indexOf('confirm') !== -1 || msg.indexOf('verification') !== -1;

        if (isActivation) {
          showAlert('activation', activationText);
          return;
        }

        if (!res.ok || (data && (data.success === false || data.success === 'false'))) {
          throw new Error((data && data.message) || ('HTTP error ' + res.status));
        }

        showAlert('success', successText);
        form.reset();
      })
      .catch(function (err) {
        console.error('Contact form submission error:', err);
        showAlert('error', errorText);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        var btnText = (t && t.form_send_btn) || (currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message');
        submitBtn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i><span data-i18n="form_send_btn">' + btnText + '</span>';
        initIcons();
      });
    });
  }

  /* ==========================================================================
     Bootstrap on Ready
     ========================================================================== */
  function ready() {
    initIcons();
    initLanguageSwitcher();
    initMobileMenu();
    initContactForm();
    initTiltEngine();
    initScrollReveal();
    initSkillRings();
    initThreeHero();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
