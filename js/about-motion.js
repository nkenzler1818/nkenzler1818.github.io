/* One controller: native document scroll determines every stack/timeline pose.
 * CSS owns sticky layout. No pins, snapping, wheel interception or scroll gates.
 * The semantic HTML remains the complete static/reduced-motion document. */
(() => {
  'use strict';
  const root = document.documentElement, deck = document.querySelector('.about-v5');
  if (!deck) return;
  const $ = (s, p = deck) => p.querySelector(s), $$ = (s, p = deck) => [...p.querySelectorAll(s)];
  const cards = $$('.about-card'), backs = $$('.deck-back'), skip = $('.timeline-skip');
  const navigation = $('.navigation-track'), up = $('[data-step="-1"]'), down = $('[data-step="1"]');
  const headerTrack = document.querySelector('.about-header-track');
  const stage = $('.about-stage'), list = $('.timeline'), position = $('.timeline-position');
  const rail = $('.chronology-rail'), fill = $('.chronology-fill'), footer = document.querySelector('#about-footer');
  const work = $('.work-window'), track = $('.work-track'), workItems = $$('.tile-work-card');
  const gsap = window.gsap, ST = window.ScrollTrigger;
  const mq = matchMedia('(min-width:721px) and (min-height:650px) and (prefers-reduced-motion:no-preference)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const state = {enhanced:false, conveyor:false, scene:0, event:0, progress:0, stack:0, workIndex:0, index:0};
  let events = [], trigger, resizeTimer, workTimer, workTween, hovered = false, destination = null;
  let distance = 1, journeyStart = 320, timelineStart = 460, timelineEnd = 1000, detailsStart = 1460, readingEnd = 1460;
  let cardHeights = [], step = 116, stageHeight = 687, dock = 232, lastScene = -1;
  // Every stop is committed: Who I Am, each timeline year and The Details. One scroll
  // gesture past a stop moves exactly one stop on a timer and the page settles there,
  // so no card or year can rest halfway. The Details reads freely below its stop.
  let current = 0, cardScene = 0, stackTween = null, commitTween = null, doneCall = null, lockUntil = 0, queued = null, settle = true;
  const view = {stack:0};
  const cardTime = .55, eventTime = .36, commitSlack = 8, cooldown = 200, journeyGap = 60;

  function readModel() {
    events = $$('.timeline-event', list);
    events.forEach(event => {
      const date = $('time', event);
      if (!$('.event-year', date)) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'event-year'; button.textContent = date.textContent; date.replaceChildren(button);
      }
      let compact = $('.event-compact', event);
      if (!compact) {compact = document.createElement('button'); compact.type = 'button'; compact.className = 'event-compact'; $('.event-copy', event).append(compact);}
      compact.textContent = event.dataset.proof;
      compact.removeAttribute('hidden');
      const full = $('.event-full', event); full.id = event.id + '-detail';
      [$('.event-year', event), compact].forEach(button => button.setAttribute('aria-controls', full.id));
    });
    $('[data-end-year]').textContent = events.at(-1)?.dataset.year || '2019';
  }
  const lastIndex = () => events.length + 1;
  function label(index) {
    return index === 0 ? 'Who I Am' : index === lastIndex() ? 'The Details' : 'How I Got Here, ' + events[index - 1].dataset.year;
  }
  function targetElement(index) {
    return index === 0 ? $('#ab-hero-h') : index === lastIndex() ? $('#details-heading') : $('.event-year', events[index - 1]);
  }
  function targetY(index) {
    if (!state.enhanced) return index === 0 ? 0 : targetElement(index).getBoundingClientRect().top + scrollY - 128;
    if (index === 0) return 0;
    if (index === lastIndex()) return detailsStart;
    return timelineStart + distance * (index - 1) / Math.max(1, events.length - 1);
  }
  function paintNavigation(index) {
    state.index = index;
    const focused = document.activeElement;
    up.hidden = index === 0; down.hidden = index === lastIndex();
    up.setAttribute('aria-label', 'Previous: ' + label(Math.max(0, index - 1)));
    down.setAttribute('aria-label', 'Next: ' + label(Math.min(lastIndex(), index + 1)));
    if ((focused === up && up.hidden) || (focused === down && down.hidden)) (up.hidden ? down : up).focus({preventScroll:true});
    $('.about-controls').hidden = index === 0 || index === lastIndex();
    $('.about-status').textContent = label(index);
  }
  const sceneOf = index => index === 0 ? 0 : index === lastIndex() ? 2 : 1;
  function navigate(index, smooth = true) {
    index = clamp(index, 0, lastIndex());
    if (index > 0) dismissPrompt();
    if (!state.enhanced) {
      const y = clamp(targetY(index), 0, document.documentElement.scrollHeight - innerHeight);
      // Rapid clicks advance from the requested destination, not an intermediate pose.
      destination = {index, y}; paintNavigation(index);
      window.scrollTo({top:y, behavior:smooth && !reduced.matches ? 'smooth' : 'instant'});
      render(); return;
    }
    // Presses during a move queue the next stop instead of tearing the move.
    if (doneCall) {queued = index; paintNavigation(index); return;}
    if (!smooth || reduced.matches) {
      current = index; cardScene = sceneOf(index); view.stack = cardScene; destination = null;
      window.scrollTo({top:targetY(index), behavior:'instant'}); render(); return;
    }
    go(index);
  }
  function go(index) {
    const y = clamp(targetY(index), 0, document.documentElement.scrollHeight - innerHeight);
    const scene = sceneOf(index), steps = Math.max(1, Math.abs(index - current));
    const cardMove = Math.abs(view.stack - scene) > .001;
    if (index > 0) dismissPrompt();
    current = index; cardScene = scene; destination = {index, y}; paintNavigation(index);
    stackTween?.kill(); commitTween?.kill(); doneCall?.kill();
    // Card moves take 0.55s; year to year keeps the original timeline pace (0.33s + 10%).
    const duration = cardMove ? cardTime * clamp(Math.abs(scene - view.stack), .45, 1.6) : eventTime * Math.min(2, Math.sqrt(steps));
    lockUntil = performance.now() + duration * 1000 + cooldown;
    stackTween = cardMove ? gsap.to(view, {stack:scene, duration, ease:'sine.inOut', onUpdate:paint}) : null;
    const scroller = {y:scrollY};
    commitTween = Math.abs(y - scrollY) < 1 ? null : gsap.to(scroller, {y, duration, ease:'sine.inOut',
      onUpdate:() => window.scrollTo({top:scroller.y, behavior:'instant'})});
    doneCall = gsap.delayedCall(duration, () => {
      stackTween = commitTween = doneCall = null; render();
      if (queued !== null) {const next = queued; queued = null; navigate(next);}
    });
  }
  function nearestIndex(y) {
    if (y >= detailsStart - commitSlack) return lastIndex();
    let best = 0;
    for (let i = 1; i <= lastIndex(); i++) if (Math.abs(targetY(i) - y) < Math.abs(targetY(best) - y)) best = i;
    return best;
  }
  function checkCommit(y) {
    // One gesture past the current stop commits the next stop in that direction.
    const rest = targetY(current);
    const dir = y < rest - commitSlack ? -1 : y > rest + commitSlack && current < lastIndex() ? 1 : 0;
    if (!dir) return;
    // A long jump (scrollbar, Home/End) settles on the furthest stop it passed halfway.
    let target = current + dir;
    while (target + dir >= 0 && target + dir <= lastIndex() && (dir > 0 ? y > (targetY(target) + targetY(target + dir)) / 2 : y < (targetY(target) + targetY(target + dir)) / 2)) target += dir;
    go(target);
  }
  // First load only: the arrows materialize the same way the continue label does.
  let arrowsArrived = false;
  function materializeArrows() {
    if (arrowsArrived) return;
    arrowsArrived = true;
    if (reduced.matches || !gsap) return;
    gsap.fromTo([up, down].filter(button => !button.hidden), {opacity:0, y:6, filter:'blur(4px)'},
      {opacity:1, y:0, filter:'blur(0px)', duration:.5, ease:'power2.out', stagger:.08, delay:.9, clearProps:'opacity,filter,transform'});
  }
  // After 4 seconds on Who I Am without moving on, a quiet label joins the down arrow.
  // Moving on for the first time evaporates it; it does not return during the visit.
  const prompt = $('.continue-prompt'), promptMq = matchMedia('(min-width:721px)');
  let promptTimer = null, promptState = 'idle';
  function armPrompt() {
    if (promptState !== 'idle' || promptTimer || reduced.matches || !gsap) return;
    promptTimer = setTimeout(showPrompt, 4000);
  }
  function showPrompt() {
    promptTimer = null;
    if (promptState !== 'idle' || state.index !== 0 || down.hidden || !promptMq.matches || reduced.matches) return;
    promptState = 'shown';
    if (!prompt.querySelector('.prompt-char')) {
      const words = prompt.textContent.trim().split(/\s+/);
      prompt.replaceChildren();
      words.forEach((word, i) => {
        const wrap = document.createElement('span'); wrap.className = 'prompt-word';
        [...word].forEach(ch => {const c = document.createElement('span'); c.className = 'prompt-char'; c.textContent = ch; wrap.append(c);});
        prompt.append(wrap); if (i < words.length - 1) prompt.append(' ');
      });
    }
    const chars = prompt.querySelectorAll('.prompt-char');
    gsap.set(chars, {opacity:0});
    prompt.hidden = false; prompt.classList.add('is-beside');
    // Beside the arrow when the margin allows, otherwise tucked under it on two lines.
    const room = document.documentElement.clientWidth - down.getBoundingClientRect().right - 30;
    prompt.classList.toggle('is-beside', prompt.offsetWidth <= room);
    gsap.fromTo(chars, {opacity:0, y:6, filter:'blur(4px)'}, {opacity:1, y:0, filter:'blur(0px)', duration:.5, ease:'power2.out', stagger:.025});
    gsap.fromTo(down, {y:0}, {y:5, duration:.3, ease:'sine.inOut', yoyo:true, repeat:3, delay:.2});
  }
  function dismissPrompt() {
    clearTimeout(promptTimer); promptTimer = null;
    const shown = promptState === 'shown';
    promptState = 'gone';
    if (!shown) return;
    const chars = prompt.querySelectorAll('.prompt-char');
    gsap.killTweensOf([...chars, down]); gsap.set(down, {y:0});
    if (reduced.matches) {prompt.hidden = true; return;}
    // Evaporate: each letter drifts up, swells, blurs and thins out at its own pace.
    gsap.to(chars, {opacity:0, y:() => -(16 + Math.random() * 20), x:() => Math.random() * 12 - 6, scale:() => 1.1 + Math.random() * .3,
      filter:'blur(6px)', duration:.9, ease:'power1.out', stagger:{each:.035, from:'random'}, onComplete:() => {prompt.hidden = true;}});
  }
  function activateEvent(index) {
    state.event = index;
    events.forEach((event, i) => {
      const active = i === index;
      if ((!active && $('.event-full', event).contains(document.activeElement)) || (active && $('.event-compact', event) === document.activeElement)) $('.event-year', event).focus({preventScroll:true});
      event.classList.toggle('is-active', active);
      $$('.event-year,.event-compact', event).forEach(button => button.setAttribute('aria-expanded', String(active)));
    });
  }
  function paintTimeline(progress) {
    const point = progress * (events.length - 1), index = Math.round(point), previous = state.event;
    const switching = state.event !== index || !events[index].classList.contains('is-active');
    state.progress = progress; state.point = point;
    if (!switching) {layoutTimeline(); return;}
    // Opening a year changes row heights, and each year label is centered in its row. Grow and
    // shrink the two affected rows over a short tween and re-lay out the timeline every tick,
    // so labels, nodes and the rows below move continuously instead of cutting mid-move.
    const changed = settle ? [] : [...new Set([previous, index])].filter(i => events[i]).map(i => $('.event-copy', events[i]));
    const from = changed.map(copy => copy.offsetHeight);
    activateEvent(index);
    changed.forEach((copy, k) => {
      gsap.killTweensOf(copy); copy.style.height = ''; copy.style.overflow = '';
      const to = copy.offsetHeight;
      if (Math.abs(to - from[k]) < 1) return;
      gsap.fromTo(copy, {height:from[k], overflow:'hidden'}, {height:to, duration:.32, ease:'power2.inOut', onUpdate:layoutTimeline,
        onComplete:() => {copy.style.height = ''; copy.style.overflow = ''; layoutTimeline();}});
    });
    if (!settle) {
      gsap.fromTo($('.event-full', events[index]), {opacity:0, y:6}, {opacity:1, y:0, duration:.32, ease:'power2.out', overwrite:true});
      if (previous !== index && events[previous]) gsap.fromTo($('.event-compact', events[previous]), {opacity:0}, {opacity:1, duration:.32, ease:'power2.out', overwrite:true});
    }
    layoutTimeline();
  }
  function layoutTimeline() {
    const point = state.point || 0, index = Math.round(point);
    const centers = events.map(e => e.offsetTop + e.offsetHeight / 2);
    const lower = Math.floor(point), upper = Math.min(centers.length - 1, lower + 1);
    const center = centers[lower] + (centers[upper] - centers[lower]) * (point - lower), span = Math.max(1, centers.at(-1) - centers[0]);
    // Keep the focused copy near the heading, without the previous half-card void. The focus
    // height blends the two rows either side of the point, so it stays continuous when the
    // open year switches mid-move (at rest it is exactly the open row's height).
    const focusHeight = events[lower].offsetHeight + (events[upper].offsetHeight - events[lower].offsetHeight) * (point - lower);
    const focusY = Math.max(100, focusHeight / 2 + 24) + 56 * clamp(point);
    gsap.set(position, {y:focusY - center});
    rail.style.top = centers[0] + 'px'; rail.style.height = span + 'px';
    // Fill to the interpolated node center, not linear scroll progress: events are not
    // evenly spaced (the open one is taller), so each stop ends exactly on its node.
    gsap.set(fill, {scaleY:(center - centers[0]) / span});
  }
  function stopWork() {clearTimeout(workTimer); workTimer = null; workTween?.pause();}
  function workAllowed() {
    const rect = work.getBoundingClientRect();
    return state.conveyor && state.scene === 2 && !document.hidden && !hovered && !work.contains(document.activeElement) && rect.bottom > 0 && rect.top < innerHeight;
  }
  function placeWork() {
    workItems.forEach((item, i) => gsap.set(item, {y:((i - state.workIndex + workItems.length) % workItems.length) * step}));
  }
  function scheduleWork(delay = 3000) {
    if (!workAllowed()) {stopWork(); return;}
    if (workTween && workTween.progress() < 1) {workTween.resume(); return;}
    if (!workTimer) workTimer = setTimeout(advanceWork, delay);
  }
  function advanceWork() {
    workTimer = null;
    if (!workAllowed()) return;
    // The belt runs downward: the next entry drops in from above the window.
    const n = workItems.length;
    gsap.set(workItems[(state.workIndex - 1 + n) % n], {y:-step});
    workTween = gsap.to(workItems, {y:'+=' + step, duration:.5, ease:'power2.inOut', onComplete:() => {
      state.workIndex = (state.workIndex - 1 + n) % n;
      placeWork(); workTween = null; scheduleWork(2500);
    }});
  }
  function render() {
    const y = scrollY;
    if (destination && Math.abs(y - destination.y) < 2) destination = null;
    if (!state.enhanced) {
      let index = 0;
      for (let i = 1; i <= lastIndex(); i++) if (targetElement(i).getBoundingClientRect().top <= 164) index = i;
      state.scene = index === 0 ? 0 : index === lastIndex() ? 2 : 1;
      state.event = clamp(index - 1, 0, events.length - 1); state.stack = state.scene;
      paintNavigation(destination?.index ?? index); scheduleWork(); return;
    }
    if (!settle && !doneCall) checkCommit(y);
    if (current > 0) dismissPrompt();
    paint();
  }
  function paint() {
    if (!state.enhanced) return;
    const stack = view.stack;
    state.stack = stack; state.scene = Math.round(stack);
    paintTimeline(clamp((scrollY - timelineStart) / distance));
    const floor = Math.floor(stack), fraction = stack - floor;
    cards.forEach((card, i) => {
      const incoming = i === floor + 1 && fraction > 0, front = i === floor;
      const visible = front || incoming;
      const offset = incoming ? (innerHeight - dock + 32) * (1 - fraction) : front ? -56 * fraction : 0;
      gsap.set(card, {x:0, y:offset, scale:front ? 1 - .04 * fraction : 1, visibility:visible ? 'visible' : 'hidden', zIndex:10 + i});
      card.inert = i !== state.scene;
      card.classList.toggle('is-current', i === state.scene);
    });
    deck.style.setProperty('--focused-height', cardHeights[state.scene] + 'px');
    backs.forEach((back, i) => {
      const depth = stack - i;
      back.hidden = depth < 1;
      if (!back.hidden) gsap.set(back, {x:0, y:-56 * depth, scale:1 - .04 * depth, zIndex:i + 1});
    });
    paintNavigation(queued ?? current);
    // Focus follows a completed return, but ordinary wheel reading never steals it.
    if (lastScene !== state.scene) {
      const previous = cards[lastScene];
      if (previous?.contains(document.activeElement)) $('h1,h2', cards[state.scene]).focus({preventScroll:true});
      lastScene = state.scene;
    }
    scheduleWork();
  }
  function focusYear(index, smooth = true) {
    navigate(index + 1, smooth);
  }
  function fallback() {
    stopWork(); workTween?.kill(); workTween = null; trigger?.kill(); trigger = null; destination = null;
    stackTween?.kill(); commitTween?.kill(); doneCall?.kill(); stackTween = commitTween = doneCall = null;
    queued = null; lockUntil = 0; settle = true; current = 0; cardScene = 0; view.stack = 0;
    const rows = [...events, ...$$('.event-full,.event-compact,.event-copy', list)];
    gsap?.killTweensOf([...cards, position, fill, ...backs, ...workItems, ...rows, view]);
    rows.forEach(el => el.removeAttribute('style')); state.point = 0;
    state.enhanced = false; state.conveyor = false;
    root.classList.remove('about-active', 'about-pending', 'about-conveyor');
    cards.forEach(card => {card.removeAttribute('style'); card.classList.remove('is-current'); card.inert = false;});
    events.forEach(event => {event.classList.remove('is-active'); $$('.event-year,.event-compact', event).forEach(button => button.setAttribute('aria-expanded','true'));});
    [position, rail, fill, ...backs, ...workItems, work, track].forEach(el => el.removeAttribute('style'));
    backs.forEach(back => back.hidden = true); $('.return-layer').hidden = true; $('.about-controls').hidden = true;
    footer.inert = false; footer.style.removeProperty('min-height'); deck.removeAttribute('style'); clearTimeout(window.aboutBoot?.timer);
    headerTrack.removeAttribute('style');
  }
  function setupWork() {
    if (reduced.matches || !gsap || !ST || location.search.includes('view=all') || window.aboutBoot?.expired) return;
    root.classList.add('about-conveyor');
    const itemHeight = Math.ceil(Math.max(...workItems.map(item => item.offsetHeight)));
    step = itemHeight + 16;
    work.style.setProperty('--work-card-height', itemHeight + 'px');
    track.style.setProperty('--work-height', itemHeight * 3 + 32 + 'px');
    state.conveyor = true; placeWork();
  }
  function start() {
    const oldY = scrollY;
    fallback(); readModel();
    root.classList.add('about-navigation'); navigation.hidden = false; materializeArrows();
    if (!mq.matches || location.search.includes('view=all') || !gsap || !ST || window.aboutBoot?.expired) {setupWork(); render(); return;}
    try {
      gsap.registerPlugin(ST); root.classList.add('about-active');
      events.forEach(event => event.classList.add('is-active'));
      const heights = events.map(event => event.offsetHeight), windowHeight = $('.journey-window').clientHeight;
      if (Math.max(...heights) > windowHeight - 48) {fallback(); setupWork(); render(); return;}
      // All work entries remain in source order; the belt uses transforms, no clones.
      setupWork();
      activateEvent(0); cardHeights = cards.map(card => card.offsetHeight);
      if (Math.max(cardHeights[0], cardHeights[1]) > innerHeight - dock - 150) {fallback(); setupWork(); render(); return;}
      stageHeight = cardHeights[2];
      distance = heights.slice(1).reduce((sum, height, i) => sum + Math.max(240, (height + heights[i]) * 1.5), 0) || 1;
      // Gaps between stops are never seen scrolling (the stage stays docked). The Details
      // gap keeps the footer below the fold while the timeline card is showing.
      journeyStart = journeyGap; timelineStart = journeyGap; timelineEnd = timelineStart + distance;
      detailsStart = timelineEnd + Math.max(160, Math.ceil(innerHeight - dock - cardHeights[2] - 64 + 40));
      readingEnd = detailsStart + Math.max(0, dock + stageHeight + 64 - innerHeight);
      deck.style.setProperty('--stage-height', stageHeight + 'px');
      deck.style.setProperty('--dock', dock + 'px');
      deck.style.setProperty('--runway-height', detailsStart + stageHeight + 'px');
      // A tall viewport still needs enough native scroll range to finish docking,
      // without spare range that would carry the docked stack past its resting place.
      footer.style.minHeight = Math.max(0, Math.ceil(innerHeight - dock - stageHeight - 64)) + 'px';
      state.enhanced = true; $('.return-layer').hidden = false;
      placeWork();
      trigger = ST.create({id:'about-page', start:0, end:() => readingEnd, onUpdate:render, onRefresh:render});
      window.scrollTo({top:oldY, behavior:'instant'});
      current = nearestIndex(scrollY); cardScene = sceneOf(current); view.stack = cardScene;
      if (current < lastIndex()) window.scrollTo({top:targetY(current), behavior:'instant'});
      ST.refresh(); render(); settle = false; clearTimeout(window.aboutBoot?.timer);
    } catch (error) {fallback(); render(); console.error('About restored its complete document.', error);}
  }
  [up, down].forEach(button => button.addEventListener('click', () => navigate((queued ?? destination?.index ?? state.index) + Number(button.dataset.step))));
  skip.addEventListener('click', event => {
    event.preventDefault(); navigate(lastIndex()); up.focus({preventScroll:true});
  });
  $$('.return-edge').forEach(button => button.addEventListener('click', () => {
    navigate(Number(button.dataset.scene) === 0 ? 0 : state.event + 1);
  }));
  $$('.return-edge').forEach(button => button.addEventListener('focus', () => {
    if (state.enhanced && scrollY > detailsStart) window.scrollTo({top:detailsStart, behavior:'instant'});
  }));
  list.addEventListener('click', event => {
    if (event.target.closest('.event-year,.event-compact')) focusYear(events.indexOf(event.target.closest('.timeline-event')));
  });
  list.addEventListener('focusin', event => {
    if (!state.enhanced || !event.target.matches(':focus-visible')) return;
    const index = events.indexOf(event.target.closest('.timeline-event'));
    if (index >= 0 && index !== state.event) focusYear(index, false);
  });
  work.addEventListener('pointerenter', () => {hovered = true; stopWork();});
  work.addEventListener('pointerleave', () => {hovered = false; scheduleWork();});
  work.addEventListener('focusin', event => {
    stopWork(); if (!state.conveyor) return;
    workTween?.kill(); workTween = null;
    const index = workItems.indexOf(event.target.closest('.tile-work-card'));
    if (index >= 0 && (index - state.workIndex + workItems.length) % workItems.length >= 3) state.workIndex = index;
    placeWork();
    // Browsers may scroll an overflow:hidden box to the old focused position.
    work.scrollTop = 0;
  });
  work.addEventListener('focusout', () => queueMicrotask(() => scheduleWork()));
  document.addEventListener('visibilitychange', () => document.hidden ? stopWork() : scheduleWork());
  ['wheel','touchstart','pointerdown','keydown'].forEach(type => addEventListener(type, event => {
    if (type === 'pointerdown' && event.target.closest('.card-navigation,.timeline-skip')) return;
    if (type === 'keydown' && event.target.closest('.card-navigation,.timeline-skip') && [' ','Enter'].includes(event.key)) return;
    if (type === 'keydown' && !['PageUp','PageDown','Home','End','ArrowUp','ArrowDown',' '].includes(event.key)) return;
    // A committed move is never cancelled. Otherwise cancel only our pending
    // native smooth jump; the wheel/touch/key action itself still runs normally.
    if (doneCall || performance.now() < lockUntil) return;
    if (destination) window.scrollTo({top:scrollY, behavior:'instant'});
    destination = null;
  }, {passive:true}));
  // Wheel, keys and touch drive the stops directly. Native scrolling would first lurch the
  // page (a wheel notch moves 100px at once) before the timed move could start, which read
  // as choppy. Input during a move, plus its short cooldown, is absorbed so momentum cannot
  // skip stops. Only The Details reads natively below its stop.
  const locked = () => !!doneCall || performance.now() < lockUntil;
  const reading = dir => current === lastIndex() && (dir > 0 || scrollY > detailsStart + commitSlack);
  const stepBy = dir => {const next = clamp(current + dir, 0, lastIndex()); if (next !== current) navigate(next);};
  let wheelSum = 0, wheelTimer = null, touchY = null, touchStepped = false;
  addEventListener('wheel', event => {
    if (!state.enhanced || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const dir = Math.sign(event.deltaY);
    if (!locked() && reading(dir)) return;
    event.preventDefault();
    if (locked()) {wheelSum = 0; return;}
    // Trackpads send many small deltas; gather them into one intentional gesture.
    clearTimeout(wheelTimer); wheelTimer = setTimeout(() => {wheelSum = 0;}, 160);
    wheelSum += event.deltaMode ? dir * 100 : event.deltaY;
    if (Math.abs(wheelSum) < 24) return;
    wheelSum = 0; stepBy(dir);
  }, {passive:false});
  addEventListener('keydown', event => {
    if (!state.enhanced || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable]')) return;
    const key = event.key;
    if ((key === ' ' || key === 'Enter') && event.target.closest('button,a')) return;
    const dir = key === 'ArrowDown' || key === 'PageDown' || (key === ' ' && !event.shiftKey) || key === 'End' ? 1
      : key === 'ArrowUp' || key === 'PageUp' || (key === ' ' && event.shiftKey) || key === 'Home' ? -1 : 0;
    if (!dir || (!locked() && reading(dir))) return;
    event.preventDefault();
    if (locked()) return;
    if (key === 'Home' || key === 'End') navigate(key === 'Home' ? 0 : lastIndex()); else stepBy(dir);
  });
  addEventListener('touchstart', event => {touchY = event.touches[0]?.clientY ?? null; touchStepped = false;}, {passive:true});
  addEventListener('touchmove', event => {
    if (!state.enhanced || touchY === null) return;
    const dy = touchY - event.touches[0].clientY, dir = Math.sign(dy);
    if (!touchStepped && !locked() && reading(dir)) return;
    event.preventDefault();
    if (touchStepped || locked() || Math.abs(dy) < 40) return;
    touchStepped = true; stepBy(dir);
  }, {passive:false});
  addEventListener('scroll', () => {if (!state.enhanced) render();}, {passive:true});
  mq.addEventListener('change', start);
  reduced.addEventListener('change', () => {if (reduced.matches) root.classList.remove('about-intro'); start();});
  addEventListener('resize', () => {clearTimeout(resizeTimer); resizeTimer = setTimeout(start, 180);});
  addEventListener('pagehide', fallback);
  addEventListener('pageshow', event => {if (event.persisted) start();});
  $('.ab-portrait').addEventListener('animationend', event => {
    if (event.animationName === 'about-develop') {root.classList.remove('about-intro'); clearTimeout(window.aboutBoot?.introTimer);}
  });
  window.aboutPage = {fallback, refresh:start, navigate,
    snapshot:() => ({...state, current, scrollY, distance, journeyStart, timelineStart, timelineEnd, detailsStart, readingEnd, stageTop:stage.getBoundingClientRect().top, workPaused:!workAllowed(), pins:ST?.getAll().filter(t => t.pin).length || 0, triggers:ST?.getAll().length || 0}),
    addEvent(data) {
      if (!Number.isFinite(+data.year) || +data.year < 2019 || document.getElementById(data.id)) throw new Error('Use a unique id and a year from 2019 onward.');
      const li = document.createElement('li'); li.className = 'timeline-event'; li.id = data.id; li.dataset.year = data.year; li.dataset.proof = data.proof;
      const time = document.createElement('time'); time.dateTime = data.year; time.textContent = data.year;
      const node = document.createElement('span'); node.className = 'event-node'; node.setAttribute('aria-hidden','true');
      const copy = document.createElement('div'); copy.className = 'event-copy'; const full = document.createElement('div'); full.className = 'event-full';
      const title = document.createElement('h3'); title.textContent = data.title; full.append(title);
      data.paragraphs.forEach(text => {const p = document.createElement('p'); p.textContent = text; full.append(p);});
      copy.append(full); li.append(time, node, copy); list.append(li);
      $$('.timeline-event', list).sort((a,b) => +a.dataset.year - +b.dataset.year).forEach(el => list.append(el)); start();
    }
  };
  readModel(); start(); armPrompt();
  document.fonts.ready.then(start);
})();
