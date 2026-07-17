(function () {
  if (window.__dbPageTransition) return;
  window.__dbPageTransition = true;

  var ORANGE = '#E4531F';
  var DARK = '#121311';

  // ---- styles ----
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes dbpt-spin{to{transform:rotate(360deg)}}',
    '@keyframes dbpt-fill{0%{width:4%}55%{width:72%}100%{width:100%}}',
    '@keyframes dbpt-blink{0%,100%{opacity:1}50%{opacity:.25}}',
    '@keyframes dbpt-stripe{to{background-position:-56px 0}}',
    '#dbpt{position:fixed;inset:0;z-index:99999;background:' + DARK + ';',
    '  transform:translateY(100%);will-change:transform;pointer-events:none;',
    '  display:flex;align-items:center;justify-content:center;',
    '  transition:transform .5s cubic-bezier(.7,0,.2,1);}',
    '#dbpt.dbpt-cover{transform:translateY(0)}',
    '#dbpt.dbpt-lift{transform:translateY(-100%)}',
    '#dbpt .dbpt-tape{position:absolute;left:0;right:0;height:14px;',
    '  background-image:repeating-linear-gradient(45deg,' + ORANGE + ' 0,' + ORANGE + ' 14px,' + DARK + ' 14px,' + DARK + ' 28px);',
    '  background-size:56px 56px;animation:dbpt-stripe 1s linear infinite;opacity:.9}',
    '#dbpt .dbpt-tape.top{top:0}#dbpt .dbpt-tape.bot{bottom:0}',
    '#dbpt .dbpt-core{display:flex;flex-direction:column;align-items:center;gap:26px;',
    '  opacity:0;transform:translateY(10px);transition:opacity .3s ease,transform .3s ease;font-family:Archivo,sans-serif}',
    '#dbpt.dbpt-cover .dbpt-core{opacity:1;transform:none}',
    '#dbpt .dbpt-blade{width:66px;height:66px;border-radius:50%;',
    '  background:conic-gradient(' + ORANGE + ' 0 12deg,transparent 12deg 30deg,' + ORANGE + ' 30deg 42deg,transparent 42deg 60deg,' + ORANGE + ' 60deg 72deg,transparent 72deg 90deg,' + ORANGE + ' 90deg 102deg,transparent 102deg 120deg,' + ORANGE + ' 120deg 132deg,transparent 132deg 150deg,' + ORANGE + ' 150deg 162deg,transparent 162deg 180deg,' + ORANGE + ' 180deg 192deg,transparent 192deg 210deg,' + ORANGE + ' 210deg 222deg,transparent 222deg 240deg,' + ORANGE + ' 240deg 252deg,transparent 252deg 270deg,' + ORANGE + ' 270deg 282deg,transparent 282deg 300deg,' + ORANGE + ' 300deg 312deg,transparent 312deg 330deg,' + ORANGE + ' 330deg 342deg,transparent 342deg 360deg);',
    '  -webkit-mask:radial-gradient(circle,transparent 20px,#000 21px,#000 27px,transparent 28px);',
    '  mask:radial-gradient(circle,transparent 20px,#000 21px,#000 27px,transparent 28px);',
    '  animation:dbpt-spin .9s linear infinite;position:relative}',
    '#dbpt .dbpt-hub{position:absolute;inset:0;margin:auto;width:16px;height:16px;border-radius:50%;background:#F4F4F0}',
    '#dbpt .dbpt-word{font-weight:900;font-size:20px;letter-spacing:.18em;text-transform:uppercase;color:#F4F4F0}',
    '#dbpt .dbpt-word b{color:' + ORANGE + ';font-weight:900}',
    '#dbpt .dbpt-ruler{width:300px;height:26px;position:relative;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.04);overflow:hidden}',
    '#dbpt .dbpt-ticks{position:absolute;inset:0;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.28) 0,rgba(255,255,255,.28) 1px,transparent 1px,transparent 20px);}',
    '#dbpt .dbpt-bar{position:absolute;left:0;top:0;bottom:0;width:4%;background:' + ORANGE + ';}',
    '#dbpt.dbpt-cover .dbpt-bar{animation:dbpt-fill 1.15s cubic-bezier(.5,0,.2,1) forwards}',
    '#dbpt .dbpt-label{font-weight:700;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#9aa09a;animation:dbpt-blink 1.1s ease-in-out infinite}'
  ].join('');
  document.head.appendChild(css);

  // ---- overlay ----
  var ov = document.createElement('div');
  ov.id = 'dbpt';
  ov.innerHTML =
    '<div class="dbpt-tape top"></div>' +
    '<div class="dbpt-core">' +
      '<div class="dbpt-blade"><span class="dbpt-hub"></span></div>' +
      '<div class="dbpt-word">D<b>&amp;</b>B Trim Carpentry</div>' +
      '<div class="dbpt-ruler"><div class="dbpt-ticks"></div><div class="dbpt-bar"></div></div>' +
      '<div class="dbpt-label">Building your page</div>' +
    '</div>' +
    '<div class="dbpt-tape bot"></div>';
  var mount = function () { document.body.appendChild(ov); };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // ---- entrance: panel starts covering, then lifts away to reveal ----
  function playEnter() {
    ov.classList.add('dbpt-cover');
    // next frame -> lift up and off
    requestAnimationFrame(function () {
      setTimeout(function () {
        ov.classList.remove('dbpt-cover');
        ov.classList.add('dbpt-lift');
      }, 60);
    });
  }
  // On load the panel should already appear covering (no upward slide-in), then lift.
  ov.style.transition = 'none';
  ov.classList.add('dbpt-cover');
  requestAnimationFrame(function () {
    ov.style.transition = '';
    setTimeout(function () {
      ov.classList.remove('dbpt-cover');
      ov.classList.add('dbpt-lift');
    }, 520);
  });
  // pageshow handles browser back/forward cache
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      ov.classList.remove('dbpt-cover');
      ov.classList.add('dbpt-lift');
    }
  });

  // ---- exit: intercept internal links ----
  function isInternal(a) {
    if (!a) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|https?:|\/\/)/i.test(href)) return false;
    if (a.target && a.target !== '_self') return false;
    return /\.dc\.html(\?|#|$)/i.test(href) || /\.html(\?|#|$)/i.test(href);
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a || !isInternal(a)) return;
    var href = a.getAttribute('href');
    // same page (only hash differs) -> let browser handle
    try {
      var dest = new URL(href, window.location.href);
      if (dest.pathname === window.location.pathname && dest.hash) return;
    } catch (err) {}
    e.preventDefault();
    ov.classList.remove('dbpt-lift');
    // force reflow so transition from lifted/hidden -> cover animates from bottom
    ov.style.transform = 'translateY(100%)';
    void ov.offsetWidth;
    ov.classList.add('dbpt-cover');
    ov.style.transform = '';
    setTimeout(function () { window.location.href = href; }, 780);
  }, true);
})();