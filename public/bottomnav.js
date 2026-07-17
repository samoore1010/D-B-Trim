(function () {
  if (window.__dbBottomNav) return;
  window.__dbBottomNav = true;

  var ORANGE = '#E4531F';
  var HOME = 'DandB%20Homepage.dc.html';

  // Feather-style stroke icons (24x24, currentColor).
  var ICONS = {
    services: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.9 6.9a2.12 2.12 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    projects: '<path d="M3 21h18"/><path d="M5 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16"/><path d="M13 9h5a1 1 0 0 1 1 1v11"/><path d="M8 8h1M8 12h1M8 16h1"/>',
    about: '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    careers: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    contact: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 7l-10 6L2 7"/>'
  };

  // Tabs (order left -> right). The home/logo button is inserted in the middle,
  // giving a balanced 2 + logo + 2 layout. Careers stays in the top nav/footer.
  var TABS = [
    { key: 'services', label: 'Services', href: 'Services.dc.html', match: ['services'] },
    { key: 'projects', label: 'Projects', href: 'Projects.dc.html', match: ['projects'] },
    { key: 'about', label: 'About', href: 'About.dc.html', match: ['about'] },
    { key: 'contact', label: 'Contact', href: 'Contact.dc.html', match: ['contact'] }
  ];

  function currentKey() {
    var path = '';
    try { path = decodeURIComponent(location.pathname || ''); } catch (e) { path = location.pathname || ''; }
    var base = path.split('/').pop().toLowerCase();
    if (base === '' || base.indexOf('dandb homepage') === 0) return 'home';
    for (var i = 0; i < TABS.length; i++) {
      if (TABS[i].match.some(function (m) { return base.indexOf(m) === 0; })) return TABS[i].key;
    }
    return '';
  }

  // ---- styles ----
  var css = document.createElement('style');
  css.textContent = [
    '#dbbn{position:fixed;left:0;right:0;bottom:0;z-index:9000;display:none;',
    '  align-items:stretch;background:rgba(13,14,12,0.96);',
    '  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);',
    '  border-top:1px solid rgba(255,255,255,0.12);',
    '  padding-bottom:env(safe-area-inset-bottom,0);font-family:Archivo,sans-serif;}',
    '#dbbn a,#dbbn button{flex:1 1 0;min-width:0;background:none;border:0;cursor:pointer;',
    '  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;',
    '  padding:9px 2px 8px;color:#9aa09a;text-decoration:none;font-family:inherit;}',
    '#dbbn a.active{color:' + ORANGE + ';}',
    '#dbbn svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;',
    '  stroke-linecap:round;stroke-linejoin:round;display:block;}',
    '#dbbn .lbl{font-size:9.5px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;',
    '  line-height:1;white-space:nowrap;}',
    '#dbbn .dbbn-home{flex:0 0 auto;padding:0 12px;}',
    '#dbbn .dbbn-home .disc{width:46px;height:46px;border-radius:50%;background:' + ORANGE + ';',
    '  display:flex;align-items:center;justify-content:center;margin-top:-16px;',
    '  box-shadow:0 4px 14px rgba(0,0,0,0.4);border:3px solid #0d0e0c;}',
    '#dbbn .dbbn-home .disc img{width:30px;height:30px;object-fit:contain;display:block;}',
    '#dbbn .dbbn-home .lbl{margin-top:3px;color:#C9CCC7;}',
    '@media (max-width:640px){#dbbn{display:flex;} body{padding-bottom:70px !important;}}'
  ].join('');
  document.head.appendChild(css);

  // ---- build ----
  var active = currentKey();

  function tab(t) {
    return '<a href="' + t.href + '" class="' + (active === t.key ? 'active' : '') + '" aria-label="' + t.label + '">' +
      '<svg viewBox="0 0 24 24">' + ICONS[t.key] + '</svg>' +
      '<span class="lbl">' + t.label + '</span></a>';
  }

  var onHome = active === 'home';
  var homeInner =
    '<span class="disc"><img src="assets/logo-mark-light.png" alt="D&amp;B Trim Carpentry — home"></span>' +
    '<span class="lbl">Home</span>';
  var homeEl = onHome
    ? '<button class="dbbn-home" id="dbbn-home" aria-label="Back to top">' + homeInner + '</button>'
    : '<a class="dbbn-home" href="' + HOME + '" aria-label="Home">' + homeInner + '</a>';

  // logo sits in the middle of the tab row
  var left = TABS.slice(0, 2).map(tab).join('');
  var right = TABS.slice(2).map(tab).join('');

  var bar = document.createElement('nav');
  bar.id = 'dbbn';
  bar.setAttribute('aria-label', 'Primary');
  bar.innerHTML = left + homeEl + right;

  var mount = function () {
    document.body.appendChild(bar);
    if (onHome) {
      var btn = document.getElementById('dbbn-home');
      if (btn) btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
