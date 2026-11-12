// 數位科技概論（系統平台與硬體）互動式測驗應用程式邏輯

(function() {
  'use strict';

  // State
  const state = {
    mode: 'exam', // 'exam' | 'practice' | 'study'
    currentIndex: 0,
    userAnswers: new Array(QUESTIONS.length).fill(null),
    flagged: new Set(),
    isSubmitted: false,
    startTime: null,
    endTime: null,
    timerSeconds: QUIZ_INFO.defaultTimeMinutes * 60,
    timerInterval: null,
    soundEnabled: localStorage.getItem('sound_enabled') !== 'false',
    studyCategoryFilter: 'all',
    studySearchQuery: '',
    studyOnlyMistakes: false,
    sheetIndex: 0
  };

  // Sound Engine using Web Audio API
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'correct') {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.12, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'victory') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.15, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.4);
        });
      }
    } catch (e) {
      console.warn("Audio playback not allowed:", e);
    }
  }

  // Lightweight Confetti Particle Engine
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];
    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.008;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }
    render();
  }

  // DOM Elements
  const el = {
    // Mode Buttons
    btnModeExam: document.getElementById('btn-mode-exam'),
    btnModePractice: document.getElementById('btn-mode-practice'),
    btnModeStudy: document.getElementById('btn-mode-study'),
    btnViewSheets: document.getElementById('btn-view-sheets'),
    btnToggleSound: document.getElementById('btn-toggle-sound'),
    btnToggleTheme: document.getElementById('btn-toggle-theme'),

    // Containers
    mainQuizContainer: document.getElementById('main-quiz-container'),
    studyModeContainer: document.getElementById('study-mode-container'),

    // Question Card
    qNum: document.getElementById('q-num'),
    qTopic: document.getElementById('q-topic'),
    qStem: document.getElementById('q-stem'),
    optionsList: document.getElementById('options-list'),
    explanationBox: document.getElementById('explanation-box'),
    explanationContent: document.getElementById('explanation-content'),
    btnFlag: document.getElementById('btn-flag'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),

    // Navigator & Status
    timerDisplay: document.getElementById('timer-display'),
    progressCount: document.getElementById('progress-count'),
    progressPercentage: document.getElementById('progress-percentage'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    navigatorGrid: document.getElementById('navigator-grid'),
    btnSubmitExam: document.getElementById('btn-submit-exam'),

    // Modals
    modalSubmitConfirm: document.getElementById('modal-submit-confirm'),
    modalResult: document.getElementById('modal-result'),
    modalSheetViewer: document.getElementById('modal-sheet-viewer'),

    // Result elements
    resScore: document.getElementById('res-score'),
    resCorrectCount: document.getElementById('res-correct-count'),
    resWrongCount: document.getElementById('res-wrong-count'),
    resTimeSpent: document.getElementById('res-time-spent'),
    resFeedbackText: document.getElementById('res-feedback-text'),
    btnReviewExam: document.getElementById('btn-review-exam'),
    btnRetakeExam: document.getElementById('btn-retake-exam'),
    btnReviewMistakesOnly: document.getElementById('btn-review-mistakes-only'),

    // Sheet Viewer Elements
    sheetImage: document.getElementById('sheet-image'),
    sheetTab0: document.getElementById('sheet-tab-0'),
    sheetTab1: document.getElementById('sheet-tab-1'),

    // Study Elements
    studySearchInput: document.getElementById('study-search-input'),
    studyCategorySelect: document.getElementById('study-category-select'),
    studyQuestionsList: document.getElementById('study-questions-list'),
    studyFilterMistakesOnly: document.getElementById('study-filter-mistakes')
  };

  // Init Application
  function init() {
    initTheme();
    initCategories();
    bindEvents();
    startExam();
  }

  // Theme Init
  function initTheme() {
    const savedTheme = localStorage.getItem('site_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
    updateSoundIcon();
  }

  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (el.btnToggleTheme) {
      el.btnToggleTheme.textContent = isDark ? '☀️' : '🌙';
      el.btnToggleTheme.title = isDark ? '切換為淺色模式' : '切換為深色模式';
    }
  }

  function updateSoundIcon() {
    if (el.btnToggleSound) {
      el.btnToggleSound.textContent = state.soundEnabled ? '🔊' : '🔇';
      el.btnToggleSound.title = state.soundEnabled ? '靜音音效' : '開啟音效';
    }
  }

  // Categories Setup
  function initCategories() {
    const categories = Array.from(new Set(QUESTIONS.map(q => q.category)));
    if (el.studyCategorySelect) {
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        el.studyCategorySelect.appendChild(opt);
      });
    }
  }

  // Timer Management
  function startTimer() {
    clearInterval(state.timerInterval);
    state.startTime = Date.now();
    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
      if (state.timerSeconds > 0) {
        state.timerSeconds--;
        updateTimerDisplay();
        if (state.timerSeconds === 0) {
          clearInterval(state.timerInterval);
          alert('測驗時間到！系統將自動交卷。');
          submitExam();
        }
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(state.timerInterval);
    state.endTime = Date.now();
  }

  function updateTimerDisplay() {
    if (!el.timerDisplay) return;
    const mins = Math.floor(state.timerSeconds / 60);
    const secs = state.timerSeconds % 60;
    const text = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    el.timerDisplay.textContent = text;

    if (state.timerSeconds <= 180) { // last 3 mins
      el.timerDisplay.classList.add('warning');
    } else {
      el.timerDisplay.classList.remove('warning');
    }
  }

  // Start / Reset Exam
  function startExam() {
    state.currentIndex = 0;
    state.userAnswers = new Array(QUESTIONS.length).fill(null);
    state.flagged.clear();
    state.isSubmitted = false;
    state.timerSeconds = QUIZ_INFO.defaultTimeMinutes * 60;

    renderNavigatorGrid();
    renderQuestion();
    updateProgress();

    if (state.mode === 'exam') {
      startTimer();
    } else {
      stopTimer();
      if (el.timerDisplay) el.timerDisplay.textContent = '--:--';
    }
  }

  // Switch Mode
  function setMode(newMode) {
    state.mode = newMode;

    [el.btnModeExam, el.btnModePractice, el.btnModeStudy].forEach(btn => btn?.classList.remove('active'));
    if (newMode === 'exam') el.btnModeExam?.classList.add('active');
    if (newMode === 'practice') el.btnModePractice?.classList.add('active');
    if (newMode === 'study') el.btnModeStudy?.classList.add('active');

    if (newMode === 'study') {
      el.mainQuizContainer.style.display = 'none';
      el.studyModeContainer.style.display = 'flex';
      renderStudyModeList();
    } else {
      el.mainQuizContainer.style.display = 'grid';
      el.studyModeContainer.style.display = 'none';

      if (newMode === 'exam') {
        el.btnSubmitExam.style.display = 'block';
        if (!state.isSubmitted && !state.timerInterval) {
          startTimer();
        }
      } else {
        // practice mode
        el.btnSubmitExam.style.display = 'none';
        stopTimer();
        if (el.timerDisplay) el.timerDisplay.textContent = '即時反饋';
      }

      renderNavigatorGrid();
      renderQuestion();
      updateProgress();
    }
  }

  // Render Current Question
  function renderQuestion() {
    const q = QUESTIONS[state.currentIndex];
    if (!q) return;

    el.qNum.textContent = `第 ${q.id} 題`;
    el.qTopic.textContent = `${q.category} · 第${q.page}頁`;
    el.qStem.textContent = q.question;

    // Flag button state
    const isFlagged = state.flagged.has(state.currentIndex);
    el.btnFlag.classList.toggle('flagged', isFlagged);
    el.btnFlag.innerHTML = isFlagged ? '★ 已標記' : '☆ 標記此題';

    // Options rendering
    el.optionsList.innerHTML = '';
    const currentSelected = state.userAnswers[state.currentIndex];

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.type = 'button';

      const keySpan = document.createElement('span');
      keySpan.className = 'option-key';
      keySpan.textContent = opt.key;

      const textSpan = document.createElement('span');
      textSpan.className = 'option-text';
      textSpan.textContent = opt.text;

      btn.appendChild(keySpan);
      btn.appendChild(textSpan);

      // Determine styling based on mode and answered state
      if (state.mode === 'exam') {
        if (state.isSubmitted) {
          // Review mode after submission
          if (opt.key === q.answer) {
            btn.classList.add('correct-reveal');
          } else if (currentSelected === opt.key && currentSelected !== q.answer) {
            btn.classList.add('incorrect-reveal');
          }
        } else {
          // Active exam
          if (currentSelected === opt.key) {
            btn.classList.add('selected');
          }
        }
      } else if (state.mode === 'practice') {
        if (currentSelected) {
          if (opt.key === q.answer) {
            btn.classList.add('correct-reveal');
          } else if (currentSelected === opt.key && currentSelected !== q.answer) {
            btn.classList.add('incorrect-reveal');
          }
        }
      }

      btn.addEventListener('click', () => {
        handleOptionSelect(opt.key);
      });

      el.optionsList.appendChild(btn);
    });

    // Explanation Box display
    const shouldShowExplanation = (state.mode === 'practice' && currentSelected !== null) ||
                                  (state.mode === 'exam' && state.isSubmitted);

    if (shouldShowExplanation) {
      el.explanationBox.classList.add('show');
      el.explanationContent.innerHTML = `<strong>【正確答案：(${q.answer})】</strong><br>${q.explanation}`;
    } else {
      el.explanationBox.classList.remove('show');
    }

    // Prev / Next button states
    el.btnPrev.disabled = state.currentIndex === 0;
    el.btnNext.disabled = state.currentIndex === QUESTIONS.length - 1;

    // Update Matrix Button Active Indicator
    document.querySelectorAll('.matrix-btn').forEach((btn, idx) => {
      btn.classList.toggle('current', idx === state.currentIndex);
    });
  }

  // Handle Option Selection
  function handleOptionSelect(key) {
    if (state.mode === 'exam' && state.isSubmitted) return; // Read-only in review

    const isFirstAnswer = state.userAnswers[state.currentIndex] === null;
    state.userAnswers[state.currentIndex] = key;
    const q = QUESTIONS[state.currentIndex];

    if (state.mode === 'practice') {
      if (key === q.answer) {
        playSound('correct');
      } else {
        playSound('wrong');
      }
    } else {
      playSound('click');
    }

    updateProgress();
    renderNavigatorGrid();
    renderQuestion();
  }

  // Render Navigator Matrix
  function renderNavigatorGrid() {
    if (!el.navigatorGrid) return;
    el.navigatorGrid.innerHTML = '';

    QUESTIONS.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'matrix-btn';
      btn.type = 'button';
      btn.textContent = q.id;

      if (idx === state.currentIndex) {
        btn.classList.add('current');
      }

      const ans = state.userAnswers[idx];
      if (state.mode === 'exam' && state.isSubmitted) {
        if (ans === q.answer) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
        }
      } else {
        if (ans !== null) {
          btn.classList.add('answered');
        }
      }

      if (state.flagged.has(idx)) {
        btn.classList.add('flagged');
      }

      btn.addEventListener('click', () => {
        playSound('click');
        state.currentIndex = idx;
        renderQuestion();
      });

      el.navigatorGrid.appendChild(btn);
    });
  }

  // Update Progress Bar
  function updateProgress() {
    const answeredCount = state.userAnswers.filter(a => a !== null).length;
    const total = QUESTIONS.length;
    const pct = Math.round((answeredCount / total) * 100);

    if (el.progressCount) el.progressCount.textContent = `${answeredCount} / ${total} 題`;
    if (el.progressPercentage) el.progressPercentage.textContent = `${pct}%`;
    if (el.progressBarFill) el.progressBarFill.style.width = `${pct}%`;
  }

  // Submit Exam
  function submitExam() {
    stopTimer();
    state.isSubmitted = true;

    // Calculate score
    let correctCount = 0;
    let wrongCount = 0;

    QUESTIONS.forEach((q, idx) => {
      if (state.userAnswers[idx] === q.answer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const score = correctCount * QUIZ_INFO.pointsPerQuestion;

    // Time spent calculation
    const elapsedSeconds = (QUIZ_INFO.defaultTimeMinutes * 60) - state.timerSeconds;
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const timeSpentText = `${mins} 分 ${secs} 秒`;

    // Fill Result Modal
    el.resScore.textContent = score;
    el.resCorrectCount.textContent = correctCount;
    el.resWrongCount.textContent = wrongCount;
    el.resTimeSpent.textContent = timeSpentText;

    let feedback = "";
    if (score === 100) {
      feedback = "🎉 太出色了！滿分 100 分！你對系統平台硬體架構完全掌握！";
      playSound('victory');
      launchConfetti();
    } else if (score >= 80) {
      feedback = "🌟 非常優秀！成績達到優等，只差一點就滿分了！";
      playSound('victory');
      launchConfetti();
    } else if (score >= 60) {
      feedback = "👍 及格達標！建議針對答錯的觀念進行重點複習！";
      playSound('correct');
    } else {
      feedback = "💪 再接再厲！建議切換至「全題詳解速讀」模式扎實打好基礎！";
      playSound('wrong');
    }
    el.resFeedbackText.textContent = feedback;

    // Show result modal
    openModal(el.modalResult);
    renderNavigatorGrid();
    renderQuestion();
  }

  // Study Mode List Rendering
  function renderStudyModeList() {
    if (!el.studyQuestionsList) return;
    el.studyQuestionsList.innerHTML = '';

    const query = state.studySearchQuery.toLowerCase().trim();
    const cat = state.studyCategoryFilter;
    const onlyMistakes = state.studyOnlyMistakes;

    const filtered = QUESTIONS.filter((q, idx) => {
      if (cat !== 'all' && q.category !== cat) return false;
      if (onlyMistakes && state.userAnswers[idx] === q.answer) return false;
      if (query) {
        const fullContent = (q.question + q.category + q.options.map(o => o.text).join('') + q.explanation).toLowerCase();
        if (!fullContent.includes(query)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      el.studyQuestionsList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <div>未找到符合條件的題目，請嘗試其他關鍵字或分類。</div>
        </div>
      `;
      return;
    }

    filtered.forEach(q => {
      const card = document.createElement('div');
      card.className = 'question-card';
      card.style.marginBottom = '1.25rem';

      const optionsHtml = q.options.map(opt => {
        const isAnswer = opt.key === q.answer;
        return `
          <div class="option-btn ${isAnswer ? 'correct-reveal' : ''}" style="cursor: default; pointer-events: none;">
            <span class="option-key">${opt.key}</span>
            <span class="option-text">${opt.text} ${isAnswer ? '✓' : ''}</span>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="q-header">
          <div class="q-badge-wrap">
            <span class="q-num">第 ${q.id} 題</span>
            <span class="q-topic">${q.category} · 第${q.page}頁</span>
          </div>
        </div>
        <div class="q-stem">${q.question}</div>
        <div class="options-list">${optionsHtml}</div>
        <div class="explanation-box show" style="margin-top: 1.25rem;">
          <div class="explanation-title">💡 觀念詳解與考點分析</div>
          <div class="explanation-content">${q.explanation}</div>
        </div>
      `;
      el.studyQuestionsList.appendChild(card);
    });
  }

  // Modals helper
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('open');
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
  }

  // Event Listeners Binding
  function bindEvents() {
    // Mode Switching
    el.btnModeExam?.addEventListener('click', () => {
      playSound('click');
      setMode('exam');
    });

    el.btnModePractice?.addEventListener('click', () => {
      playSound('click');
      setMode('practice');
    });

    el.btnModeStudy?.addEventListener('click', () => {
      playSound('click');
      setMode('study');
    });

    // Theme & Sound Toggle
    el.btnToggleTheme?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('site_theme', next);
      updateThemeIcon();
      playSound('click');
    });

    el.btnToggleSound?.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('sound_enabled', state.soundEnabled);
      updateSoundIcon();
      if (state.soundEnabled) playSound('click');
    });

    // Navigation Buttons
    el.btnPrev?.addEventListener('click', () => {
      if (state.currentIndex > 0) {
        playSound('click');
        state.currentIndex--;
        renderQuestion();
      }
    });

    el.btnNext?.addEventListener('click', () => {
      if (state.currentIndex < QUESTIONS.length - 1) {
        playSound('click');
        state.currentIndex++;
        renderQuestion();
      }
    });

    // Flag Button
    el.btnFlag?.addEventListener('click', () => {
      playSound('click');
      if (state.flagged.has(state.currentIndex)) {
        state.flagged.delete(state.currentIndex);
      } else {
        state.flagged.add(state.currentIndex);
      }
      renderQuestion();
      renderNavigatorGrid();
    });

    // Submit Exam Flow
    el.btnSubmitExam?.addEventListener('click', () => {
      playSound('click');
      const unattempted = state.userAnswers.filter(a => a === null).length;
      const confirmMsgEl = document.getElementById('submit-confirm-msg');
      if (confirmMsgEl) {
        if (unattempted > 0) {
          confirmMsgEl.innerHTML = `⚠️ 目前尚有 <strong style="color:var(--danger);font-size:1.1rem;">${unattempted}</strong> 題尚未作答！<br>確定現在就要送出試卷進行評分嗎？`;
        } else {
          confirmMsgEl.innerHTML = `✅ 您已完成全部 25 道題目！<br>確定要立即交卷取得測驗成績與分析嗎？`;
        }
      }
      openModal(el.modalSubmitConfirm);
    });

    document.getElementById('btn-confirm-submit')?.addEventListener('click', () => {
      closeModal(el.modalSubmitConfirm);
      submitExam();
    });

    document.getElementById('btn-cancel-submit')?.addEventListener('click', () => {
      closeModal(el.modalSubmitConfirm);
    });

    // Result Actions
    el.btnReviewExam?.addEventListener('click', () => {
      closeModal(el.modalResult);
      state.currentIndex = 0;
      renderQuestion();
    });

    el.btnRetakeExam?.addEventListener('click', () => {
      closeModal(el.modalResult);
      startExam();
    });

    el.btnReviewMistakesOnly?.addEventListener('click', () => {
      closeModal(el.modalResult);
      setMode('study');
      state.studyOnlyMistakes = true;
      if (el.studyFilterMistakesOnly) el.studyFilterMistakesOnly.checked = true;
      renderStudyModeList();
    });

    // Original Sheet Viewer Modal
    el.btnViewSheets?.addEventListener('click', () => {
      playSound('click');
      setSheetIndex(0);
      openModal(el.modalSheetViewer);
    });

    el.sheetTab0?.addEventListener('click', () => setSheetIndex(0));
    el.sheetTab1?.addEventListener('click', () => setSheetIndex(1));

    function setSheetIndex(idx) {
      state.sheetIndex = idx;
      el.sheetTab0?.classList.toggle('active', idx === 0);
      el.sheetTab1?.classList.toggle('active', idx === 1);
      if (el.sheetImage) {
        el.sheetImage.src = QUIZ_INFO.originalSheets[idx].src;
        el.sheetImage.alt = QUIZ_INFO.originalSheets[idx].title;
      }
    }

    // Modal close buttons (X buttons & background click)
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-backdrop');
        closeModal(modal);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Study Mode Filters
    el.studySearchInput?.addEventListener('input', (e) => {
      state.studySearchQuery = e.target.value;
      renderStudyModeList();
    });

    el.studyCategorySelect?.addEventListener('change', (e) => {
      state.studyCategoryFilter = e.target.value;
      renderStudyModeList();
    });

    el.studyFilterMistakesOnly?.addEventListener('change', (e) => {
      state.studyOnlyMistakes = e.target.checked;
      renderStudyModeList();
    });

    // Keyboard Shortcuts (Arrow keys for Prev/Next, A/B/C/D for answering)
    window.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if inside search input
      if (document.activeElement === el.studySearchInput) return;

      if (e.key === 'ArrowLeft') {
        el.btnPrev?.click();
      } else if (e.key === 'ArrowRight') {
        el.btnNext?.click();
      } else if (['a', 'A', '1'].includes(e.key)) {
        handleOptionSelect('A');
      } else if (['b', 'B', '2'].includes(e.key)) {
        handleOptionSelect('B');
      } else if (['c', 'C', '3'].includes(e.key)) {
        handleOptionSelect('C');
      } else if (['d', 'D', '4'].includes(e.key)) {
        handleOptionSelect('D');
      }
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

