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
let dragSource = null; // 'bank' or the slot-drop element it came from

function buildPuzzle() {
  const bank = document.getElementById('puzzleBank');
  const zone = document.getElementById('puzzleZone');
  const feedback = document.getElementById('puzzleFeedback');
  feedback.textContent = '';
  feedback.className = 'puzzle-feedback';

  // Build numbered slots
  zone.innerHTML = '';
  correctOrder.forEach((_, i) => {
    const slot = document.createElement('div');
    slot.className = 'puzzle-slot';
    slot.innerHTML = `<div class="slot-num">${i + 1}</div><div class="slot-drop" data-index="${i}">drop here</div>`;
    zone.appendChild(slot);
  });

  // Slot drag events — support swap + drop from bank
  zone.querySelectorAll('.slot-drop').forEach(slot => {
    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      if (!dragItem) return;

      const existingChip = slot.querySelector('.p-chip');
      if (existingChip === dragItem) return; // dropped on itself

      // First, clear the source slot
      if (dragSource && dragSource !== 'bank') {
        dragSource.textContent = 'drop here';
        dragSource.classList.remove('filled');
      }

      if (existingChip) {
        // SWAP: move existing chip to source
        if (dragSource === 'bank') {
          document.getElementById('puzzleBank').appendChild(existingChip);
        } else if (dragSource) {
          dragSource.textContent = '';
          dragSource.classList.add('filled');
          dragSource.appendChild(existingChip);
        }
      }

      // Place dragItem into target slot
      slot.textContent = '';
      slot.classList.add('filled');
      slot.appendChild(dragItem);
      checkPuzzle();
    });
  });

  // Bank drag events — accept chips dragged back from slots
  bank.addEventListener('dragover', e => { e.preventDefault(); bank.classList.add('drag-over-bank'); });
  bank.addEventListener('dragleave', () => bank.classList.remove('drag-over-bank'));
  bank.addEventListener('drop', e => {
    e.preventDefault();
    bank.classList.remove('drag-over-bank');
    if (!dragItem) return;
    if (dragSource && dragSource !== 'bank') {
      dragSource.classList.remove('filled');
      dragSource.textContent = 'drop here';
    }
    bank.appendChild(dragItem);
    checkPuzzle();
  });

  // Shuffle chips into bank
  const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
  bank.innerHTML = '';
  shuffled.forEach(svc => bank.appendChild(createChip(svc)));
}

function createChip(svc) {
  const chip = document.createElement('div');
  chip.className = 'p-chip';
  chip.draggable = true;
  chip.innerHTML = icons[svc] + ' ' + svc;
  chip.dataset.svc = svc;
  chip.addEventListener('dragstart', () => {
    dragItem = chip;
    const parentSlot = chip.parentElement;
    dragSource = parentSlot.classList.contains('slot-drop') ? parentSlot : 'bank';
    setTimeout(() => chip.classList.add('dragging'), 0);
  });
  chip.addEventListener('dragend', () => {
    chip.classList.remove('dragging');
    dragItem = null;
    dragSource = null;
  });
  return chip;
}

let puzzleSolved = false;

function resetPuzzle() { puzzleSolved = false; buildPuzzle(); }

function checkPuzzle() {
  if (puzzleSolved) return; // don't overwrite the win message
  const slots = [...document.querySelectorAll('.slot-drop')];
  const placed = slots.map(s => s.querySelector('.p-chip')?.dataset.svc || null);
  if (placed.some(p => !p)) return; // not all filled yet

  const feedback = document.getElementById('puzzleFeedback');
  const isCorrect = placed.every((s, i) => s === correctOrder[i]);

  if (isCorrect) {
    puzzleSolved = true;
    slots.forEach(s => {
      const chip = s.querySelector('.p-chip');
      if (chip) {
        chip.classList.add('correct');
        chip.draggable = false; // prevent further dragging
      }
    });
    feedback.innerHTML = '🎉 Perfect! You think like a cloud engineer.<br><a href="#" onclick="openHireModal();return false;" class="puzzle-win-link">Now let&rsquo;s talk →</a>';
    feedback.className = 'puzzle-feedback win';
    // Win message stays until reset — no timeout
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
const COUNTER_URL = ''; // e.g. 'https://xxxxx.execute-api.eu-central-1.amazonaws.com/visits'
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
    el.textContent = '—';
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
