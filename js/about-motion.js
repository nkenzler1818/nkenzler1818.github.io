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
  const headerTrack = document.querySelector('.about-header-track'), header = $('header', headerTrack);
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
  const transitionDistance = 320, eventHold = 140;

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
  function navigate(index, smooth = true) {
    index = clamp(index, 0, lastIndex());
    const y = clamp(targetY(index), 0, document.documentElement.scrollHeight - innerHeight);
    // Rapid clicks advance from the requested destination, not an intermediate pose.
    destination = {index, y}; paintNavigation(index);
    window.scrollTo({top:y, behavior:smooth && !reduced.matches ? 'smooth' : 'instant'});
    render();
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
    const point = progress * (events.length - 1), index = Math.round(point);
    if (state.event !== index || !events[index].classList.contains('is-active')) activateEvent(index);
    const centers = events.map(e => e.offsetTop + e.offsetHeight / 2);
    const lower = Math.floor(point), upper = Math.min(centers.length - 1, lower + 1);
    const center = centers[lower] + (centers[upper] - centers[lower]) * (point - lower);
    // Keep the focused copy near the heading, without the previous half-card void.
    const focusY = Math.max(100, events[index].offsetHeight / 2 + 24) + 56 * clamp(point);
    gsap.set(position, {y:focusY - center});
    rail.style.top = centers[0] + 'px'; rail.style.height = Math.max(1, centers.at(-1) - centers[0]) + 'px';
    gsap.set(fill, {scaleY:progress}); state.progress = progress;
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
    workTween = gsap.to(workItems, {y:'-=' + step, duration:.5, ease:'power2.inOut', onComplete:() => {
      state.workIndex = (state.workIndex + 1) % workItems.length;
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
    const stack = y < journeyStart ? clamp(y / transitionDistance) : 1 + clamp((y - timelineEnd - eventHold) / transitionDistance);
    state.stack = stack; state.scene = Math.round(stack);
    paintTimeline(clamp((y - timelineStart) / distance));
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
    paintNavigation(destination?.index ?? (state.scene === 0 ? 0 : state.scene === 2 ? lastIndex() : state.event + 1));
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
    gsap?.killTweensOf([...cards, position, fill, ...backs, ...workItems]);
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
    root.classList.add('about-navigation'); navigation.hidden = false;
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
      journeyStart = transitionDistance; timelineStart = journeyStart + eventHold;
      timelineEnd = timelineStart + distance; detailsStart = timelineEnd + eventHold + transitionDistance;
      readingEnd = detailsStart + Math.max(0, dock + stageHeight + 64 - innerHeight);
      deck.style.setProperty('--stage-height', stageHeight + 'px');
      deck.style.setProperty('--dock', dock + 'px');
      deck.style.setProperty('--runway-height', detailsStart + stageHeight + 'px');
      headerTrack.style.setProperty('--nav-runway', detailsStart + header.offsetHeight + 24 + 'px');
      // A tall viewport still needs enough native scroll range to finish docking.
      footer.style.minHeight = Math.max(0, innerHeight - dock - stageHeight + 32) + 'px';
      state.enhanced = true; $('.return-layer').hidden = false;
      placeWork();
      trigger = ST.create({id:'about-page', start:0, end:() => readingEnd, onUpdate:render, onRefresh:render});
      window.scrollTo({top:oldY, behavior:'instant'}); ST.refresh(); render(); clearTimeout(window.aboutBoot?.timer);
    } catch (error) {fallback(); render(); console.error('About restored its complete document.', error);}
  }
  [up, down].forEach(button => button.addEventListener('click', () => navigate((destination?.index ?? state.index) + Number(button.dataset.step))));
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
    // Cancel only our pending smooth jump; the native wheel/touch/key action
    // still runs normally. Clearing the destination alone does not stop it.
    if (destination) window.scrollTo({top:scrollY, behavior:'instant'});
    destination = null;
  }, {passive:true}));
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
    snapshot:() => ({...state, scrollY, distance, journeyStart, timelineStart, timelineEnd, detailsStart, readingEnd, stageTop:stage.getBoundingClientRect().top, workPaused:!workAllowed(), pins:ST?.getAll().filter(t => t.pin).length || 0, triggers:ST?.getAll().length || 0}),
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
  readModel(); start();
  document.fonts.ready.then(start);
})();
