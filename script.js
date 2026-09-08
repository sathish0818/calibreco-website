(function () {
  'use strict';

  var root = document.documentElement;

  // Release the first-paint transition lock once styles have settled.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.removeAttribute('theme-init'); });
  });

  /* ---------- Theme toggle ---------- */

  var toggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var dark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  applyTheme(root.getAttribute('data-theme') || 'light');

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('calibreco-theme', next); } catch (e) {}
  });

  // Follow the OS only while the visitor hasn't picked a theme themselves.
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (e) {
    var saved = null;
    try { saved = localStorage.getItem('calibreco-theme'); } catch (err) {}
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  };
  if (media.addEventListener) media.addEventListener('change', onSchemeChange);
  else if (media.addListener) media.addListener(onSchemeChange);

  /* ---------- Mobile navigation ---------- */

  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menu-toggle');

  function closeNav() {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }

  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeNav();
  });

  /* ---------- Header hairline on scroll ---------- */

  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ============================================================
     Service booking
     ============================================================ */

  // Dispatch desk WhatsApp number, digits only, country code first.
  var WHATSAPP = '919600794700';
  var MAILTO = 'calibreco25@gmail.com';

  // Indicative weekly availability per service, Monday to Friday.
  // 'open' or 'booked' — edit these to match the dispatch calendar.
  var AVAILABILITY = {
    '3D Laser Scanning':            ['open', 'open', 'booked', 'open', 'open'],
    'Laser Tracker Inspection':     ['open', 'open', 'open', 'booked', 'open'],
    'Portable CMM Arm':             ['open', 'booked', 'open', 'open', 'open'],
    'GD&T & Reverse Engineering':   ['open', 'open', 'open', 'open', 'booked']
  };
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  var modal = document.getElementById('booking-modal');
  var form = document.getElementById('booking-form');
  var done = document.getElementById('booking-done');
  var serviceOut = document.getElementById('modal-service');
  var summaryOut = document.getElementById('done-summary');
  var dateInput = document.getElementById('bk-date');
  var lastFocused = null;
  var currentService = '';

  /* ---------- Availability chips ---------- */

  [].forEach.call(document.querySelectorAll('.week'), function (list) {
    var states = AVAILABILITY[list.dataset.week] || [];
    list.innerHTML = DAYS.map(function (day, i) {
      var booked = states[i] === 'booked';
      return '<li class="' + (booked ? 'is-booked' : '') + '">' +
             '<span class="day">' + day + '</span>' +
             '<span class="state">' + (booked ? 'Booked' : 'Open') + '</span>' +
             '</li>';
    }).join('');
  });

  /* ---------- Helpers ---------- */

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function isoDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // Next working day, skipping Saturday and Sunday.
  function nextWorkingDay() {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    return d;
  }

  function prettyDate(iso) {
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  function setError(name, message) {
    var msg = form.querySelector('[data-err="' + name + '"]');
    var field = form.querySelector('[name="' + name + '"]');
    if (msg) msg.textContent = message || '';
    if (field) field.closest('.field').classList.toggle('is-bad', !!message);
    if (field) {
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }
  }

  function clearErrors() {
    ['date', 'location', 'name', 'phone', 'email', 'company'].forEach(function (n) {
      setError(n, '');
    });
  }

  /* ---------- Open / close ---------- */

  function openModal(service) {
    currentService = service;
    serviceOut.textContent = service;
    clearErrors();
    form.hidden = false;
    done.hidden = true;

    dateInput.min = isoDate(new Date());
    if (!dateInput.value) dateInput.value = isoDate(nextWorkingDay());

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-locked');
    closeNav();

    // Land on the first field rather than the close button.
    var first = form.querySelector('input, select, textarea');
    if (first) first.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  [].forEach.call(document.querySelectorAll('.svc-book'), function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.svc');
      openModal(card ? card.dataset.service : 'Metrology service');
    });
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;

    // Keep focus inside the dialog while it is open.
    var focusables = modal.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea'
    );
    var visible = [].filter.call(focusables, function (el) {
      return el.offsetParent !== null;
    });
    if (!visible.length) return;

    var first = visible[0];
    var last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* ---------- Validation ---------- */

  function validate(data) {
    var ok = true;
    clearErrors();

    if (!data.date) {
      setError('date', 'Pick a date.'); ok = false;
    } else if (data.date < isoDate(new Date())) {
      setError('date', 'Pick today or a later date.'); ok = false;
    }
    if (!data.location) { setError('location', 'Where is the job?'); ok = false; }
    if (!data.name) { setError('name', 'Tell us who to ask for.'); ok = false; }

    var digits = data.phone.replace(/\D/g, '');
    if (!data.phone) { setError('phone', 'A number we can reach you on.'); ok = false; }
    else if (digits.length < 10) { setError('phone', 'That looks too short.'); ok = false; }

    if (!data.email) { setError('email', 'Where should we send the quote?'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      setError('email', 'Check that email address.'); ok = false;
    }
    if (!data.company) { setError('company', 'Company name, please.'); ok = false; }

    if (!ok) {
      var bad = form.querySelector('.field.is-bad input, .field.is-bad select');
      if (bad) bad.focus();
    }
    return ok;
  }

  /* ---------- Submit ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Read through form.elements: HTMLFormElement already owns .name, and
    // Element already owns .slot, so form.name / form.slot are not the inputs.
    var f = form.elements;
    var data = {
      date: dateInput.value,
      slot: f.slot.value,
      duration: f.duration.value,
      location: f.location.value.trim(),
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      email: f.email.value.trim(),
      company: f.company.value.trim(),
      notes: f.notes.value.trim()
    };

    if (!validate(data)) return;

    var rows = [
      ['Service', currentService],
      ['Date', prettyDate(data.date) + ' · ' + data.slot],
      ['Duration', data.duration],
      ['Location', data.location],
      ['Contact', data.name + ' · ' + data.company],
      ['Reach on', data.phone]
    ];

    summaryOut.innerHTML = rows.map(function (r) {
      return '<div><dt>' + escapeHtml(r[0]) + '</dt><dd>' + escapeHtml(r[1]) + '</dd></div>';
    }).join('');

    var lines = [
      'NEW CALIBRECO SERVICE ORDER',
      '',
      'Service: ' + currentService,
      'Date: ' + data.date + ' (' + data.slot + ')',
      'Duration: ' + data.duration,
      'Location: ' + data.location,
      '',
      'Contact: ' + data.name,
      'Company: ' + data.company,
      'Phone: ' + data.phone,
      'Email: ' + data.email
    ];
    if (data.notes) lines.push('', 'Notes: ' + data.notes);
    var message = lines.join('\n');

    var waLink = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message);
    var mailLink = 'mailto:' + MAILTO +
      '?subject=' + encodeURIComponent('Service booking — ' + currentService) +
      '&body=' + encodeURIComponent(message);

    document.getElementById('done-whatsapp').href = waLink;
    document.getElementById('done-email').href = mailLink;

    form.hidden = true;
    done.hidden = false;
    done.scrollTop = 0;

    // Opened from the submit click, so this is a trusted user gesture.
    window.open(waLink, '_blank', 'noopener');

    var first = done.querySelector('a, button');
    if (first) first.focus();
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* ---------- Footer year ---------- */

  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
