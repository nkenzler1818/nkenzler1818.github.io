// Projects page: interactive pieces inside the case-study modals.
// Phase stepper, the "bridge" direction flip, screenshot lightbox,
// the site-history slider and the sample SQL console. No dependencies.
(function () {
    'use strict';

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function onReady(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    /* Phase stepper (tabs) */
    function initSteps(root) {
        var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
        function select(tab, focus) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute('aria-selected', on ? 'true' : 'false');
                t.tabIndex = on ? 0 : -1;
                var panel = document.getElementById(t.getAttribute('aria-controls'));
                if (panel) panel.hidden = !on;
            });
            if (focus) tab.focus();
        }
        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { select(tab, false); });
            tab.addEventListener('keydown', function (e) {
                var next = null;
                if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
                if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
                if (next) { e.preventDefault(); select(next, true); }
            });
        });
    }

    /* Bridge: flip which side is "said" and which is "built" */
    function initBridge(root) {
        var btn = root.querySelector('.case-bridge-flip');
        if (!btn) return;
        var from = root.querySelector('[data-from]');
        var to = root.querySelector('[data-to]');
        btn.addEventListener('click', function () {
            var flipped = btn.getAttribute('aria-pressed') !== 'true';
            btn.setAttribute('aria-pressed', flipped ? 'true' : 'false');
            root.classList.toggle('is-flipped', flipped);
            from.textContent = flipped ? 'Engineering says' : 'Leadership says';
            to.textContent = flipped ? 'Leadership hears' : 'Engineering builds';
        });
    }

    /* Screenshot lightbox (reuses the .post-lightbox styles) */
    function initLightbox() {
        var box = document.querySelector('.post-lightbox');
        if (!box) return;
        var img = box.querySelector('img');
        var cap = box.querySelector('figcaption');
        var lastTrigger = null;
        function close() {
            if (box.classList.contains('hidden')) return false;
            box.classList.add('hidden');
            if (lastTrigger) lastTrigger.focus();
            return true;
        }
        document.addEventListener('click', function (e) {
            var shot = e.target.closest('.case-shot');
            if (!shot) return;
            e.stopPropagation();
            lastTrigger = shot;
            img.src = shot.getAttribute('data-full');
            img.alt = shot.querySelector('img').alt;
            cap.textContent = shot.getAttribute('data-caption') || '';
            box.classList.remove('hidden');
            box.querySelector('.post-lightbox-close').focus();
        });
        box.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target === box || e.target.closest('.post-lightbox-close')) close();
        });
        // Capture phase so Escape closes the screenshot before the modal underneath
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && close()) e.stopImmediatePropagation();
        }, true);
    }

    /* Site history slider */
    function initHistory(root) {
        var range = root.querySelector('.site-history-range');
        var imgs = Array.prototype.slice.call(root.querySelectorAll('.site-history-frame img'));
        var ticks = Array.prototype.slice.call(root.querySelectorAll('.site-history-ticks li'));
        function show(i) {
            imgs.forEach(function (im) { im.classList.toggle('is-on', +im.getAttribute('data-i') === i); });
            ticks.forEach(function (t) { t.classList.toggle('is-on', +t.getAttribute('data-i') === i); });
            var label = ticks[i] ? ticks[i].textContent.replace(/^(\w+ \d+)/, '$1: ') : '';
            range.setAttribute('aria-valuetext', label);
            imgs[i].alt = 'Screenshot of the site, ' + label;
        }
        range.addEventListener('input', function () { show(+range.value); });
        ticks.forEach(function (t) {
            t.addEventListener('click', function () { range.value = t.getAttribute('data-i'); show(+range.value); });
        });
        show(0);
    }

    /* SQL console: sample table, results computed here so they always add up */
    var campaigns = [
        { id: 1, campaign: 'Spring webinar', channel: 'Email', spend: 1200, leads: 96 },
        { id: 2, campaign: 'Conference promo', channel: 'LinkedIn', spend: 3400, leads: 140 },
        { id: 3, campaign: 'Newsletter push', channel: 'Email', spend: 450, leads: 61 },
        { id: 4, campaign: 'Search ads', channel: 'Paid search', spend: 2800, leads: 112 },
        { id: 5, campaign: 'Expert video series', channel: 'LinkedIn', spend: 1900, leads: 58 },
        { id: 6, campaign: 'Retargeting', channel: 'Paid search', spend: 900, leads: 30 }
    ];
    var events = [
        { campaign_id: 1, registrations: 74 },
        { campaign_id: 2, registrations: 121 },
        { campaign_id: 5, registrations: 38 }
    ];
    var queries = [
        {
            sql: 'SELECT channel, SUM(leads) AS total_leads\nFROM campaigns\nGROUP BY channel\nORDER BY total_leads DESC;',
            run: function () {
                var by = {};
                campaigns.forEach(function (c) { by[c.channel] = (by[c.channel] || 0) + c.leads; });
                var rows = Object.keys(by).map(function (k) { return [k, by[k]]; });
                rows.sort(function (a, b) { return b[1] - a[1]; });
                return { cols: ['channel', 'total_leads'], rows: rows };
            }
        },
        {
            sql: 'SELECT campaign,\n       ROUND(spend * 1.0 / leads, 2) AS cost_per_lead\nFROM campaigns\nWHERE leads > 0\nORDER BY cost_per_lead\nLIMIT 3;',
            run: function () {
                var rows = campaigns.filter(function (c) { return c.leads > 0; })
                    .map(function (c) { return [c.campaign, Math.round(c.spend / c.leads * 100) / 100]; });
                rows.sort(function (a, b) { return a[1] - b[1]; });
                return { cols: ['campaign', 'cost_per_lead'], rows: rows.slice(0, 3).map(function (r) { return [r[0], '$' + r[1].toFixed(2)]; }) };
            }
        },
        {
            sql: 'SELECT c.campaign, e.registrations\nFROM campaigns c\nJOIN events e ON e.campaign_id = c.id\nWHERE e.registrations > 50;',
            run: function () {
                var rows = [];
                events.forEach(function (e) {
                    if (e.registrations <= 50) return;
                    var c = campaigns.filter(function (x) { return x.id === e.campaign_id; })[0];
                    if (c) rows.push([c.campaign, e.registrations]);
                });
                return { cols: ['campaign', 'registrations'], rows: rows };
            }
        }
    ];

    function escapeHtml(s) {
        return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; });
    }
    var KEYWORDS = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|DESC|LIMIT|JOIN|ON|AS|SUM|ROUND)\b/g;
    function highlight(sql) {
        return escapeHtml(sql).replace(KEYWORDS, '<span class="kw">$1</span>');
    }

    function initSql(root) {
        var code = root.querySelector('.sql-console-code code');
        var out = root.querySelector('.sql-console-out');
        var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-q]'));
        var timer = null;
        function render(q) {
            var res = q.run();
            var html = '<table><thead><tr>' + res.cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
                res.rows.map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + escapeHtml(v) + '</td>'; }).join('') + '</tr>'; }).join('') +
                '</tbody></table><p class="sql-console-meta">' + res.rows.length + ' row' + (res.rows.length === 1 ? '' : 's') + '</p>';
            out.innerHTML = html;
        }
        buttons.forEach(function (b) {
            b.addEventListener('click', function () {
                buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
                var q = queries[+b.getAttribute('data-q')];
                clearTimeout(timer);
                out.innerHTML = '';
                if (reduceMotion) { code.innerHTML = highlight(q.sql); render(q); return; }
                var i = 0;
                (function type() {
                    i += 2;
                    code.innerHTML = highlight(q.sql.slice(0, i));
                    if (i < q.sql.length) timer = setTimeout(type, 12);
                    else timer = setTimeout(function () { render(q); }, 180);
                })();
            });
        });
    }

    onReady(function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-steps]'), initSteps);
        Array.prototype.forEach.call(document.querySelectorAll('.case-bridge'), initBridge);
        Array.prototype.forEach.call(document.querySelectorAll('[data-site-history]'), initHistory);
        Array.prototype.forEach.call(document.querySelectorAll('[data-sql-console]'), initSql);
        initLightbox();
    });
})();
