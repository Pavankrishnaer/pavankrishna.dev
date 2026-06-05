// Page-specific interactions for index.html

// TERMINAL TYPING
const lines = [
  { type: 'q', text: '$ who are you?' },
  { type: 'a', text: 'AWS Cloud Engineer with QA roots' },
  { type: 'b' },
  { type: 'q', text: '$ where are you based?' },
  { type: 'a', text: 'Germany, open to remote & on-site roles' },
  { type: 'b' },
  { type: 'q', text: '$ what makes you different?' },
  { type: 'a', text: 'I build things that don\'t break' },
  { type: 'b' },
  { type: 'q', text: '$ why should we hire you?' },
  { type: 'a', text: 'Most engineers build. I build AND validate.' },
  { type: 'b' },
  { type: 'q', text: '$ what\'s your background?' },
  { type: 'a', text: '8+ years QA → AWS Cloud since 2025' },
  { type: 'b' },
  { type: 'q', text: '$ tech stack?' },
  { type: 'a', text: 'EC2, S3, Lambda, VPC, IAM, RDS, CloudWatch' },
  { type: 'b' },
  { type: 'q', text: '$ available?' },
  { type: 'a', text: 'Yes. Full-time & freelance. Let\'s talk.' },
  { type: 'b' },
  { type: 'q', text: '$ contact?' },
  { type: 'a', text: 'pavankrishnaer@gmail.com' },
];

const termBody = document.getElementById('terminalBody');
let lineIdx = 0, charIdx = 0, isTyping = false;

function typeLine() {
  if (lineIdx >= lines.length) {
    const cur = document.createElement('span');
    cur.className = 't-cursor';
    termBody.appendChild(cur);
    return;
  }
  const line = lines[lineIdx];
  if (line.type === 'b') {
    const el = document.createElement('div');
    el.className = 't-line-blank';
    termBody.appendChild(el);
    lineIdx++; charIdx = 0;
    setTimeout(typeLine, 80);
    return;
  }
  if (charIdx === 0) {
    const el = document.createElement('div');
    el.className = line.type === 'q' ? 't-line-q' : 't-line-a';
    el.id = 'tl-' + lineIdx;
    termBody.appendChild(el);
  }
  const el = document.getElementById('tl-' + lineIdx);
  el.textContent = (line.type === 'a' ? '  ' : '') + line.text.slice(0, charIdx + 1);
  charIdx++;
  if (charIdx < line.text.length) {
    setTimeout(typeLine, line.type === 'q' ? 45 : 30);
  } else {
    lineIdx++; charIdx = 0;
    setTimeout(typeLine, line.type === 'q' ? 200 : 400);
  }
}

// Start when section is visible
const termObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !isTyping) {
      isTyping = true;
      setTimeout(typeLine, 600);
      termObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const termCard = document.querySelector('.terminal-card');
if (termCard) termObs.observe(termCard);

// PUZZLE
const correctOrder = ['Route 53', 'CloudFront', 'S3 Bucket', 'ACM (SSL)', 'IAM Policy'];
const icons = { 'Route 53': '🌍', 'CloudFront': '⚡', 'S3 Bucket': '🪣', 'ACM (SSL)': '🔒', 'IAM Policy': '🔐' };
let dragItem = null;
let selectedChip = null;

function getChipSource(chip) {
  const parent = chip.parentElement;
  return parent && parent.classList.contains('slot-drop') ? parent : 'bank';
}

function resetSlot(slot) {
  slot.textContent = 'drop here';
  slot.classList.remove('filled');
}

function setTapTargets(active) {
  document.querySelectorAll('.slot-drop').forEach(slot => {
    slot.classList.toggle('tap-target', active);
  });
}

function clearSelectedChip() {
  if (selectedChip) {
    selectedChip.classList.remove('selected');
    selectedChip.setAttribute('aria-pressed', 'false');
  }
  selectedChip = null;
  setTapTargets(false);
}

function selectChip(chip) {
  if (puzzleSolved || chip.classList.contains('correct')) return;

  if (selectedChip === chip) {
    clearSelectedChip();
    return;
  }

  clearSelectedChip();
  selectedChip = chip;
  selectedChip.classList.add('selected');
  selectedChip.setAttribute('aria-pressed', 'true');
  setTapTargets(true);
}

function moveChipToSlot(chip, slot) {
  const bank = document.getElementById('puzzleBank');
  const source = getChipSource(chip);
  const existingChip = slot.querySelector('.p-chip');

  if (existingChip === chip) {
    clearSelectedChip();
    return;
  }

  if (source && source !== 'bank') {
    resetSlot(source);
  }

  if (existingChip) {
    if (source && source !== 'bank') {
      source.textContent = '';
      source.classList.add('filled');
      source.appendChild(existingChip);
    } else {
      bank.appendChild(existingChip);
    }
  }

  slot.textContent = '';
  slot.classList.add('filled');
  slot.appendChild(chip);
  clearSelectedChip();
  checkPuzzle();
}

function moveChipToBank(chip) {
  const source = getChipSource(chip);
  if (source === 'bank') {
    clearSelectedChip();
    return;
  }

  resetSlot(source);
  document.getElementById('puzzleBank').appendChild(chip);
  clearSelectedChip();
  checkPuzzle();
}

function buildPuzzle() {
  const bank = document.getElementById('puzzleBank');
  const zone = document.getElementById('puzzleZone');
  const feedback = document.getElementById('puzzleFeedback');
  clearSelectedChip();
  dragItem = null;
  feedback.textContent = '';
  feedback.className = 'puzzle-feedback';

  // Build numbered slots
  zone.innerHTML = '';
  correctOrder.forEach((_, i) => {
    const slot = document.createElement('div');
    slot.className = 'puzzle-slot';
    slot.innerHTML = `<div class="slot-num">${i + 1}</div><div class="slot-drop" data-index="${i}" role="button" tabindex="0" aria-label="Position ${i + 1}">drop here</div>`;
    zone.appendChild(slot);
  });

  // Slot events support desktop drag/drop and mobile tap-to-place.
  zone.querySelectorAll('.slot-drop').forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      if (!dragItem) return;
      moveChipToSlot(dragItem, slot);
    });
    slot.addEventListener('click', () => {
      if (selectedChip) moveChipToSlot(selectedChip, slot);
    });
    slot.addEventListener('keydown', e => {
      if (!selectedChip || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      moveChipToSlot(selectedChip, slot);
    });
  });

  // Bank drag events accept chips dragged back from slots.
  bank.ondragover = e => { e.preventDefault(); bank.classList.add('drag-over-bank'); };
  bank.ondragleave = () => bank.classList.remove('drag-over-bank');
  bank.ondrop = e => {
    e.preventDefault();
    bank.classList.remove('drag-over-bank');
    if (!dragItem) return;
    moveChipToBank(dragItem);
  };
  bank.onclick = e => {
    if (selectedChip && !e.target.closest('.p-chip')) moveChipToBank(selectedChip);
  };

  // Shuffle chips into bank
  const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
  bank.innerHTML = '';
  shuffled.forEach(svc => bank.appendChild(createChip(svc)));
}

function createChip(svc) {
  const chip = document.createElement('div');
  chip.className = 'p-chip';
  chip.draggable = true;
  chip.textContent = icons[svc] + ' ' + svc;
  chip.dataset.svc = svc;
  chip.setAttribute('role', 'button');
  chip.setAttribute('tabindex', '0');
  chip.setAttribute('aria-pressed', 'false');
  chip.setAttribute('aria-label', svc);
  chip.addEventListener('click', event => {
    event.stopPropagation();
    selectChip(chip);
  });
  chip.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    selectChip(chip);
  });
  chip.addEventListener('dragstart', () => {
    clearSelectedChip();
    dragItem = chip;
    setTimeout(() => chip.classList.add('dragging'), 0);
  });
  chip.addEventListener('dragend', () => {
    chip.classList.remove('dragging');
    dragItem = null;
  });
  return chip;
}

let puzzleSolved = false;

function resetPuzzle() { puzzleSolved = false; clearSelectedChip(); buildPuzzle(); }

function checkPuzzle() {
  if (puzzleSolved) return; // don't overwrite the win message
  const slots = [...document.querySelectorAll('.slot-drop')];
  const placed = slots.map(s => s.querySelector('.p-chip')?.dataset.svc || null);
  if (placed.some(p => !p)) return; // not all filled yet

  const feedback = document.getElementById('puzzleFeedback');
  const isCorrect = placed.every((s, i) => s === correctOrder[i]);

  if (isCorrect) {
    puzzleSolved = true;
    clearSelectedChip();
    slots.forEach(s => {
      const chip = s.querySelector('.p-chip');
      if (chip) {
        chip.classList.add('correct');
        chip.draggable = false; // prevent further dragging
        chip.setAttribute('aria-disabled', 'true');
      }
    });
    feedback.innerHTML = '🎉 Perfect! You think like a cloud engineer.<br><a href="#" onclick="openHireModal();return false;" class="puzzle-win-link">Now let&rsquo;s talk →</a>';
    feedback.className = 'puzzle-feedback win';
    // Win message stays until reset. No timeout.
  } else {
    placed.forEach((svc, i) => {
      const chip = slots[i].querySelector('.p-chip');
      if (chip) chip.classList.add(svc === correctOrder[i] ? 'correct' : 'wrong');
    });
    feedback.textContent = '🤔 Not quite. Think about the request flow from DNS to storage.';
    feedback.className = 'puzzle-feedback hint';
    setTimeout(() => {
      slots.forEach(s => {
        const chip = s.querySelector('.p-chip');
        if (chip) { chip.classList.remove('correct', 'wrong'); }
      });
      feedback.textContent = '';
    }, 5000);
  }
}

buildPuzzle();
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
// VISITOR COUNTER
// Replace this URL with your real AWS Lambda endpoint after deployment
const COUNTER_URL = 'https://zjcq59af07.execute-api.eu-central-1.amazonaws.com/count';
async function loadVisitorCount() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  try {
    if (COUNTER_URL) {
      const res = await fetch(COUNTER_URL, { method: 'POST' });
      const data = await res.json();
      el.textContent = data.count.toLocaleString();
    } else {
      // Simulated count until Lambda is wired up
      el.textContent = '247';
    }
  } catch {
    el.textContent = 'N/A';
  }
}
loadVisitorCount();
// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ANIMATED STATS COUNTER
function animateCount(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const raw = n.getAttribute('data-count');
        const suffix = n.getAttribute('data-suffix') || '';
        animateCount(n, parseInt(raw), suffix);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObs.observe(statsRow);

// MOBILE QA DROPDOWN
const qaCard = document.querySelector('.qa-card');
const qaToggle = document.querySelector('.qa-toggle');
if (qaCard && qaToggle) {
  qaToggle.addEventListener('click', () => {
    const isOpen = qaCard.classList.toggle('open');
    qaToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// SCROLL PROGRESS BAR
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.height = pct + '%';
});

// CSS BUBBLES
const bubbleLabels = ['EC2', 'S3', 'IAM', 'VPC', 'λ', 'RDS', 'CDN', 'SNS', 'EKS', 'SQS', '☁️', '⚡'];
const bubbleWrap = document.getElementById('cssBubbles');

for (let i = 0; i < 16; i++) {
  const b = document.createElement('div');
  b.className = 'css-bubble';
  const size = Math.random() * 36 + 24;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const dur = Math.random() * 20 + 20;
  const delay = Math.random() * -30;
  const r = () => (Math.random() - 0.5) * 120;
  b.style.cssText = `
width:${size}px; height:${size}px;
left:${x}%; top:${y}%;
font-size:${size * 0.32}px;
animation-duration:${dur}s;
animation-delay:${delay}s;
--tx1:${r()}px; --ty1:${r()}px;
--tx2:${r()}px; --ty2:${r()}px;
--tx3:${r()}px; --ty3:${r()}px;
  `;
  b.textContent = bubbleLabels[i % bubbleLabels.length];
  bubbleWrap.appendChild(b);
}
