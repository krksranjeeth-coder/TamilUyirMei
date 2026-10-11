/**
 * TamilUyirMei - Animated Uyir-Mei Learning Lab
 * Main Application Logic & Animation Engine
 */

(function () {
  'use strict';

  // State
  let selectedMeiIndex = 0;   // default: க் (k)
  let selectedUyirIndex = 1;  // default: ஆ (aa) -> கா
  let currentStep = 0;        // 0 to 4
  let isPlaying = false;
  let playTimer = null;
  let animationSpeed = 1.0;

  // Drawing Pad State
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentColor = '#FF5E57';
  let strokeHistory = [];
  let currentStroke = [];
  let showNotebookGuide = true;

  // Quiz State
  let quizScore = 0;
  let currentQuizTarget = null;

  // All sound permanently removed per request
  const soundEnabled = false;
  function playSoundTone() {}
  function playMagicChime() {}
  function playSuccessCheer() {}
  function speakTamilText() {}

  // DOM Elements
  const meiStrip = document.getElementById('meiStrip');
  const approachClustersGrid = document.getElementById('approachClustersGrid');
  const selectedMeiBadge = document.getElementById('selectedMeiBadge');
  const selectedUyirBadge = document.getElementById('selectedUyirBadge');

  const eqMeiGlyph = document.getElementById('eqMeiGlyph');
  const eqUyirGlyph = document.getElementById('eqUyirGlyph');
  const eqResultGlyph = document.getElementById('eqResultGlyph');

  const animCanvas = document.getElementById('animationCanvas');
  const animCtx = animCanvas.getContext('2d');
  const animStageBadge = document.getElementById('animStageBadge');

  const btnPlay = document.getElementById('btnPlay');
  const btnReplay = document.getElementById('btnReplay');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnNextStep = document.getElementById('btnNextStep');
  const stepNodes = document.querySelectorAll('.step-node');

  const formulaCard = document.getElementById('formulaCard');
  const formulaTitle = document.getElementById('formulaTitle');
  const formulaTamilText = document.getElementById('formulaTamilText');
  const formulaEnglishText = document.getElementById('formulaEnglishText');

  const strokeGuideCard = document.getElementById('strokeGuideCard');
  const strokePositionBadge = document.getElementById('strokePositionBadge');
  const strokeStepsList = document.getElementById('strokeStepsList');

  const practiceCanvas = document.getElementById('practiceCanvas');
  const practiceCtx = practiceCanvas.getContext('2d');
  const ghostLetter = document.getElementById('ghostLetter');
  const ruledLinesGuide = document.getElementById('ruledLinesGuide');
  const colorDots = document.querySelectorAll('.color-dot');
  const btnClearDraw = document.getElementById('btnClearDraw');
  const btnUndoDraw = document.getElementById('btnUndoDraw');
  const btnToggleGuide = document.getElementById('btnToggleGuide');
  const btnDonePractice = document.getElementById('btnDonePractice');

  const vocabEmoji = document.getElementById('vocabEmoji');
  const vocabWord = document.getElementById('vocabWord');
  const vocabEnglish = document.getElementById('vocabEnglish');
  const vocabSentence = document.getElementById('vocabSentence');
  const vocabSentenceEnglish = document.getElementById('vocabSentenceEnglish');

  const btnDownloadMp4 = document.getElementById('btnDownloadMp4');
  const btnDownloadMp4Text = document.getElementById('btnDownloadMp4Text');
  const btnDownloadCard = document.getElementById('btnDownloadCard');
  const btnDownloadCardText = document.getElementById('btnDownloadCardText');

  const btnDownloadGif = document.getElementById('btnDownloadGif');
  const btnDownloadGifText = document.getElementById('btnDownloadGifText');
  const btnDownloadMeiZip = document.getElementById('btnDownloadMeiZip');
  const btnDownloadMeiZipText = document.getElementById('btnDownloadMeiZipText');
  const btnDownloadAllZip = document.getElementById('btnDownloadAllZip');
  const btnDownloadPng = document.getElementById('btnDownloadPng');

  const progressModal = document.getElementById('progressModal');
  const progressIcon = document.getElementById('progressIcon');
  const progressTitle = document.getElementById('progressTitle');
  const progressSub = document.getElementById('progressSub');
  const progressBarOuter = document.getElementById('progressBarOuter');
  const progressBarInner = document.getElementById('progressBarInner');
  const progressPercent = document.getElementById('progressPercent');
  const progressSuccessBox = document.getElementById('progressSuccessBox');
  const progressPreviewContainer = document.getElementById('progressPreviewContainer');
  const progressSuccessMsg = document.getElementById('progressSuccessMsg');
  const btnDirectDownloadLink = document.getElementById('btnDirectDownloadLink');
  const btnDirectDownloadText = document.getElementById('btnDirectDownloadText');
  const btnSaveWithPicker = document.getElementById('btnSaveWithPicker');
  const btnCloseProgressModal = document.getElementById('btnCloseProgressModal');

  const btnOpenMatrix = document.getElementById('btnOpenMatrix');
  const btnCloseMatrixModal = document.getElementById('btnCloseMatrixModal');
  const matrixModal = document.getElementById('matrixModal');
  const tamilMatrixTable = document.getElementById('tamilMatrixTable');

  const btnOpenCheatSheet = document.getElementById('btnOpenCheatSheet');
  const btnCloseCheatModal = document.getElementById('btnCloseCheatModal');
  const cheatSheetModal = document.getElementById('cheatSheetModal');
  const cheatSheetContent = document.getElementById('cheatSheetContent');

  const btnOpenQuiz = document.getElementById('btnOpenQuiz');
  const btnCloseQuizModal = document.getElementById('btnCloseQuizModal');
  const quizModal = document.getElementById('quizModal');
  const quizQuestionFormula = document.getElementById('quizQuestionFormula');
  const quizOptionsGrid = document.getElementById('quizOptionsGrid');
  const quizFeedbackMessage = document.getElementById('quizFeedbackMessage');
  const quizScoreStars = document.getElementById('quizScoreStars');

  // Initialize
  function init() {
    renderMeiStrip('all');
    renderApproachClusters();
    initFilters();
    initAnimationControls();
    initPracticePad();
    initMatrixModal();
    initCheatSheetModal();
    initQuiz();
    initExportButtons();

    updateActiveSelection();
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
  }

  // Render Mei Consonant Strip
  function renderMeiStrip(filter = 'all') {
    meiStrip.innerHTML = '';
    MEI_LETTERS.forEach((item, index) => {
      if (filter !== 'all' && item.groupType !== filter) return;

      const btn = document.createElement('button');
      btn.className = `letter-btn ${index === selectedMeiIndex ? 'active' : ''}`;
      btn.dataset.index = index;
      btn.innerHTML = `
        <span class="char">${item.mei}</span>
        <span class="sub">${item.name}</span>
        <span class="eng-phonics" style="font-size:11px; color:#64748B; font-weight:700;">/${item.english}/</span>
      `;
      btn.addEventListener('click', () => {
        selectedMeiIndex = index;
        updateActiveSelection();
      });
      meiStrip.appendChild(btn);
    });
  }

  // Render 6 Approach Clusters Grid (வடிவக் குழுக்கள்)
  function renderApproachClusters() {
    if (!approachClustersGrid) return;
    approachClustersGrid.innerHTML = '';
    const currentMei = MEI_LETTERS[selectedMeiIndex];

    APPROACH_GROUPS.forEach(group => {
      const vowelsInGroup = UYIR_LETTERS.filter(u => u.approachId === group.id);
      const isCurrentCluster = vowelsInGroup.some(u => UYIR_LETTERS.indexOf(u) === selectedUyirIndex);

      const card = document.createElement('div');
      card.className = `cluster-card ${isCurrentCluster ? 'active-cluster' : ''}`;
      card.style.setProperty('--cluster-color', group.color);

      // Header
      const header = document.createElement('div');
      header.className = 'cluster-header';
      header.innerHTML = `
        <div class="cluster-title-wrap">
          <span class="cluster-icon">${group.icon}</span>
          <div style="display:flex; flex-direction:column; text-align:left;">
            <span class="cluster-title">${group.shortName}</span>
            <span style="font-size:11px; color:#64748B; font-weight:600;">${group.name.split('(')[1]?.replace(')', '') || ''}</span>
          </div>
        </div>
        <span class="cluster-position-badge">${group.ruleTitle}</span>
      `;
      card.appendChild(header);

      // Buttons Row for vowels in this cluster
      const buttonsRow = document.createElement('div');
      buttonsRow.className = 'cluster-buttons-row';

      vowelsInGroup.forEach(u => {
        const uIdx = UYIR_LETTERS.indexOf(u);
        const isActive = (uIdx === selectedUyirIndex);
        const sampleCombined = currentMei.base + u.sign;

        const vBtn = document.createElement('button');
        vBtn.className = `cluster-vowel-btn ${isActive ? 'active' : ''}`;
        vBtn.dataset.uyirIndex = uIdx;

        const signLabel = u.sign ? `[ ${u.sign} ]` : '(Dot leaves)';
        vBtn.innerHTML = `
          <span class="v-char">${u.uyir}</span>
          <span class="v-sign">${signLabel}</span>
          <span class="v-example">${sampleCombined} (/${u.english}/)</span>
        `;

        vBtn.addEventListener('click', () => {
          selectedUyirIndex = uIdx;
          updateActiveSelection();
        });

        buttonsRow.appendChild(vBtn);
      });

      card.appendChild(buttonsRow);
      approachClustersGrid.appendChild(card);
    });
  }

  // Filter Buttons
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        renderMeiStrip(filter);
      });
    });
  }

  // Update Main Selection
  function updateActiveSelection() {
    const meiObj = MEI_LETTERS[selectedMeiIndex];
    const uyirObj = UYIR_LETTERS[selectedUyirIndex];
    const details = getLetterDetails(meiObj, uyirObj);

    // Update active highlights in Mei strip
    document.querySelectorAll('#meiStrip .letter-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.index) === selectedMeiIndex);
    });

    // Re-render Approach Clusters so sample letters and active highlights update
    renderApproachClusters();

    // Update Badges & Equation Bar
    selectedMeiBadge.textContent = `${meiObj.mei} (${meiObj.group})`;
    selectedUyirBadge.textContent = `${uyirObj.uyir} (${details.approach.shortName})`;

    eqMeiGlyph.textContent = meiObj.mei;
    eqUyirGlyph.textContent = uyirObj.uyir;
    eqResultGlyph.textContent = details.combined;

    // Update Formula Card
    formulaTitle.textContent = `சூத்திரம் (${details.approach.name}):`;
    formulaTamilText.textContent = uyirObj.formulaTamil;
    formulaEnglishText.textContent = uyirObj.formulaEnglish;
    formulaEnglishText.textContent = uyirObj.formulaEnglish;

    // Update Stroke Guide Card
    strokePositionBadge.textContent = uyirObj.positionLabel;
    renderStrokeSteps(details.steps, uyirObj.writingRule);

    // Update Ghost Letter in Practice Pad
    ghostLetter.textContent = details.combined;

    // Update Vocabulary
    vocabEmoji.textContent = details.vocab.emoji || '⭐';
    vocabWord.textContent = details.vocab.word;
    vocabEnglish.textContent = details.vocab.english;
    vocabSentence.textContent = details.vocab.sentence;
    if (vocabSentenceEnglish) {
      vocabSentenceEnglish.textContent = details.vocab.sentenceEnglish || '';
    }

    // Update Download Button labels with actual letter names
    if (btnDownloadMp4Text) {
      btnDownloadMp4Text.textContent = `${details.combined}.mp4 • Video (Pause & Learn)`;
    }
    if (btnDownloadCardText) {
      btnDownloadCardText.textContent = `${details.combined} • 4-Step Card (PNG)`;
    }
    if (btnDownloadGifText) {
      btnDownloadGifText.textContent = `${details.combined}.gif • Animated GIF`;
    }
    if (btnDownloadMeiZipText) {
      btnDownloadMeiZipText.textContent = `${meiObj.mei} வரிசை • 12 Letters (ZIP)`;
    }

    // Reset Animation Step
    currentStep = 0;
    updateStepIndicators();
    drawAnimationCanvas();
  }

  // Render Stroke Steps
  function renderStrokeSteps(steps, ruleText) {
    strokeStepsList.innerHTML = '';

    steps.forEach((s, idx) => {
      const item = document.createElement('div');
      item.className = 'stroke-step-item';
      item.innerHTML = `
        <div class="step-num-badge">${idx + 1}</div>
        <div class="step-part-preview">${s.part}</div>
        <div class="step-text">
          <div class="step-tamil" style="font-weight:700; color:#1E293B; font-size:14px;">${s.text}</div>
          <div class="step-english" style="font-weight:500; color:#64748B; font-size:12px; margin-top:2px;">${s.englishText || ''}</div>
        </div>
      `;
      strokeStepsList.appendChild(item);
    });

    if (ruleText) {
      const tipItem = document.createElement('div');
      tipItem.style.cssText = 'padding:10px 14px; background:#FEF9E7; border-radius:12px; font-size:13px; color:#854D0E; font-weight:600; line-height:1.4;';
      tipItem.innerHTML = `💡 <strong>குறிப்பு / Tip:</strong> ${ruleText}`;
      strokeStepsList.appendChild(tipItem);
    }
  }

  // Animation Controls
  function initAnimationControls() {
    btnPlay.addEventListener('click', () => {
      if (isPlaying) {
        pauseAnimation();
      } else {
        startAnimation();
      }
    });

    btnReplay.addEventListener('click', () => {
      pauseAnimation();
      currentStep = 0;
      updateStepIndicators();
      drawAnimationCanvas();
    });

    btnPrevStep.addEventListener('click', () => {
      pauseAnimation();
      if (currentStep > 0) {
        currentStep--;
        updateStepIndicators();
        drawAnimationCanvas();
      }
    });

    btnNextStep.addEventListener('click', () => {
      pauseAnimation();
      if (currentStep < 4) {
        currentStep++;
        updateStepIndicators();
        drawAnimationCanvas();
      }
    });

    stepNodes.forEach((node, idx) => {
      node.addEventListener('click', () => {
        pauseAnimation();
        currentStep = idx;
        updateStepIndicators();
        drawAnimationCanvas();
      });
    });

    // Speed buttons
    const speedBtns = document.querySelectorAll('.speed-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        animationSpeed = parseFloat(btn.dataset.speed);
        if (isPlaying) {
          pauseAnimation();
          startAnimation();
        }
      });
    });
  }

  function startAnimation() {
    isPlaying = true;
    btnPlay.textContent = '⏸️';
    btnPlay.title = 'நிறுத்து (Pause)';

    const stepInterval = Math.round(1800 / animationSpeed);
    playTimer = setInterval(() => {
      if (currentStep < 4) {
        currentStep++;
        updateStepIndicators();
        drawAnimationCanvas();
      } else {
        // loop back to 0
        currentStep = 0;
        updateStepIndicators();
        drawAnimationCanvas();
      }
    }, stepInterval);
  }

  function pauseAnimation() {
    isPlaying = false;
    btnPlay.textContent = '▶️';
    btnPlay.title = 'இயக்கு';
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  }

  function updateStepIndicators() {
    stepNodes.forEach((node, idx) => {
      node.classList.toggle('active', idx === currentStep);
      node.classList.toggle('completed', idx < currentStep);
    });

    const stageNames = [
      'படி 1 / Step 1: மெய் • Base Consonant with Dot',
      'படி 2 / Step 2: உயிர் • Vowel Arrives',
      'படி 3 / Step 3: சூத்திரம் • The Magic Rule',
      'படி 4 / Step 4: மாற்றம் • Joining Hands',
      'படி 5 / Step 5: உயிர்மெய் • New Letter & Word!'
    ];
    animStageBadge.textContent = stageNames[currentStep] || '';
  }

  // Draw Main Animation Canvas
  function drawAnimationCanvas() {
    const width = animCanvas.width;
    const height = animCanvas.height;
    animCtx.clearRect(0, 0, width, height);

    const meiObj = MEI_LETTERS[selectedMeiIndex];
    const uyirObj = UYIR_LETTERS[selectedUyirIndex];
    const details = getLetterDetails(meiObj, uyirObj);

    // Background style
    animCtx.fillStyle = '#FFFFFF';
    animCtx.fillRect(0, 0, width, height);

    // Decorative subtle grid or dots
    animCtx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let x = 20; x < width; x += 30) {
      for (let y = 20; y < height; y += 30) {
        animCtx.beginPath();
        animCtx.arc(x, y, 1.5, 0, Math.PI * 2);
        animCtx.fill();
      }
    }

    // Step-specific drawing
    if (currentStep === 0) {
      // Step 0: Mei alone with pulsating pulli
      drawMeiIntro(animCtx, width, height, meiObj);
    } else if (currentStep === 1) {
      // Step 1: Mei + Uyir arrival
      drawMeiAndUyirMeeting(animCtx, width, height, meiObj, uyirObj);
    } else if (currentStep === 2) {
      // Step 2: Formula callout
      drawFormulaStage(animCtx, width, height, meiObj, uyirObj);
    } else if (currentStep === 3) {
      // Step 3: Transformation magic (pulli flies up, modifier slides in)
      drawTransformationMagic(animCtx, width, height, meiObj, uyirObj);
    } else {
      // Step 4: Final combined Uyirmei with writing order numbers & crown
      drawCompletedUyirmei(animCtx, width, height, details);
    }
  }

  // Step 0: Mei Consonant Intro
  function drawMeiIntro(ctx, w, h, mei) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title label
    ctx.font = '700 16px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('1. மெய் எழுத்து • Base Consonant with Dot', w / 2, 38);

    // Base letter with prominent Pulli
    ctx.font = '900 110px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FF5E57';
    ctx.fillText(mei.mei, w / 2, h / 2 + 10);

    // Sparkle halo around pulli
    ctx.fillStyle = '#FFD32A';
    ctx.font = '24px sans-serif';
    ctx.fillText('✨', w / 2 + 50, h / 2 - 55);
    ctx.fillText('⭐', w / 2 - 60, h / 2 - 45);

    // Subtitle note
    ctx.font = '700 15px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText(`"${mei.name}" (/${mei.english}/) - தலையில் புள்ளி கொண்ட எழுத்து!`, w / 2, h - 40);

    ctx.font = '500 13px "Outfit", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('This is our base letter! Notice the tiny dot (Pulli) sitting on top.', w / 2, h - 18);
  }

  // Step 1: Mei + Uyir Meeting
  function drawMeiAndUyirMeeting(ctx, w, h, mei, uyir) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = '700 16px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('2. உயிரும் மெய்யும் இணைதல் • Meeting the Vowel', w / 2, 35);

    // Mei on left
    ctx.font = '900 85px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FF5E57';
    ctx.fillText(mei.mei, w / 2 - 130, h / 2);

    // Plus sign
    ctx.font = '700 44px sans-serif';
    ctx.fillStyle = '#A0AEC0';
    ctx.fillText('+', w / 2, h / 2);

    // Uyir on right
    ctx.font = '900 85px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#54A0FF';
    ctx.fillText(uyir.uyir, w / 2 + 130, h / 2);

    // Labels under each
    ctx.font = '700 13px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#718096';
    ctx.fillText(`மெய் (${mei.name} /${mei.english}/)`, w / 2 - 130, h / 2 + 60);
    ctx.fillText(`உயிர் (${uyir.name} /${uyir.english}/)`, w / 2 + 130, h / 2 + 60);

    ctx.font = '700 14px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#2C3A47';
    ctx.fillText('இரு எழுத்துக்களும் கூடி புதிய உயிர்மெய் ஒலியை உருவாக்கப் போகின்றன!', w / 2, h - 38);

    ctx.font = '500 13px "Outfit", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('They are getting ready to join hands and form a brand-new sound!', w / 2, h - 18);
  }

  // Helper to wrap canvas text safely so it never clips off-screen
  function drawWrappedText(ctx, text, x, startY, maxWidth, lineHeight) {
    if (!text) return startY;
    const words = text.split(' ');
    let line = '';
    let y = startY;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
    return y;
  }

  // Step 2: Formula Stage (Zero overlapping, perfectly spaced visual equation and wrapped rule card)
  function drawFormulaStage(ctx, w, h, mei, uyir) {
    const details = getLetterDetails(mei, uyir);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Magic wand banner
    ctx.font = '700 16px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#B7791F';
    ctx.fillText(`3. மாயாஜாலச் சூத்திரம் • The Magic Rule: ${uyir.signName}`, w / 2, 30);

    // Box highlight in center
    ctx.fillStyle = 'rgba(254, 243, 199, 0.75)';
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(25, 46, w - 50, 142, 18);
    ctx.fill();
    ctx.stroke();

    // Visual equation row
    ctx.font = '900 48px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FF5E57';
    ctx.fillText(mei.mei, 95, 98);

    ctx.font = '700 28px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('+', 175, 98);

    ctx.font = '900 48px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#54A0FF';
    ctx.fillText(uyir.uyir, 265, 98);

    ctx.font = '700 28px sans-serif';
    ctx.fillStyle = '#D97706';
    ctx.fillText('➔', 365, 98);

    ctx.font = '900 52px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#10AC84';
    ctx.fillText(details.combined, 475, 98);

    // Rule explanation badge inside the box (y = 155)
    let ruleBadgeText = '';
    let ruleBadgeEnglish = '';
    if (uyir.approachId === 'dot_drop') {
      ruleBadgeText = `விதி: புள்ளி நீங்கும் ➔ '${details.combined}' மட்டும் நிற்கும்`;
      ruleBadgeEnglish = 'Dot vanishes, base letter stays';
    } else if (uyir.approachId === 'right_side') {
      ruleBadgeText = `விதி: வலதுபுறம் துணைக்கால் (ா) சேரும் ➔ '${details.combined}'`;
      ruleBadgeEnglish = 'Side-leg (ா) joins on right';
    } else if (uyir.approachId === 'top_roof') {
      ruleBadgeText = `விதி: தலைமேல் ${uyir.signName} ஏறும் ➔ '${details.combined}'`;
      ruleBadgeEnglish = 'Roof hook curls over head';
    } else if (uyir.approachId === 'bottom_curves') {
      ruleBadgeText = `விதி: பாதத்தில் ${uyir.signName} சேரும் ➔ '${details.combined}'`;
      ruleBadgeEnglish = 'Hook loops under the foot';
    } else if (uyir.approachId === 'front_horns') {
      ruleBadgeText = `விதி: எழுத்துக்கு முன்னால் ${uyir.signName} நிற்கும் ➔ '${details.combined}'`;
      ruleBadgeEnglish = 'Front horn stands before letter';
    } else if (uyir.approachId === 'surround') {
      ruleBadgeText = `சாண்ட்விச்: முன்னும் பின்னும் அணைக்கும் ➔ '${details.combined}'`;
      ruleBadgeEnglish = 'Sandwich! Front horn + letter + back leg';
    }

    // Draw rule badge pill
    ctx.font = '700 13px "Noto Sans Tamil", sans-serif';
    const combinedPillText = `${ruleBadgeText} (${ruleBadgeEnglish})`;
    const badgeWidth = Math.min(w - 70, ctx.measureText(combinedPillText).width + 24);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - badgeWidth / 2, 140, badgeWidth, 28, 14);
    ctx.fill();

    ctx.fillStyle = '#92400E';
    ctx.fillText(combinedPillText, w / 2, 154);

    // Formula explanation below the box (auto-wrapping)
    ctx.font = '600 14px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#451A03';
    drawWrappedText(ctx, uyir.formulaTamil, w / 2, 222, w - 60, 20);

    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.fillStyle = '#78350F';
    drawWrappedText(ctx, `Magic Rule for Kids: ${uyir.formulaEnglish}`, w / 2, 268, w - 60, 18);
  }

  // Step 3: Transformation Magic (3 distinct columns: Left=120, Center=295, Right=475, safe margin to 680)
  function drawTransformationMagic(ctx, w, h, mei, uyir) {
    const details = getLetterDetails(mei, uyir);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = '700 17px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#5F27CD';
    ctx.fillText('✨ 4. குறியீடு இணைப்பு • Watch Them Join Together! ✨', w / 2, 32);

    // Column 1: Base letter + Flying Pulli (x = 120)
    ctx.font = '900 66px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#2C3A47';
    ctx.fillText(mei.base, 120, 125);

    // Floating dot with sparkles
    ctx.fillStyle = '#FF5E57';
    ctx.beginPath();
    ctx.arc(128, 68, 6.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFD32A';
    ctx.font = '20px sans-serif';
    ctx.fillText('✨', 156, 62);
    ctx.fillText('💫', 100, 60);

    ctx.font = '700 13px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FF5E57';
    ctx.fillText('1. புள்ளி பறக்கிறது', 120, 178);
    ctx.font = '600 11px "Outfit", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`Dot lifts off (Base: ${mei.base})`, 120, 196);

    // Column 2: Joining Connector & Arrow (x = 295)
    ctx.font = '700 13px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#059669';

    let connectorLabel = '';
    if (uyir.approachId === 'dot_drop') {
      connectorLabel = 'புள்ளி நீக்கம் (No mark)';
    } else if (uyir.approachId === 'right_side') {
      connectorLabel = '+ துணைக்கால் (ா)';
    } else if (uyir.approachId === 'top_roof') {
      connectorLabel = `+ ${uyir.signName}`;
    } else if (uyir.approachId === 'bottom_curves') {
      connectorLabel = `+ ${uyir.signName}`;
    } else if (uyir.approachId === 'front_horns') {
      connectorLabel = `+ ${uyir.signName}`;
    } else if (uyir.approachId === 'surround') {
      if (uyir.id === 'o') {
        connectorLabel = 'கொம்பு (ெ) + நடுவில் + துணைக்கால் (ா)';
      } else if (uyir.id === 'oo') {
        connectorLabel = 'கொம்பு (ே) + நடுவில் + துணைக்கால் (ா)';
      } else {
        connectorLabel = 'கொம்பு (ெ) + நடுவில் + கொம்புக்கால் (ள)';
      }
    }

    ctx.fillText('குறியீடு இணைப்பு', 295, 88);

    ctx.font = '700 34px sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText('➔', 295, 125);

    ctx.font = '700 12px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#0D9488';
    ctx.fillText(connectorLabel, 295, 165);

    // Column 3: Completed Uyirmei Letter (x = 475)
    ctx.font = '900 66px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#10AC84';
    ctx.fillText(details.combined, 475, 125);

    ctx.font = '24px sans-serif';
    ctx.fillText('🌟', 475, 68);

    ctx.font = '700 14px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText(`2. புதிய உயிர்மெய்: ${details.combined}`, 475, 178);
    ctx.font = '600 12px "Outfit", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`New Letter (/${details.combined}/)`, 475, 196);

    // Bottom explanation note (auto-wrapping)
    ctx.font = '600 14px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#2C3A47';
    let bottomExplanation = '';
    if (uyir.approachId === 'surround') {
      bottomExplanation = `சாண்ட்விச் முறை: முன்னும் பின்னும் அடையாளங்கள் அணைத்து '${details.combined}' ஆகிறது!`;
    } else if (uyir.approachId === 'front_horns') {
      bottomExplanation = `கொம்பு எழுத்துக்கு முன்னால் வந்து நின்று '${details.combined}' என மலர்கிறது!`;
    } else if (uyir.approachId === 'top_roof') {
      bottomExplanation = `மேல்விலங்கு தலைமேல் அழகாக அமர்ந்து '${details.combined}' உருவாகிறது!`;
    } else if (uyir.approachId === 'bottom_curves') {
      bottomExplanation = `கீழ்வடிவம் பாதத்தில் இணைந்து '${details.combined}' பிறக்கிறது!`;
    } else if (uyir.approachId === 'right_side') {
      bottomExplanation = `துணைக்கால் (ா) வலதுபுறம் கை கோர்த்து '${details.combined}' ஆகிறது!`;
    } else {
      bottomExplanation = `புள்ளி நீங்கியதும் தூய அடிப்படை எழுத்து '${details.combined}' என மலர்கிறது!`;
    }
    drawWrappedText(ctx, bottomExplanation, w / 2, 236, w - 60, 20);

    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.fillStyle = '#64748B';
    drawWrappedText(ctx, `Easy Rule: ${uyir.formulaEnglish}`, w / 2, 276, w - 60, 18);
  }

  // Step 4: Completed Uyirmei & Writing Order
  function drawCompletedUyirmei(ctx, w, h, details) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Celebration header
    ctx.font = '700 17px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#10AC84';
    ctx.fillText('🎉 5. உயிர்மெய் பிறந்தது • Letter & Word Complete! 🎉', w / 2, 32);

    // Large glowing letter
    ctx.font = '900 95px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#10AC84';
    ctx.fillText(details.combined, w / 2, h / 2 - 2);

    // Crown on top
    ctx.font = '24px sans-serif';
    ctx.fillText('👑', w / 2, h / 2 - 70);

    // Vocabulary word row
    ctx.font = '700 16px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText(`${details.vocab.emoji} சொல்: ${details.vocab.word} = ${details.vocab.english}`, w / 2, h - 70);

    // Writing sequence footer
    ctx.font = '600 13px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#475569';
    drawWrappedText(ctx, `எழுதும் முறை (Steps): ${details.steps.map((s, i) => `${i + 1}. ${s.part}`).join(' ➔ ')} • ${details.vocab.sentenceEnglish || details.vocab.sentence}`, w / 2, h - 35, w - 60, 18);
  }

  // Practice Pad / Tracing Canvas Logic
  function initPracticePad() {
    // Canvas sizing
    const container = document.getElementById('practiceContainer');
    practiceCanvas.width = container.clientWidth || 380;
    practiceCanvas.height = 220;

    // Pointer events for mouse & touch
    practiceCanvas.addEventListener('pointerdown', startDraw);
    practiceCanvas.addEventListener('pointermove', drawMove);
    window.addEventListener('pointerup', endDraw);
    practiceCanvas.addEventListener('pointercancel', endDraw);

    // Color pickers
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentColor = dot.dataset.color;
      });
    });

    btnClearDraw.addEventListener('click', clearPracticeCanvas);
    btnUndoDraw.addEventListener('click', undoPracticeCanvas);

    btnToggleGuide.addEventListener('click', () => {
      showNotebookGuide = !showNotebookGuide;
      ruledLinesGuide.style.display = showNotebookGuide ? 'flex' : 'none';
      btnToggleGuide.textContent = showNotebookGuide ? 'கோடுகள் உண்டு' : 'வெற்றுத்தாள்';
    });

    btnDonePractice.addEventListener('click', () => {
      triggerConfetti();
      quizScore += 5;
      quizScoreStars.textContent = `⭐ ${quizScore}`;
      const msg = document.createElement('div');
      msg.textContent = '🌟 அருமை! Super! Beautiful Writing! (+5 Stars) 🌟';
      msg.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#10AC84; color:white; padding:12px 24px; border-radius:30px; font-weight:bold; z-index:99999; box-shadow:0 10px 30px rgba(0,0,0,0.2); animation:modalScaleUp 0.3s; font-family:"Noto Sans Tamil", sans-serif;';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2500);
    });
  }

  function startDraw(e) {
    isDrawing = true;
    const rect = practiceCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    currentStroke = [{ x: lastX, y: lastY, color: currentColor, size: 6 }];
  }

  function drawMove(e) {
    if (!isDrawing) return;
    const rect = practiceCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    practiceCtx.strokeStyle = currentColor;
    practiceCtx.lineWidth = 6;
    practiceCtx.lineCap = 'round';
    practiceCtx.lineJoin = 'round';

    practiceCtx.beginPath();
    practiceCtx.moveTo(lastX, lastY);
    practiceCtx.lineTo(x, y);
    practiceCtx.stroke();

    lastX = x;
    lastY = y;
    currentStroke.push({ x, y, color: currentColor, size: 6 });
  }

  function endDraw() {
    if (isDrawing) {
      isDrawing = false;
      if (currentStroke.length > 0) {
        strokeHistory.push([...currentStroke]);
        currentStroke = [];
      }
    }
  }

  function clearPracticeCanvas() {
    practiceCtx.clearRect(0, 0, practiceCanvas.width, practiceCanvas.height);
    strokeHistory = [];
  }

  function undoPracticeCanvas() {
    if (strokeHistory.length === 0) return;
    strokeHistory.pop();
    practiceCtx.clearRect(0, 0, practiceCanvas.width, practiceCanvas.height);

    for (let stroke of strokeHistory) {
      if (stroke.length < 2) continue;
      practiceCtx.strokeStyle = stroke[0].color;
      practiceCtx.lineWidth = stroke[0].size;
      practiceCtx.lineCap = 'round';
      practiceCtx.lineJoin = 'round';
      practiceCtx.beginPath();
      practiceCtx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        practiceCtx.lineTo(stroke[i].x, stroke[i].y);
      }
      practiceCtx.stroke();
    }
  }


  // 18 x 12 Full Matrix Modal
  function initMatrixModal() {
    btnOpenMatrix.addEventListener('click', () => {
      renderMatrixTable();
      matrixModal.classList.add('open');
    });

    btnCloseMatrixModal.addEventListener('click', () => {
      matrixModal.classList.remove('open');
    });

    matrixModal.addEventListener('click', (e) => {
      if (e.target === matrixModal) matrixModal.classList.remove('open');
    });
  }

  function renderMatrixTable() {
    let html = '<thead><tr><th>மெய் \\ உயிர்</th>';
    UYIR_LETTERS.forEach(u => {
      html += `<th>${u.uyir}</th>`;
    });
    html += '</tr></thead><tbody>';

    MEI_LETTERS.forEach((m, mIdx) => {
      html += `<tr><th>${m.mei}</th>`;
      UYIR_LETTERS.forEach((u, uIdx) => {
        const char = m.base + u.sign;
        const isActive = (mIdx === selectedMeiIndex && uIdx === selectedUyirIndex);
        html += `<td class="${isActive ? 'active-cell' : ''}" data-mei="${mIdx}" data-uyir="${uIdx}">${char}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';
    tamilMatrixTable.innerHTML = html;

    tamilMatrixTable.querySelectorAll('td').forEach(td => {
      td.addEventListener('click', () => {
        selectedMeiIndex = parseInt(td.dataset.mei);
        selectedUyirIndex = parseInt(td.dataset.uyir);
        updateActiveSelection();
        matrixModal.classList.remove('open');
      });
    });
  }

  // 12 Cheat Sheet Modal
  function initCheatSheetModal() {
    btnOpenCheatSheet.addEventListener('click', () => {
      renderCheatSheet();
      cheatSheetModal.classList.add('open');
    });

    btnCloseCheatModal.addEventListener('click', () => {
      cheatSheetModal.classList.remove('open');
    });

    cheatSheetModal.addEventListener('click', (e) => {
      if (e.target === cheatSheetModal) cheatSheetModal.classList.remove('open');
    });
  }

  function renderCheatSheet() {
    let html = '<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">';
    UYIR_LETTERS.forEach((u, idx) => {
      const example = 'க' + u.sign;
      const typeLabel = u.type === 'குறில்' ? 'குறில் (Short Vowel)' : 'நெடில் (Long Vowel)';
      html += `
        <div style="background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:16px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div>
              <span style="font-family:'Noto Sans Tamil'; font-size:26px; font-weight:800; color:#FF5E57;">${u.uyir}</span>
              <span style="font-family:'Outfit'; font-size:16px; font-weight:700; color:#475569; margin-left:8px;">/${u.english}/</span>
            </div>
            <span style="font-size:12px; font-weight:700; background:#E2E8F0; color:#334155; padding:4px 10px; border-radius:20px;">${typeLabel}</span>
          </div>
          <div style="font-family:'Noto Sans Tamil'; font-size:15px; font-weight:700; color:#2C3A47; margin-bottom:4px;">
            குறியீடு (Sign): <span style="color:#059669; font-size:18px;">${u.sign || '(இல்லை / None)'}</span> • ${u.signName} (${u.signEnglish || ''})
          </div>
          <div style="font-family:'Noto Sans Tamil'; font-size:14px; font-weight:700; color:#5F27CD; margin-bottom:6px;">
            சூத்திரம் (Formula): க் + ${u.uyir} = ${example}
          </div>
          <p style="font-family:'Noto Sans Tamil'; font-size:13px; color:#334155; line-height:1.4; margin-bottom:4px;">
            📖 ${u.formulaTamil}
          </p>
          <div style="font-size:12px; color:#0D9488; font-weight:600;">
            💡 Kid Rule: ${u.formulaEnglish}
          </div>
        </div>
      `;
    });
    html += '</div>';
    cheatSheetContent.innerHTML = html;
  }

  // Interactive Quiz Game
  function initQuiz() {
    btnOpenQuiz.addEventListener('click', () => {
      quizModal.classList.add('open');
      loadNextQuizQuestion();
    });

    btnCloseQuizModal.addEventListener('click', () => {
      quizModal.classList.remove('open');
    });

    quizModal.addEventListener('click', (e) => {
      if (e.target === quizModal) quizModal.classList.remove('open');
    });
  }

  function loadNextQuizQuestion() {
    quizFeedbackMessage.textContent = '';
    const randomMei = MEI_LETTERS[Math.floor(Math.random() * MEI_LETTERS.length)];
    const randomUyir = UYIR_LETTERS[Math.floor(Math.random() * UYIR_LETTERS.length)];
    const correctLetter = randomMei.base + randomUyir.sign;

    currentQuizTarget = { mei: randomMei, uyir: randomUyir, correctLetter };
    quizQuestionFormula.textContent = `${randomMei.mei} + ${randomUyir.uyir} = ?`;

    // Generate 3 distractors
    const options = new Set([correctLetter]);
    while (options.size < 4) {
      const distUyir = UYIR_LETTERS[Math.floor(Math.random() * UYIR_LETTERS.length)];
      options.add(randomMei.base + distUyir.sign);
    }

    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);
    quizOptionsGrid.innerHTML = '';

    shuffled.forEach(opt => {
      const btn = document.createElement('button');
      btn.style.cssText = 'padding:18px; font-family:"Noto Sans Tamil"; font-size:32px; font-weight:800; background:white; border:2px solid #CBD5E0; border-radius:16px; cursor:pointer; transition:all 0.2s;';
      btn.textContent = opt;

      btn.addEventListener('click', () => {
        if (opt === correctLetter) {
          quizScore += 10;
          quizScoreStars.textContent = `⭐ ${quizScore}`;
          quizFeedbackMessage.style.color = '#10AC84';
          quizFeedbackMessage.textContent = `🎉 மிகச்சரி! Super! ${randomMei.mei} + ${randomUyir.uyir} = ${correctLetter}! (+10 Stars)`;
          btn.style.background = '#D1FAE5';
          btn.style.borderColor = '#10AC84';
          triggerConfetti();
          setTimeout(loadNextQuizQuestion, 1600);
        } else {
          quizFeedbackMessage.style.color = '#EF4444';
          quizFeedbackMessage.textContent = '❌ தவறு! Try again!';
          btn.style.background = '#FEE2E2';
          btn.style.borderColor = '#EF4444';
        }
      });
      quizOptionsGrid.appendChild(btn);
    });
  }

  // Confetti Particle Explosion
  function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#FF6B6B', '#FFD32A', '#1DD1A1', '#54A0FF', '#5F27CD', '#FF9F43'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
        alpha: 1
      });
    }

    let frame = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.vr;
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      frame++;
      if (alive && frame < 90) {
        requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    renderConfetti();
  }

  // ==========================================
  // EXPORT & GIF GENERATION SYSTEM
  // ==========================================
  let activeExportUrls = [];

  let currentExportBlob = null;
  let currentExportFileName = '';
  let currentExportDataUrl = '';

  function cleanExportUrls() {
    activeExportUrls.forEach(url => {
      try { URL.revokeObjectURL(url); } catch (e) {}
    });
    activeExportUrls = [];
    currentExportBlob = null;
    currentExportFileName = '';
    currentExportDataUrl = '';
  }

  function closeProgressModal() {
    progressModal.classList.remove('open');
    if (progressSuccessBox) progressSuccessBox.style.display = 'none';
    if (progressPreviewContainer) progressPreviewContainer.innerHTML = '';
    cleanExportUrls();
  }

  // Modern File System Access API: Opens OS "Save As" dialog with pre-filled filename and extension
  async function saveExportFileDirectly() {
    if (!currentExportBlob) return;

    if ('showSaveFilePicker' in window && window.isSecureContext) {
      try {
        const ext = currentExportFileName.split('.').pop().toLowerCase();
        let mime = currentExportBlob.type;
        if (!mime) {
          if (ext === 'gif') mime = 'image/gif';
          else if (ext === 'mp4') mime = 'video/mp4';
          else if (ext === 'zip') mime = 'application/zip';
          else if (ext === 'png') mime = 'image/png';
          else mime = 'application/octet-stream';
        }

        const handle = await window.showSaveFilePicker({
          suggestedName: currentExportFileName,
          types: [{
            description: `${ext.toUpperCase()} கோப்பு (.${ext})`,
            accept: { [mime]: ['.' + ext] }
          }]
        });

        const writable = await handle.createWritable();
        await writable.write(currentExportBlob);
        await writable.close();

        if (progressSuccessMsg) {
          progressSuccessMsg.textContent = `🎉 ${currentExportFileName} வெற்றிகரமாகச் சேமிக்கப்பட்டது! (Saved successfully!)`;
        }
        return;
      } catch (err) {
        if (err.name === 'AbortError') {
          return; // User cancelled OS dialog
        }
        console.warn('showSaveFilePicker fallback:', err);
      }
    }

    // Fallback: standard anchor download
    triggerFileDownload(currentExportBlob, currentExportFileName);
  }

  // Reliable download helper
  async function triggerFileDownload(blobOrDataUrl, fileName) {
    let downloadUrl = blobOrDataUrl;
    if (blobOrDataUrl instanceof Blob) {
      downloadUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blobOrDataUrl);
      });
    }
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return downloadUrl;
  }

  function initExportButtons() {
    if (btnSaveWithPicker) btnSaveWithPicker.addEventListener('click', saveExportFileDirectly);
    if (btnDownloadMp4) btnDownloadMp4.addEventListener('click', downloadLetterVideo);
    if (btnDownloadCard) btnDownloadCard.addEventListener('click', downloadFourStepCardPng);
    if (btnDownloadGif) btnDownloadGif.addEventListener('click', downloadSingleLetterGif);
    if (btnDownloadMeiZip) btnDownloadMeiZip.addEventListener('click', downloadMeiSeriesZip);
    if (btnDownloadAllZip) btnDownloadAllZip.addEventListener('click', downloadAll216UyirmeiZip);
    if (btnDownloadPng) btnDownloadPng.addEventListener('click', downloadFlashcardPng);
    if (btnCloseProgressModal) btnCloseProgressModal.addEventListener('click', closeProgressModal);
  }

  // Pure function to generate binary GIF bytes for any Mei + Uyir pair (Slower, kid-friendly pace)
  function renderLetterGifBytes(meiObj, uyirObj, width = 450, height = 450) {
    const details = getLetterDetails(meiObj, uyirObj);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const encoder = new SimpleGifEncoder(width, height);
    encoder.setRepeat(0); // Infinite loop

    function drawCardBase(stepIndex) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Playful border
      ctx.strokeStyle = '#EDF2F7';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, width - 6, height - 6);

      // Top Header Banner
      ctx.fillStyle = '#FF5E57';
      ctx.fillRect(6, 6, width - 12, 44);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '800 17px "Noto Sans Tamil", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('தமிழ் உயிர்மெய் • TamilUyirMei', width / 2, 28);

      // Step Breadcrumb Beads on Top
      const beadLabels = ['1. மெய்', '2. சூத்திரம்', '3. இணைவு', '4. சொல்'];
      const beadW = (width - 40) / 4;
      beadLabels.forEach((lbl, idx) => {
        const bx = 20 + idx * beadW;
        const isCur = idx === stepIndex;
        ctx.fillStyle = isCur ? '#10AC84' : '#F1F5F9';
        ctx.beginPath();
        ctx.roundRect(bx + 2, 56, beadW - 4, 22, 6);
        ctx.fill();

        ctx.font = isCur ? '800 11px "Noto Sans Tamil", sans-serif' : '600 11px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = isCur ? '#FFFFFF' : '#64748B';
        ctx.fillText(lbl, bx + beadW / 2, 67);
      });
    }

    const totalFrames = 8;
    for (let f = 0; f < totalFrames; f++) {
      if (f < 2) {
        // Frame Phase 1: Consonant standing proud with pulli (1.8 seconds)
        drawCardBase(0);

        ctx.font = '700 18px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#718096';
        ctx.fillText(`${meiObj.mei} + ${uyirObj.uyir} = ${details.combined}`, width / 2, 100);

        ctx.font = '600 14px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#4A5568';
        ctx.fillText(`மெய் எழுத்து: ${meiObj.name}`, width / 2, 130);

        ctx.font = '900 115px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#FF5E57';
        ctx.fillText(meiObj.mei, width / 2, 240);

        ctx.font = '26px sans-serif';
        ctx.fillText('✨', width / 2 + 65, 170);

        ctx.font = '600 14px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#718096';
        ctx.fillText('தலையில் புள்ளி கொண்ட மெய் எழுத்து', width / 2, 375);

        ctx.font = '500 11px "Outfit", sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('sangamam-tamil.org • தமிழைக் கொண்டாடுவோம்', width / 2, 415);
        encoder.addFrame(ctx, 1800);

      } else if (f < 4) {
        // Frame Phase 2: Formula & Pulli takeoff (1.8 seconds)
        drawCardBase(1);

        ctx.font = '700 18px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#718096';
        ctx.fillText(`${meiObj.mei} + ${uyirObj.uyir} = ${details.combined}`, width / 2, 100);

        ctx.font = '700 15px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#B7791F';
        ctx.fillText(`சூத்திரம்: ${uyirObj.signName}`, width / 2, 130);

        ctx.font = '900 105px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#2C3A47';
        ctx.fillText(meiObj.base, width / 2, 245);

        // Rising pulli dot
        const lift = (f - 2) * 22;
        ctx.fillStyle = '#FF5E57';
        ctx.beginPath();
        ctx.arc(width / 2 + 10, 155 - lift, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '22px sans-serif';
        ctx.fillText('💫', width / 2 + 35, 145 - lift);

        ctx.font = '600 14px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#854D0E';
        ctx.fillText(uyirObj.formulaTamil, width / 2, 375);

        ctx.font = '500 11px "Outfit", sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('sangamam-tamil.org • தமிழைக் கொண்டாடுவோம்', width / 2, 415);
        encoder.addFrame(ctx, 1800);

      } else if (f < 6) {
        // Frame Phase 3: Transformation & Joining (2.0 seconds)
        drawCardBase(2);

        ctx.font = '700 18px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#718096';
        ctx.fillText(`${meiObj.mei} + ${uyirObj.uyir} = ${details.combined}`, width / 2, 100);

        ctx.font = '700 15px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#5F27CD';
        ctx.fillText('குறியீடு இணைந்து உயிர்மெய் பிறக்கிறது!', width / 2, 130);

        ctx.font = '900 75px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#2C3A47';
        ctx.fillText(meiObj.base, width / 2 - 95, 240);

        ctx.font = '700 32px sans-serif';
        ctx.fillStyle = '#059669';
        ctx.fillText('➜', width / 2, 240);

        ctx.font = '900 85px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#10AC84';
        ctx.fillText(details.combined, width / 2 + 95, 240);

        ctx.font = '600 13px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#4A5568';
        ctx.fillText(`வரிசை: ${details.steps.map((s, i) => `${i + 1}. ${s.part}`).join(' ➔ ')}`, width / 2, 375);

        ctx.font = '500 11px "Outfit", sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('sangamam-tamil.org • தமிழைக் கொண்டாடுவோம்', width / 2, 415);
        encoder.addFrame(ctx, 2000);

      } else {
        // Frame Phase 4: Completed Uyirmei Letter + Vocabulary (2.8 seconds)
        drawCardBase(3);

        ctx.font = '700 18px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#718096';
        ctx.fillText(`${meiObj.mei} + ${uyirObj.uyir} = ${details.combined}`, width / 2, 100);

        ctx.font = '700 16px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#10AC84';
        ctx.fillText('🎉 உயிர்மெய் எழுத்து உருவானது! 🎉', width / 2, 130);

        ctx.font = '900 130px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#10AC84';
        ctx.fillText(details.combined, width / 2, 245);

        ctx.font = '28px sans-serif';
        ctx.fillText('👑', width / 2, 155);

        ctx.font = '700 18px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#2C3A47';
        ctx.fillText(`${details.vocab.emoji} ${details.vocab.word} (${details.vocab.english})`, width / 2, 365);

        ctx.font = '600 13px "Noto Sans Tamil", sans-serif';
        ctx.fillStyle = '#718096';
        ctx.fillText(details.vocab.sentence, width / 2, 395);

        ctx.font = '500 11px "Outfit", sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('sangamam-tamil.org • தமிழைக் கொண்டாடுவோம்', width / 2, 420);
        encoder.addFrame(ctx, 2800);
      }
    }

    return encoder.render();
  }

  // 0. Download Video (MP4) with Native Pause, Play, Scrub (NO ting sound in between, only speaks word at end)
  async function downloadLetterVideo() {
    const meiObj = MEI_LETTERS[selectedMeiIndex];
    const uyirObj = UYIR_LETTERS[selectedUyirIndex];
    const details = getLetterDetails(meiObj, uyirObj);
    const fileName = `${details.combined}.mp4`;

    progressModal.classList.add('open');
    if (progressSuccessBox) progressSuccessBox.style.display = 'none';
    if (progressPreviewContainer) progressPreviewContainer.innerHTML = '';
    progressIcon.textContent = '🎬';
    progressTitle.textContent = `${fileName} வீடியோ தயாராகிறது...`;
    progressSub.textContent = `குழந்தைகள் நிறுத்திப் பார்க்கக்கூடிய (Pause & Learn) MP4 வீடியோ உருவாக்கப்படுகிறது...`;
    progressBarInner.style.width = '10%';
    progressPercent.textContent = '10%';

    // Canvas 720 x 720
    const vCanvas = document.createElement('canvas');
    vCanvas.width = 720;
    vCanvas.height = 720;
    const vCtx = vCanvas.getContext('2d');

    const canvasStream = vCanvas.captureStream(30); // 30 FPS

    let mimeType = 'video/mp4;codecs=avc1';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';
    }

    const recorder = new MediaRecorder(canvasStream, {
      mimeType,
      videoBitsPerSecond: 2500000
    });

    const chunks = [];
    recorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.start(100);

    const totalDurationMs = 10000;
    const startTime = performance.now();

    function drawVideoFrame(elapsedMs) {
      const sec = elapsedMs / 1000;
      let chapter = 0;
      if (sec >= 7.2) chapter = 3;
      else if (sec >= 4.8) chapter = 2;
      else if (sec >= 2.4) chapter = 1;
      else chapter = 0;

      // Background
      vCtx.fillStyle = '#FFFFFF';
      vCtx.fillRect(0, 0, 720, 720);

      vCtx.strokeStyle = '#E2E8F0';
      vCtx.lineWidth = 10;
      vCtx.strokeRect(5, 5, 710, 710);

      // Header Banner
      vCtx.fillStyle = '#10AC84';
      vCtx.fillRect(10, 10, 700, 70);

      vCtx.textAlign = 'center';
      vCtx.textBaseline = 'middle';
      vCtx.font = '800 24px "Noto Sans Tamil", sans-serif';
      vCtx.fillStyle = '#FFFFFF';
      vCtx.fillText('சங்கமம் தமிழ் பள்ளி • உயிர்மெய் காணொளி', 360, 45);

      // Chapter Beads
      const chaptersInfo = ['1. மெய்', '2. சூத்திரம்', '3. இணைவு', '4. சொல்'];
      const cWidth = 660 / 4;
      chaptersInfo.forEach((title, idx) => {
        const x = 30 + idx * cWidth;
        const isActive = idx === chapter;
        vCtx.fillStyle = isActive ? '#059669' : '#EDF2F7';
        vCtx.beginPath();
        vCtx.roundRect(x + 4, 92, cWidth - 8, 34, 10);
        vCtx.fill();

        vCtx.font = isActive ? '800 15px "Noto Sans Tamil", sans-serif' : '600 14px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = isActive ? '#FFFFFF' : '#718096';
        vCtx.fillText(title, x + (cWidth / 2), 109);
      });

      // Top equation
      vCtx.font = '800 28px "Noto Sans Tamil", sans-serif';
      vCtx.fillStyle = '#2C3A47';
      vCtx.fillText(`${meiObj.mei} + ${uyirObj.uyir} = ${details.combined}`, 360, 160);

      if (chapter === 0) {
        vCtx.font = '700 20px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#FF5E57';
        vCtx.fillText(`மெய் எழுத்து: ${meiObj.name} (${meiObj.soundHint})`, 360, 215);

        vCtx.font = '900 180px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#FF5E57';
        vCtx.fillText(meiObj.mei, 360, 390);

        vCtx.font = '36px sans-serif';
        vCtx.fillText('✨', 470, 280);

        vCtx.font = '600 19px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#4A5568';
        vCtx.fillText('தலையில் புள்ளி கொண்ட மெய் எழுத்து!', 360, 560);
        vCtx.font = '500 16px "Outfit", sans-serif';
        vCtx.fillStyle = '#718096';
        vCtx.fillText(`Consonant with dot on top: /${meiObj.english}/`, 360, 595);

      } else if (chapter === 1) {
        vCtx.font = '800 22px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#B7791F';
        vCtx.fillText(`மாயாஜாலச் சூத்திரம்: ${uyirObj.signName}`, 360, 215);

        vCtx.font = '900 160px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#2C3A47';
        vCtx.fillText(meiObj.base, 360, 400);

        const tInChapter = (sec - 2.4) / 2.4;
        const lift = Math.min(80, tInChapter * 90);
        vCtx.fillStyle = '#FF5E57';
        vCtx.beginPath();
        vCtx.arc(375, 270 - lift, 11, 0, Math.PI * 2);
        vCtx.fill();

        vCtx.font = '32px sans-serif';
        vCtx.fillText('💫', 420, 255 - lift);

        vCtx.font = '700 18px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#854D0E';
        vCtx.fillText(uyirObj.formulaTamil, 360, 560);
        vCtx.font = '500 16px "Outfit", sans-serif';
        vCtx.fillStyle = '#92400E';
        vCtx.fillText(uyirObj.formulaEnglish, 360, 595);

      } else if (chapter === 2) {
        vCtx.font = '800 22px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#5F27CD';
        vCtx.fillText('குறியீடு இணைந்து உயிர்மெய் பிறக்கிறது!', 360, 215);

        vCtx.font = '900 120px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#2C3A47';
        vCtx.fillText(meiObj.base, 200, 390);

        vCtx.font = '700 48px sans-serif';
        vCtx.fillStyle = '#059669';
        vCtx.fillText('➔', 360, 390);

        vCtx.font = '900 135px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#10AC84';
        vCtx.fillText(details.combined, 520, 390);

        vCtx.font = '700 18px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#1E293B';
        vCtx.fillText(`எழுதும் வரிசை: ${details.steps.map((s, i) => `${i + 1}. ${s.part}`).join('  ➔  ')}`, 360, 560);
        vCtx.font = '500 16px "Outfit", sans-serif';
        vCtx.fillStyle = '#64748B';
        vCtx.fillText('Trace each part step-by-step', 360, 595);

      } else {
        vCtx.font = '800 24px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#10AC84';
        vCtx.fillText('🎉 உயிர்மெய் எழுத்து உருவானது! 🎉', 360, 215);

        vCtx.font = '900 200px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#10AC84';
        vCtx.fillText(details.combined, 360, 400);

        vCtx.font = '40px sans-serif';
        vCtx.fillText('👑', 360, 255);

        vCtx.font = '800 24px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#2C3A47';
        vCtx.fillText(`${details.vocab.emoji} ${details.vocab.word} (${details.vocab.english})`, 360, 545);

        vCtx.font = '600 16px "Noto Sans Tamil", sans-serif';
        vCtx.fillStyle = '#4A5568';
        vCtx.fillText(details.vocab.sentence, 360, 576);

        vCtx.font = '500 15px "Outfit", sans-serif';
        vCtx.fillStyle = '#059669';
        vCtx.fillText(details.vocab.sentenceEnglish || details.vocab.english, 360, 604);
      }

      // Bottom Pause & Learn Banner
      vCtx.fillStyle = '#F8FAFC';
      vCtx.strokeStyle = '#E2E8F0';
      vCtx.lineWidth = 1.5;
      vCtx.beginPath();
      vCtx.roundRect(40, 635, 640, 60, 14);
      vCtx.fill();
      vCtx.stroke();

      vCtx.font = '700 15px "Noto Sans Tamil", sans-serif';
      vCtx.fillStyle = '#10AC84';
      vCtx.fillText('💡 எப்போது வேண்டுமானாலும் நிறுத்தி (Pause) பழகலாம் ⏸️', 360, 665);
      vCtx.fillText('sangamam-tamil.org • தமிழைக் கொண்டாடுவோம்', 360, 683);
    }

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        drawVideoFrame(elapsed);

        const pct = Math.min(95, Math.round((elapsed / totalDurationMs) * 95));
        progressBarInner.style.width = `${pct}%`;
        const remainingSec = Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000));
        progressPercent.textContent = `${pct}% (${remainingSec} விநாடிகள்)`;

        if (elapsed >= totalDurationMs) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 1000 / 30);

      recorder.onstop = async () => {
        const videoBlob = new Blob(chunks, { type: recorder.mimeType });
        progressBarInner.style.width = '100%';
        progressPercent.textContent = '100% (வீடியோ தயார்!)';

        const downloadUrl = URL.createObjectURL(videoBlob);
        activeExportUrls.push(downloadUrl);

        currentExportBlob = videoBlob;
        currentExportFileName = fileName;
        currentExportDataUrl = downloadUrl;

        if (window.location.protocol !== 'file:') {
          triggerFileDownload(videoBlob, fileName);
        }

        progressTitle.textContent = `${fileName} தயார்!`;
        progressSub.textContent = `வீடியோ தயாராகிவிட்டது. கீழே உள்ள பொத்தானை அழுத்தி உங்கள் கணினியில் சேமிக்கலாம்:`;

        if (progressPreviewContainer) {
          progressPreviewContainer.innerHTML = `
            <video src="${downloadUrl}" controls autoplay loop playsinline style="max-width:240px; max-height:240px; border-radius:16px; border:3px solid #10AC84; box-shadow:0 8px 24px rgba(16,172,132,0.25);"></video>
          `;
        }

        if (progressSuccessMsg) {
          progressSuccessMsg.textContent = `✅ ${fileName} காணொளி தயார்! (${(videoBlob.size / 1024).toFixed(0)} KB)`;
        }
        if (btnDirectDownloadLink) {
          btnDirectDownloadLink.href = downloadUrl;
          btnDirectDownloadLink.download = fileName;
        }
        if (btnDirectDownloadText) {
          btnDirectDownloadText.textContent = `💾 ${fileName} கணினியில் சேமிக்க (Save File)`;
        }
        if (progressSuccessBox) {
          progressSuccessBox.style.display = 'flex';
        }

        resolve(downloadUrl);
      };
    });
  }

  // 0b. Download 4-Step Infographic Card (1200 x 675 PNG)
  async function downloadFourStepCardPng() {
    const meiObj = MEI_LETTERS[selectedMeiIndex];
    const uyirObj = UYIR_LETTERS[selectedUyirIndex];
    const details = getLetterDetails(meiObj, uyirObj);
    const fileName = `${details.combined}_4_step_card.png`;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, 1200, 675);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 0);
    grad.addColorStop(0, '#10AC84');
    grad.addColorStop(0.5, '#059669');
    grad.addColorStop(1, '#0ABDE3');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 95);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 32px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('தமிழ் உயிர்மெய் பயிலரங்கம் • 4-படி கற்றல் அட்டை', 600, 42);

    ctx.font = '600 16px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('TamilUyirMei • 4-Step Visual Learning Guide', 600, 75);

    // Equation Banner
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(100, 115, 1000, 65, 16);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '800 30px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#2C3A47';
    ctx.fillText(`${meiObj.mei} + ${uyirObj.uyir} = ${details.combined}`, 600, 147);

    // 4 Visual Step Cards
    const cards = [
      {
        num: '1',
        title: 'மெய் (Consonant)',
        sub: `${meiObj.name} (/${meiObj.english}/)`,
        char: meiObj.mei,
        color: '#FF5E57',
        bg: '#FFF5F5',
        border: '#FEB2B2',
        desc: 'Dot on top (புள்ளி)'
      },
      {
        num: '2',
        title: 'உயிர் (Vowel Sound)',
        sub: `${uyirObj.uyir} (/${uyirObj.english}/)`,
        char: uyirObj.sign || '–',
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FDE68A',
        desc: uyirObj.formulaEnglish
      },
      {
        num: '3',
        title: 'முறை (Strokes)',
        sub: 'எழுதும் வரிசை',
        char: '✍️',
        color: '#5F27CD',
        bg: '#F5F3FF',
        border: '#DDD6FE',
        desc: details.steps.map((s, i) => `${i + 1}. ${s.englishText || s.part}`).join(' ➔ ')
      },
      {
        num: '4',
        title: 'சொல் (Word)',
        sub: `${details.vocab.emoji} ${details.vocab.word}`,
        char: details.combined,
        color: '#10AC84',
        bg: '#ECFDF5',
        border: '#A7F3D0',
        desc: details.vocab.english
      }
    ];

    const cardW = 250;
    const cardH = 340;
    const startX = 65;
    const gap = 38;

    cards.forEach((c, idx) => {
      const x = startX + idx * (cardW + gap);
      const y = 205;

      ctx.fillStyle = c.bg;
      ctx.strokeStyle = c.border;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(x + 36, y + 36, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 18px "Outfit", sans-serif';
      ctx.fillText(c.num, x + 36, y + 36);

      ctx.fillStyle = '#1E293B';
      ctx.font = '800 16px "Noto Sans Tamil", sans-serif';
      ctx.fillText(c.title, x + cardW / 2 + 10, y + 36);

      ctx.fillStyle = c.color;
      ctx.font = '900 78px "Noto Sans Tamil", sans-serif';
      ctx.fillText(c.char, x + cardW / 2, y + 145);

      ctx.fillStyle = '#475569';
      ctx.font = '700 15px "Noto Sans Tamil", sans-serif';
      ctx.fillText(c.sub, x + cardW / 2, y + 225);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 12px "Noto Sans Tamil", sans-serif';
      ctx.fillText(c.desc, x + cardW / 2, y + 270);

      if (idx < 3) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = '700 32px sans-serif';
        ctx.fillText('➜', x + cardW + gap / 2, y + cardH / 2);
      }
    });

    // Footer
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(100, 570, 1000, 72, 16);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '700 15px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#0F766E';
    ctx.fillText(`📖 வாக்கியம்: ${details.vocab.sentence}`, 600, 595);

    ctx.font = '600 14px "Outfit", sans-serif';
    ctx.fillStyle = '#047857';
    ctx.fillText(`English: ${details.vocab.sentenceEnglish || details.vocab.english}`, 600, 622);

    const dataUrl = canvas.toDataURL('image/png');
    const res = await fetch(dataUrl);
    const pngBlob = await res.blob();

    currentExportBlob = pngBlob;
    currentExportFileName = fileName;
    currentExportDataUrl = dataUrl;

    progressModal.classList.add('open');
    if (progressSuccessBox) progressSuccessBox.style.display = 'none';
    if (progressPreviewContainer) progressPreviewContainer.innerHTML = '';
    progressIcon.textContent = '🖼️';
    progressTitle.textContent = `${fileName} தயார்!`;
    progressSub.textContent = 'கீழே உள்ள பொத்தானை அழுத்தி உங்கள் கணினியில் சேமித்துக் கொள்ளலாம்.';
    progressBarInner.style.width = '100%';
    progressPercent.textContent = '100%';
    if (progressPreviewContainer) {
      progressPreviewContainer.innerHTML = `<img src="${dataUrl}" alt="${fileName}" style="max-width:240px; border-radius:12px; border:2px solid #10AC84;" />`;
    }
    if (btnDirectDownloadText) {
      btnDirectDownloadText.textContent = `💾 ${fileName} கணினியில் சேமிக்க (Save File)`;
    }
    if (btnDirectDownloadLink) {
      btnDirectDownloadLink.href = dataUrl;
      btnDirectDownloadLink.download = fileName;
    }
    if (progressSuccessMsg) {
      progressSuccessMsg.textContent = `✅ ${fileName} அட்டை தயாராகிவிட்டது!`;
    }
    if (progressSuccessBox) {
      progressSuccessBox.style.display = 'flex';
    }

    if (window.location.protocol !== 'file:') {
      triggerFileDownload(pngBlob, fileName);
    }
  }

  // 1. Download Individual Letter GIF (e.g. க.gif)
  async function downloadSingleLetterGif() {
    const meiObj = MEI_LETTERS[selectedMeiIndex];
    const uyirObj = UYIR_LETTERS[selectedUyirIndex];
    const details = getLetterDetails(meiObj, uyirObj);
    const fileName = `${details.combined}.gif`;

    progressModal.classList.add('open');
    if (progressSuccessBox) progressSuccessBox.style.display = 'none';
    if (progressPreviewContainer) progressPreviewContainer.innerHTML = '';
    progressIcon.textContent = '🎥';
    progressTitle.textContent = `${fileName} தயாராகிறது...`;
    progressSub.textContent = `மெய்: ${meiObj.mei} + உயிர்: ${uyirObj.uyir} ➔ ${details.combined} அனிமேஷன் GIF உருவாக்கப்படுகிறது.`;
    progressBarInner.style.width = '20%';
    progressPercent.textContent = '20%';

    await new Promise(r => setTimeout(r, 40));

    // Generate GIF bytes
    progressBarInner.style.width = '60%';
    progressPercent.textContent = '60% (அனிமேஷன் உருவாக்கம்)...';
    await new Promise(r => setTimeout(r, 40));

    const gifBytes = renderLetterGifBytes(meiObj, uyirObj, 450, 450);
    const gifBlob = new Blob([gifBytes], { type: 'image/gif' });

    progressBarInner.style.width = '100%';
    progressPercent.textContent = '100% (முடிந்தது!)';
    await new Promise(r => setTimeout(r, 50));

    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(gifBlob);
    });

    currentExportBlob = gifBlob;
    currentExportFileName = fileName;
    currentExportDataUrl = dataUrl;

    if (window.location.protocol !== 'file:') {
      triggerFileDownload(gifBlob, fileName);
    }

    // Show preview & guaranteed direct link in modal
    progressTitle.textContent = `${fileName} தயார்!`;
    progressSub.textContent = `கீழே உள்ள 'கணினியில் சேமிக்க' பொத்தானை அழுத்தி உங்கள் கணினியில் சேமிக்கலாம்:`;
    if (progressPreviewContainer) {
      progressPreviewContainer.innerHTML = `
        <img src="${dataUrl}" alt="${details.combined}" style="max-width:180px; max-height:180px; border-radius:14px; border:3px solid #10AC84; box-shadow:0 8px 20px rgba(0,0,0,0.12);" />
      `;
    }
    if (progressSuccessMsg) {
      progressSuccessMsg.textContent = `✅ ${fileName} அனிமேஷன் GIF தயாராகிவிட்டது!`;
    }
    if (btnDirectDownloadLink) {
      btnDirectDownloadLink.href = dataUrl;
      btnDirectDownloadLink.download = fileName;
    }
    if (btnDirectDownloadText) {
      btnDirectDownloadText.textContent = `💾 ${fileName} கணினியில் சேமிக்க (Save File)`;
    }
    if (progressSuccessBox) {
      progressSuccessBox.style.display = 'flex';
    }
  }

  // 2. Download Selected Mei Series as ZIP (12 letters) under folder [mei]/[uyirmei].gif
  async function downloadMeiSeriesZip() {
    const meiObj = MEI_LETTERS[selectedMeiIndex];
    const zipName = `${meiObj.mei}_12_uyirmei.zip`;

    progressModal.classList.add('open');
    if (progressSuccessBox) progressSuccessBox.style.display = 'none';
    if (progressPreviewContainer) progressPreviewContainer.innerHTML = '';
    progressIcon.textContent = '📁';
    progressTitle.textContent = `${meiObj.mei} வரிசை (12 உயிர்மெய்) ZIP தயாராகிறது...`;
    progressSub.textContent = `${meiObj.mei}/ கோப்புறைக்குள் 12 GIF கோப்புகளும் சேர்க்கப்படுகின்றன.`;
    progressBarInner.style.width = '5%';
    progressPercent.textContent = '5%';

    await new Promise(r => setTimeout(r, 50));

    const zip = new SimpleZipWriter();

    for (let i = 0; i < UYIR_LETTERS.length; i++) {
      const uyirObj = UYIR_LETTERS[i];
      const details = getLetterDetails(meiObj, uyirObj);
      const gifBytes = renderLetterGifBytes(meiObj, uyirObj, 420, 420);

      // Folder structure: [mei]/[uyirmei].gif
      const filePath = `${meiObj.mei}/${details.combined}.gif`;
      zip.addFile(filePath, gifBytes);

      const pct = Math.round(((i + 1) / UYIR_LETTERS.length) * 90);
      progressBarInner.style.width = `${pct}%`;
      progressPercent.textContent = `${pct}% (${details.combined}.gif...)`;
      progressSub.textContent = `சேர்க்கப்படுகிறது: ${meiObj.mei} ➔ ${filePath} (${i + 1}/12)`;
      await new Promise(r => setTimeout(r, 15));
    }

    progressBarInner.style.width = '96%';
    progressPercent.textContent = '96% (ZIP தொகுப்பு)...';
    await new Promise(r => setTimeout(r, 40));

    const zipBlob = zip.toBlob();
    const downloadUrl = URL.createObjectURL(zipBlob);
    activeExportUrls.push(downloadUrl);

    currentExportBlob = zipBlob;
    currentExportFileName = zipName;
    currentExportDataUrl = downloadUrl;

    if (window.location.protocol !== 'file:') {
      triggerFileDownload(zipBlob, zipName);
    }

    progressBarInner.style.width = '100%';
    progressPercent.textContent = '100% (நிறைவுற்றது!)';

    progressTitle.textContent = `${zipName} தயார்!`;
    progressSub.textContent = `${meiObj.mei} கோப்புறைக்குள் 12 GIF கோப்புகள் அடங்கிய ZIP தொகுப்பு உருவாக்கப்பட்டது.`;
    if (progressPreviewContainer) {
      progressPreviewContainer.innerHTML = `
        <div style="padding:16px 24px; background:#F0FDF4; border-radius:14px; border:2px dashed #10AC84; text-align:center;">
          <div style="font-size:38px;">📁</div>
          <div style="font-weight:800; color:#10AC84; font-size:18px; margin-top:6px;">${meiObj.mei}/ (12 GIF கோப்புகள்)</div>
        </div>
      `;
    }
    if (progressSuccessMsg) {
      progressSuccessMsg.textContent = `✅ ${zipName} வெற்றிகரமாக உருவாக்கப்பட்டது!`;
    }
    if (btnDirectDownloadLink) {
      btnDirectDownloadLink.href = downloadUrl;
      btnDirectDownloadLink.download = zipName;
    }
    if (btnDirectDownloadText) {
      btnDirectDownloadText.textContent = `💾 ${zipName} கணினியில் சேமிக்க (Save ZIP)`;
    }
    if (progressSuccessBox) {
      progressSuccessBox.style.display = 'flex';
    }

    triggerConfetti();
  }

  // 3. Download ALL 216 Uyirmei Letters organized by Mei folder
  async function downloadAll216UyirmeiZip() {
    const zipName = 'TamilUyirMei_All_216_Letters.zip';

    progressModal.classList.add('open');
    if (progressSuccessBox) progressSuccessBox.style.display = 'none';
    if (progressPreviewContainer) progressPreviewContainer.innerHTML = '';
    progressIcon.textContent = '📦';
    progressTitle.textContent = 'அனைத்து 216 உயிர்மெய் எழுத்துக்களும் தயாராகின்றன...';
    progressSub.textContent = '18 மெய் எழுத்துக் கோப்புறைகளுடன் அனைத்து 216 GIF-களும் ZIP-ல் தொகுக்கப்படுகின்றன...';
    progressBarInner.style.width = '1%';
    progressPercent.textContent = '1%';

    await new Promise(r => setTimeout(r, 60));

    const zip = new SimpleZipWriter();
    const totalLetters = MEI_LETTERS.length * UYIR_LETTERS.length; // 216
    let count = 0;

    for (let m = 0; m < MEI_LETTERS.length; m++) {
      const mObj = MEI_LETTERS[m];
      for (let u = 0; u < UYIR_LETTERS.length; u++) {
        const uObj = UYIR_LETTERS[u];
        const details = getLetterDetails(mObj, uObj);
        const gifBytes = renderLetterGifBytes(mObj, uObj, 380, 380);

        // Folder structure of mei, naming convention representing actual uyirmei alphabet:
        // E.g. க்/க.gif, க்/கா.gif ... ன்/னௌ.gif
        const filePath = `${mObj.mei}/${details.combined}.gif`;
        zip.addFile(filePath, gifBytes);

        count++;
        const pct = Math.round((count / totalLetters) * 92);
        progressBarInner.style.width = `${pct}%`;
        progressPercent.textContent = `${pct}% (${count}/${totalLetters})`;
        progressSub.textContent = `சேர்க்கப்படுகிறது: ${mObj.mei} ➔ ${filePath} (${count}/${totalLetters})`;

        // Yield to browser UI thread periodically
        if (count % 4 === 0) {
          await new Promise(r => setTimeout(r, 10));
        }
      }
    }

    progressBarInner.style.width = '96%';
    progressPercent.textContent = '96% (ZIP உருவாக்கப்படுகிறது)...';
    progressSub.textContent = 'அனைத்து 216 எழுத்துக்களும் சுருக்கப்பட்டு ZIP கோப்பாக மாற்றப்படுகிறது...';
    await new Promise(r => setTimeout(r, 60));

    const zipBlob = zip.toBlob();
    const downloadUrl = URL.createObjectURL(zipBlob);
    activeExportUrls.push(downloadUrl);

    currentExportBlob = zipBlob;
    currentExportFileName = zipName;
    currentExportDataUrl = downloadUrl;

    if (window.location.protocol !== 'file:') {
      triggerFileDownload(zipBlob, zipName);
    }

    progressBarInner.style.width = '100%';
    progressPercent.textContent = '100% (முழுமை பெற்றது!)';

    progressTitle.textContent = `${zipName} தயார்!`;
    progressSub.textContent = `18 மெய் கோப்புறைகளில் 216 உயிர்மெய் எழுத்துக்களின் அனிமேஷன் GIF கோப்புகளும் வெற்றிகரமாகத் தொகுக்கப்பட்டன.`;
    if (progressPreviewContainer) {
      progressPreviewContainer.innerHTML = `
        <div style="padding:16px 24px; background:#F0FDF4; border-radius:14px; border:2px dashed #10AC84; text-align:center;">
          <div style="font-size:42px;">📦</div>
          <div style="font-weight:800; color:#10AC84; font-size:18px; margin-top:6px;">18 மெய் கோப்புறைகள் • 216 உயிர்மெய் GIF</div>
        </div>
      `;
    }
    if (progressSuccessMsg) {
      progressSuccessMsg.textContent = `✅ ${zipName} (${(zipBlob.size / (1024 * 1024)).toFixed(1)} MB) தயார்!`;
    }
    if (btnDirectDownloadLink) {
      btnDirectDownloadLink.href = downloadUrl;
      btnDirectDownloadLink.download = zipName;
    }
    if (btnDirectDownloadText) {
      btnDirectDownloadText.textContent = `💾 ${zipName} கணினியில் சேமிக்க (Save ZIP)`;
    }
    if (progressSuccessBox) {
      progressSuccessBox.style.display = 'flex';
    }

    triggerConfetti();
  }

  // Download Flashcard PNG
  async function downloadFlashcardPng() {
    const meiObj = MEI_LETTERS[selectedMeiIndex];
    const uyirObj = UYIR_LETTERS[selectedUyirIndex];
    const details = getLetterDetails(meiObj, uyirObj);

    const card = document.createElement('canvas');
    card.width = 600;
    card.height = 700;
    const ctx = card.getContext('2d');

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 700);

    // Decorative gradient header
    const grad = ctx.createLinearGradient(0, 0, 600, 0);
    grad.addColorStop(0, '#FF5E57');
    grad.addColorStop(1, '#FF9F43');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 90);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 24px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('தமிழ் உயிர்மெய் பயிலரங்கம் • உயிர்மெய் அட்டை', 300, 36);

    ctx.font = '600 15px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('TamilUyirMei • Flashcard', 300, 65);

    // Equation
    ctx.font = '700 26px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#2C3A47';
    ctx.fillText(`${meiObj.mei} + ${uyirObj.uyir} = ${details.combined}`, 300, 135);

    // Big Uyirmei Letter
    ctx.font = '900 160px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#10AC84';
    ctx.fillText(details.combined, 300, 270);

    // Formula Banner Box
    ctx.fillStyle = '#FEF9E7';
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, 370, 520, 120, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 18px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#92400E';
    ctx.fillText(`சூத்திரம்: ${uyirObj.signName}`, 300, 400);

    ctx.font = '600 16px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#78350F';
    ctx.fillText(uyirObj.formulaTamil, 300, 435);

    ctx.font = '500 14px "Outfit", sans-serif';
    ctx.fillStyle = '#92400E';
    ctx.fillText(uyirObj.formulaEnglish, 300, 465);

    // Example Word Box
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(40, 505, 520, 142, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 24px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#2C3A47';
    ctx.fillText(`${details.vocab.emoji} ${details.vocab.word}`, 300, 532);

    ctx.font = '600 16px "Outfit", sans-serif';
    ctx.fillStyle = '#5F27CD';
    ctx.fillText(details.vocab.english, 300, 558);

    ctx.font = '600 14px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#4A5568';
    ctx.fillText(details.vocab.sentence, 300, 584);

    ctx.font = '500 13px "Outfit", sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText(details.vocab.sentenceEnglish || details.vocab.english, 300, 610);

    // Footer
    ctx.font = '500 12px "Outfit", sans-serif';
    ctx.fillStyle = '#A0AEC0';
    ctx.fillText('sangamam-tamil.org • Made with love for kids', 300, 675);

    // Download PNG reliably with exact filename
    const fileName = `${details.combined}.png`;
    const dataUrl = card.toDataURL('image/png');
    const res = await fetch(dataUrl);
    const cardBlob = await res.blob();

    currentExportBlob = cardBlob;
    currentExportFileName = fileName;
    currentExportDataUrl = dataUrl;

    progressModal.classList.add('open');
    if (progressSuccessBox) progressSuccessBox.style.display = 'none';
    if (progressPreviewContainer) progressPreviewContainer.innerHTML = '';
    progressIcon.textContent = '📇';
    progressTitle.textContent = `${fileName} அட்டை தயார்!`;
    progressSub.textContent = 'கீழே உள்ள பொத்தானை அழுத்தி உங்கள் கணினியில் சேமித்துக் கொள்ளலாம்.';
    progressBarInner.style.width = '100%';
    progressPercent.textContent = '100%';
    if (progressPreviewContainer) {
      progressPreviewContainer.innerHTML = `<img src="${dataUrl}" alt="${details.combined}" style="max-width:200px; border-radius:12px; border:2px solid #10AC84;" />`;
    }
    if (btnDirectDownloadText) {
      btnDirectDownloadText.textContent = `💾 ${fileName} கணினியில் சேமிக்க (Save PNG)`;
    }
    if (btnDirectDownloadLink) {
      btnDirectDownloadLink.href = dataUrl;
      btnDirectDownloadLink.download = fileName;
    }
    if (progressSuccessMsg) {
      progressSuccessMsg.textContent = `✅ ${fileName} அட்டை உருவாக்கப்பட்டது!`;
    }
    if (progressSuccessBox) {
      progressSuccessBox.style.display = 'flex';
    }

    if (window.location.protocol !== 'file:') {
      triggerFileDownload(cardBlob, fileName);
    }
  }

  // Handle Resize
  function resizeCanvases() {
    const animWrapper = document.getElementById('animViewWrapper');
    if (animWrapper) {
      const w = Math.min(600, animWrapper.clientWidth - 48);
      if (w > 280) {
        animCanvas.width = w;
        animCanvas.height = Math.round(w * 0.55);
        drawAnimationCanvas();
      }
    }

    const pracContainer = document.getElementById('practiceContainer');
    if (pracContainer) {
      practiceCanvas.width = pracContainer.clientWidth || 380;
      practiceCanvas.height = 220;
      undoPracticeCanvas(); // redraw strokes
    }
  }

  // Expose for external API / testing
  window.TamilUyirMei = window.Sangamam = {
    renderLetterGifBytes,
    downloadSingleLetterGif,
    downloadMeiSeriesZip,
    downloadAll216UyirmeiZip,
    downloadLetterVideo,
    downloadFourStepCardPng,
    MEI_LETTERS,
    UYIR_LETTERS,
    getLetterDetails
  };

  // Start on load
  window.addEventListener('DOMContentLoaded', init);
})();

