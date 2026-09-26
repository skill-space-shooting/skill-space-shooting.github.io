'use strict';

let dataset;
let activeTask;
let player;
const $ = id => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function refreshPlaybackButton() {
  $('pause-player').textContent = player && !player.video.paused ? 'Pause' : 'Play';
}

function pausePlayback() {
  if (player) {
    player.jumpRequest++;
    player.video.pause();
  }
  refreshPlaybackButton();
}

function makePlayer(task) {
  const movie = task.movie;
  const chapters = task.chapters || [];
  const card = el('article', 'player-card comparison-card');

  const wrap = el('div', 'video-wrap');
  const width = Number(movie.width) || 1920;
  const height = Number(movie.height) || 820;
  wrap.style.aspectRatio = `${width} / ${height}`;
  const video = el('video');
  video.controls = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('controlsList', 'noplaybackrate');
  video.setAttribute('aria-label', `${task.title}: edited policy comparison`);
  video.poster = movie.poster || '';
  video.defaultPlaybackRate = 1;
  video.playbackRate = 1;
  wrap.append(video);
  const fullscreenHint = el('p', 'fullscreen-hint', 'View fullscreen in landscape for a closer look.');

  const chapterControls = el('div', 'chapter-controls');
  chapterControls.setAttribute('aria-label', 'Comparison chapters');
  chapterControls.append(el('p', 'chapter-control-label', 'Jump to a chapter'));
  const buttons = el('div', 'chapter-buttons');
  const observation = el('div', 'observation');
  const noteLabel = el('p', 'small-label');
  const noteText = el('p');
  observation.setAttribute('aria-live', 'polite');
  observation.append(noteLabel, noteText);

  const controller = {
    video,
    task,
    currentChapter: -1,
    currentNote: '',
    jumpRequest: 0,
    hasError: false,
    updateChapter(time, force = false) {
      if (this.hasError) return;
      let index = chapters.findIndex(chapter => time >= Number(chapter.start) && time < Number(chapter.end));
      if (index < 0) {
        index = chapters.length ? 0 : -1;
        for (let i = 0; i < chapters.length; i++) {
          if (time >= Number(chapters[i].start)) index = i;
        }
      }
      this.currentChapter = index;
      for (let i = 0; i < buttons.children.length; i++) {
        buttons.children[i].setAttribute('aria-pressed', i === index ? 'true' : 'false');
      }
      const chapter = chapters[index];
      const phase = chapter?.phases?.find(item => time >= item.start && time < item.end);
      const segment = phase?.segments?.find(item => time >= item.start && time < item.end);
      const terminal = phase && time >= phase.terminalStart;
      const label = phase
        ? `${phase.methodLabel} · Iteration ${phase.iteration}${terminal ? ` · ${phase.terminalLabel}` : segment?.highlight ? ' · 1× highlight' : ''}`
        : chapter?.title || 'What to notice';
      const text = terminal ? phase.terminalCaption : segment?.caption || phase?.takeaway || chapter?.takeaway || task.story;
      const key = `${label}|${text}`;
      if (force || key !== this.currentNote) {
        noteLabel.textContent = label;
        noteText.textContent = text;
        this.currentNote = key;
      }
    },
    async jumpTo(time) {
      const request = ++this.jumpRequest;
      if (this.hasError) return;
      video.pause();
      try {
        if (video.readyState < 1) {
          await new Promise((resolve, reject) => {
            const cleanup = () => {
              video.removeEventListener('loadedmetadata', loaded);
              video.removeEventListener('error', failed);
            };
            const loaded = () => { cleanup(); resolve(); };
            const failed = () => { cleanup(); reject(new Error('Video could not load.')); };
            video.addEventListener('loadedmetadata', loaded, { once: true });
            video.addEventListener('error', failed, { once: true });
            video.preload = 'auto';
            video.load();
          });
        }
        if (player !== this || request !== this.jumpRequest) return;
        const lastTime = Number.isFinite(video.duration) ? Math.max(0, video.duration - .05) : time;
        // Seek just inside the chapter to avoid media-clock rounding at its boundary.
        video.currentTime = Math.min(Math.max(0, time > 0 ? time + .03 : time), lastTime);
        this.updateChapter(video.currentTime, true);
        await video.play();
      } catch (error) {
        if (player === this && video.error) this.showError();
      }
    },
    showError() {
      this.hasError = true;
      noteLabel.textContent = 'Playback unavailable';
      noteText.textContent = 'The comparison movie could not load. Please reload the page to try again.';
      refreshPlaybackButton();
    }
  };

  chapters.forEach((chapter, index) => {
    const button = el('button', 'chapter-button');
    button.type = 'button';
    button.append(el('span', 'chapter-number', String(index + 1).padStart(2, '0')), el('span', '', chapter.title));
    button.setAttribute('aria-label', `Play chapter ${index + 1}: ${chapter.title}`);
    button.addEventListener('click', () => controller.jumpTo(Number(chapter.start)));
    buttons.append(button);
  });
  chapterControls.append(buttons);
  chapterControls.hidden = chapters.length === 0;
  card.append(wrap, fullscreenHint, chapterControls, observation);
  $('players').append(card);

  video.addEventListener('play', refreshPlaybackButton);
  video.addEventListener('pause', refreshPlaybackButton);
  video.addEventListener('ended', refreshPlaybackButton);
  video.addEventListener('timeupdate', () => controller.updateChapter(video.currentTime));
  video.addEventListener('seeked', () => controller.updateChapter(video.currentTime, true));
  video.addEventListener('ratechange', () => { if (video.playbackRate !== 1) video.playbackRate = 1; });
  video.addEventListener('error', () => controller.showError());
  controller.updateChapter(0, true);
  video.src = movie.src;
  return controller;
}

function showTask(id, updateUrl = true) {
  const task = dataset.tasks.find(item => item.id === id) || dataset.tasks[0];
  pausePlayback();
  if (player) {
    player.jumpRequest++;
    player.video.removeAttribute('src');
    player.video.load();
  }
  player = null;
  $('players').replaceChildren();
  activeTask = task.id;
  $('task-title').textContent = task.title;
  $('task-kind').textContent = task.kind;
  $('task-description').textContent = task.description;
  $('task-story').textContent = task.story;
  $('task-counter').textContent = `${String(dataset.tasks.indexOf(task) + 1).padStart(2, '0')} / ${String(dataset.tasks.length).padStart(2, '0')}`;
  for (const button of $('task-nav').children) button.setAttribute('aria-current', button.dataset.task === task.id ? 'true' : 'false');
  const hasMovie = Boolean(task.movie && task.movie.src);
  $('play-comparison').disabled = !hasMovie;
  $('pause-player').disabled = !hasMovie;
  if (hasMovie) player = makePlayer(task);
  else $('players').append(el('p', 'error', 'The comparison movie is not available yet.'));
  $('fullscreen-player').disabled = !player || !(player.video.requestFullscreen || player.video.webkitEnterFullscreen);
  refreshPlaybackButton();
  if (updateUrl) history.replaceState(null, '', `#${task.id}`);
}

async function init() {
  const response = await fetch('data.json?v=5a2d76797dc3');
  if (!response.ok) throw new Error('Could not load video catalog.');
  dataset = await response.json();
  if (!Array.isArray(dataset.tasks) || !dataset.tasks.length) throw new Error('The video catalog is empty.');
  dataset.tasks.forEach((task, index) => {
    const button = el('button', 'task-tab');
    button.type = 'button';
    button.dataset.task = task.id;
    button.append(el('span', 'nav-index', String(index + 1).padStart(2, '0')), el('span', '', task.shortTitle));
    button.addEventListener('click', () => showTask(task.id));
    $('task-nav').append(button);
  });
  $('play-comparison').addEventListener('click', () => { if (player) player.jumpTo(0); });
  $('pause-player').addEventListener('click', () => {
    if (!player) return;
    if (!player.video.paused) pausePlayback();
    else if (player.video.ended) player.jumpTo(0);
    else player.video.play().catch(() => {});
  });
  $('fullscreen-player').addEventListener('click', () => {
    if (!player) return;
    const video = player.video;
    const safariFullscreen = () => {
      if (video.webkitEnterFullscreen) {
        try { video.webkitEnterFullscreen(); } catch (error) { /* Native video controls remain available. */ }
      }
    };
    if (video.requestFullscreen) video.requestFullscreen().catch(safariFullscreen);
    else safariFullscreen();
  });
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id !== activeTask) showTask(id, false);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pausePlayback(); });
  showTask(location.hash.slice(1), false);
}

init().catch(error => {
  $('players').append(el('p', 'error', 'The video catalog could not load. Please reload the page.'));
  $('play-comparison').disabled = true;
  $('pause-player').disabled = true;
  $('fullscreen-player').disabled = true;
  console.error(error);
});
