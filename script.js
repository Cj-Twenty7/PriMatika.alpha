const defaultConfig = {
      background_color: '#ab9b07ff',
      surface_color: '#feffbfff',
      text_color: '#d8ff12ff',
      primary_action_color: '#cbcb18ff',
      secondary_action_color: '#6fa8eeff',
      app_title: 'PriMatika',
      counting_button: 'Counting',
      solving_button: 'Solving',
      number_table_button: 'Number Table',
      inequality_button: 'Inequality'
    };

    let start = 1;
    let end = 10;

    let currentTableStart = null;  // Tracks the start of the current number table range
    let currentTableEnd = null;    // Tracks the end of the current number table range

    // Counting state
    let countingDifficulty = 'easy';
    let countingSequence = [];
    let countingScore = 0;
    let countingProgress = 0;
    let totalCountingQuestions = 5;

    // Solving state
    let solvingDifficulty = 'easy';
    let solvingQuestions = [];
    let currentSolvingIndex = 0;
    let solvingScore = 0;
    let currentOperation = 'add';

    // Inequality state
    let inequalityDifficulty = 'easy';
    let inequalityQuestions = [];
    let currentInequalityIndex = 0;
    let inequalityScore = 0;
    
    let currentCountingPercentage = 0;
    let currentSolvingPercentage = 0;
    let currentInequalityPercentage = 0;

    let countingTries = 0;
    let currentLanguage = localStorage.getItem('lang') || 'en';
    
    let languageSwitchTimeout;
    let ttsEnabled = localStorage.getItem('ttsEnabled') === 'false' ? false : true;  // Load from storage, default true
    let bgMusicMuted = localStorage.getItem('bgMusicMuted') === 'true';

    const numberWords = {
  en: {
    1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
    11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
    20: 'twenty', 21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five', 26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine',
    30: 'thirty', 31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five', 36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine',
    40: 'forty', 41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five', 46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine',
    50: 'fifty', 51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five', 56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine',
    60: 'sixty', 61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five', 66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine',
    70: 'seventy', 71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five', 76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine',
    80: 'eighty', 81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five', 86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine',
    90: 'ninety', 91: 'ninety-one', 92: 'ninety-two', 93: 'ninety-three', 94: 'ninety-four', 95: 'ninety-five', 96: 'ninety-six', 97: 'ninety-seven', 98: 'ninety-eight', 99: 'ninety-nine',
    100: 'one hundred'
  },
  fil: {
    1: 'isa', 2: 'dalawa', 3: 'tatlo', 4: 'apat', 5: 'lima', 6: 'anim', 7: 'pito', 8: 'walo', 9: 'siyam', 10: 'sampu',
    11: 'labing-isa', 12: 'labing-dalawa', 13: 'labing-tatlo', 14: 'labing-apat', 15: 'labing-lima', 16: 'labing-anim', 17: 'labing-pito', 18: 'labing-walo', 19: 'labing-siyam',
    20: 'dalawampu', 21: 'dalawampu\'t isa', 22: 'dalawampu\'t dalawa', 23: 'dalawampu\'t tatlo', 24: 'dalawampu\'t apat', 25: 'dalawampu\'t lima', 26: 'dalawampu\'t anim', 27: 'dalawampu\'t pito', 28: 'dalawampu\'t walo', 29: 'dalawampu\'t siyam',
    30: 'tatlumpu', 31: 'tatlumpu\'t isa', 32: 'tatlumpu\'t dalawa', 33: 'tatlumpu\'t tatlo', 34: 'tatlumpu\'t apat', 35: 'tatlumpu\'t lima', 36: 'tatlumpu\'t anim', 37: 'tatlumpu\'t pito', 38: 'tatlumpu\'t walo', 39: 'tatlumpu\'t siyam',
    40: 'apatnapu', 41: 'apatnapu\'t isa', 42: 'apatnapu\'t dalawa', 43: 'apatnapu\'t tatlo', 44: 'apatnapu\'t apat', 45: 'apatnapu\'t lima', 46: 'apatnapu\'t anim', 47: 'apatnapu\'t pito', 48: 'apatnapu\'t walo', 49: 'apatnapu\'t siyam',
    50: 'limampu', 51: 'limampu\'t isa', 52: 'limampu\'t dalawa', 53: 'limampu\'t tatlo', 54: 'limampu\'t apat', 55: 'limampu\'t lima', 56: 'limampu\'t anim', 57: 'limampu\'t pito', 58: 'limampu\'t walo', 59: 'limampu\'t siyam',
    60: 'animnapu', 61: 'animnapu\'t isa', 62: 'animnapu\'t dalawa', 63: 'animnapu\'t tatlo', 64: 'animnapu\'t apat', 65: 'animnapu\'t lima', 66: 'animnapu\'t anim', 67: 'animnapu\'t pito', 68: 'animnapu\'t walo', 69: 'animnapu\'t siyam',
    70: 'pitumpu', 71: 'pitumpu\'t isa', 72: 'pitumpu\'t dalawa', 73: 'pitumpu\'t tatlo', 74: 'pitumpu\'t apat', 75: 'pitumpu\'t lima', 76: 'pitumpu\'t anim', 77: 'pitumpu\'t pito', 78: 'pitumpu\'t walo', 79: 'pitumpu\'t siyam',
    80: 'walumpu', 81: 'walumpu\'t isa', 82: 'walumpu\'t dalawa', 83: 'walumpu\'t tatlo', 84: 'walumpu\'t apat', 85: 'walumpu\'t lima', 86: 'walumpu\'t anim', 87: 'walumpu\'t pito', 88: 'walumpu\'t walo', 89: 'walumpu\'t siyam',
    90: 'siyamnapu', 91: 'siyamnapu\'t isa', 92: 'siyamnapu\'t dalawa', 93: 'siyamnapu\'t tatlo', 94: 'siyamnapu\'t apat', 95: 'siyamnapu\'t lima', 96: 'siyamnapu\'t anim', 97: 'siyamnapu\'t pito', 98: 'siyamnapu\'t walo', 99: 'siyamnapu\'t siyam',
    100: 'isang daan'
  },
  hil: {
    1: 'isa', 2: 'duha', 3: 'tatlo', 4: 'apat', 5: 'lima', 6: 'anom', 7: 'pito', 8: 'walo', 9: 'siyam', 10: 'napulo',
    11: 'pulo kag isa', 12: 'pulo kag duha', 13: 'pulo kag tatlo', 14: 'pulo kag apat', 15: 'pulo kag lima', 16: 'pulo kag anom', 17: 'pulo kag pito', 18: 'pulo kag walo', 19: 'pulo kag siyam',
    20: 'duha ka pulo', 21: 'duha ka pulo kag isa', 22: 'duha ka pulo kag duha', 23: 'duha ka pulo kag tatlo', 24: 'duha ka pulo kag apat', 25: 'duha ka pulo kag lima', 26: 'duha ka pulo kag anom', 27: 'duha ka pulo kag pito', 28: 'duha ka pulo kag walo', 29: 'duha ka pulo kag siyam',
    30: 'tatlo ka pulo', 31: 'tatlo ka pulo kag isa', 32: 'tatlo ka pulo kag duha', 33: 'tatlo ka pulo kag tatlo', 34: 'tatlo ka pulo kag apat', 35: 'tatlo ka pulo kag lima', 36: 'tatlo ka pulo kag anom', 37: 'tatlo ka pulo kag pito', 38: 'tatlo ka pulo kag walo', 39: 'tatlo ka pulo kag siyam',
    40: 'apat ka pulo', 41: 'apat ka pulo kag isa', 42: 'apat ka pulo kag duha', 43: 'apat ka pulo kag tatlo', 44: 'apat ka pulo kag apat', 45: 'apat ka pulo kag lima', 46: 'apat ka pulo kag anom', 47: 'apat ka pulo kag pito', 48: 'apat ka pulo kag walo', 49: 'apat ka pulo kag siyam',
    50: 'lima ka pulo', 51: 'lima ka pulo kag isa', 52: 'lima ka pulo kag duha', 53: 'lima ka pulo kag tatlo', 54: 'lima ka pulo kag apat', 55: 'lima ka pulo kag lima', 56: 'lima ka pulo kag anom', 57: 'lima ka pulo kag pito', 58: 'lima ka pulo kag walo', 59: 'lima ka pulo kag siyam',
    60: 'anom ka pulo', 61: 'anom ka pulo kag isa', 62: 'anom ka pulo kag duha', 63: 'anom ka pulo kag tatlo', 64: 'anom ka pulo kag apat', 65: 'anom ka pulo kag lima', 66: 'anom ka pulo kag anom', 67: 'anom ka pulo kag pito', 68: 'anom ka pulo kag walo', 69: 'anom ka pulo kag siyam',
    70: 'pito ka pulo', 71: 'pito ka pulo kag isa', 72: 'pito ka pulo kag duha', 73: 'pito ka pulo kag tatlo', 74: 'pito ka pulo kag apat', 75: 'pito ka pulo kag lima', 76: 'pito ka pulo kag anom', 77: 'pito ka pulo kag pito', 78: 'pito ka pulo kag walo', 79: 'pito ka pulo kag siyam',
    80: 'walo ka pulo', 81: 'walo ka pulo kag isa', 82: 'walo ka pulo kag duha', 83: 'walo ka pulo kag tatlo', 84: 'walo ka pulo kag apat', 85: 'walo ka pulo kag lima', 86: 'walo ka pulo kag anom', 87: 'walo ka pulo kag pito', 88: 'walo ka pulo kag walo', 89: 'walo ka pulo kag siyam',
    90: 'siyam ka pulo', 91: 'siyam ka pulo kag isa', 92: 'siyam ka pulo kag duha', 93: 'siyam ka pulo kag tatlo', 94: 'siyam ka pulo kag upat', 95: 'siyam ka pulo kag lima', 96: 'siyam ka pulo kag anom', 97: 'siyam ka pulo kag pito', 98: 'siyam ka pulo kag walo', 99: 'siyam ka pulo kag siyam',
    100: 'isa ka gatos'
  }
};

    const ttsLanguages = {
  en: 'en-US',  // English
  fil: 'fil-PH',  // Filipino (Tagalog)
  hil: 'en-US'   // Hiligaynon (fallback to English if not supported)
};

    function updateCurrentLanguage(lang) {
      currentLanguage = lang;
      clearTimeout(languageSwitchTimeout);
  languageSwitchTimeout = setTimeout(() => {
    currentLanguage = lang;

      // If we're currently on the number table display page, re-render it with the new language
      if (document.getElementById('number-table-display-page').classList.contains('active') && currentTableStart !== null && currentTableEnd !== null) {
        showNumberTable(currentTableStart, currentTableEnd);
      }
      if (document.getElementById('counting-difficulty-page').classList.contains('active')) {
        showCountingDifficultyPage();
      } else if (document.getElementById('solving-difficulty-page').classList.contains('active')) {
        showSolvingDifficultyPage();
      }
    }, 100);
  }


    function applyQuizColors() {
      const config = window.elementSdk ? window.elementSdk.config : defaultConfig;
      const surfaceColor = config.surface_color || defaultConfig.surface_color;
      const bgColor = config.background_color || defaultConfig.background_color;
      const textColor = config.text_color || defaultConfig.text_color;
      
      const progressTexts = document.querySelectorAll('.progress-text');
      progressTexts.forEach(pt => {
        pt.style.background = surfaceColor;
        pt.style.color = bgColor;
      });

      const numberButtons = document.querySelectorAll('.number-btn');
      numberButtons.forEach(btn => {
        btn.style.background = surfaceColor;
        btn.style.color = bgColor;
      });

      const equationDisplay = document.getElementById('equation-display');
      if (equationDisplay) {
        equationDisplay.style.background = surfaceColor;
        equationDisplay.style.color = bgColor;
      }

      const answerInput = document.getElementById('answer-input');
      if (answerInput) {
        answerInput.style.borderColor = surfaceColor;
        answerInput.style.color = textColor;
        answerInput.style.background = 'transparent';
      }

      const checkBtn = document.getElementById('check-btn');
      if (checkBtn) {
        checkBtn.style.background = surfaceColor;
        checkBtn.style.color = bgColor;
      }

      const inequalityDisplay = document.getElementById('inequality-display');
      if (inequalityDisplay) {
        inequalityDisplay.style.background = surfaceColor;
      }

      const inequalityNumbers = document.querySelectorAll('inequality-number');
      inequalityNumbers.forEach(num => {
        num.style.color = bgColor;
      });

      const inequalitySymbol = document.querySelector('.inequality-symbol');
      if (inequalitySymbol) {
        inequalitySymbol.style.color = bgColor;
      }

      const inequalityButtons = document.querySelectorAll('.inequality-btn');
      inequalityButtons.forEach(btn => {
        btn.style.background = surfaceColor;
        btn.style.color = bgColor;
      });

      const scoreDisplays = document.querySelectorAll('.score-display');
      scoreDisplays.forEach(sd => {
        sd.style.background = surfaceColor;
      });

      const scoreNumbers = document.querySelectorAll('score-number');
      scoreNumbers.forEach(sn => {
        sn.style.color = bgColor;
      });

      const scoreMessages = document.querySelectorAll('.score-message');
      scoreMessages.forEach(sm => {
        sm.style.color = bgColor;
      });

      const tryAgainButtons = document.querySelectorAll('.try-again-btn');
      tryAgainButtons.forEach(btn => {
        btn.style.background = bgColor;
        btn.style.color = textColor;
      });

      const numberCards = document.querySelectorAll('.number-display-card');
      numberCards.forEach(card => {
        card.style.background = surfaceColor;
        const numberLarge = card.querySelector('.number-large');
        const wordLarge = card.querySelector('.word-large');
        if (numberLarge) numberLarge.style.color = bgColor;
        if (wordLarge) wordLarge.style.color = bgColor;
      });
    }

    // Navigation
    
    function showPage(pageId) {
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      document.getElementById(pageId).classList.add('active');
    }

    // Generate number table range buttons
    const numberTableRangeGrid = document.getElementById('number-table-range-grid');
    const icons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    for (let i = 0; i < 10; i++) {
      const start = i * 10 + 1;
      const end = (i + 1) * 10;
      
      const btn = document.createElement('button');
      btn.className = 'operation-btn';
      btn.innerHTML = `
        <span class="operation-icon">${icons[i]}</span>
        <span>${start}-${end}</span>
      `;
      btn.dataset.start = start;
      btn.dataset.end = end;
      btn.addEventListener('click', () => {
      playClickSound();  
    });
      numberTableRangeGrid.appendChild(btn);
    }



    function mapToEditPanelValues(config) {
      return new Map([
        ['app_title', config.app_title || defaultConfig.app_title],
        ['counting_button', config.counting_button || defaultConfig.counting_button],
        ['solving_button', config.solving_button || defaultConfig.solving_button],
        ['number_table_button', config.number_table_button || defaultConfig.number_table_button],
        ['inequality_button', config.inequality_button || defaultConfig.inequality_button]
      ]);

      
    }

   /* if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
      });
    }*/

    // Main menu navigation
    document.getElementById('counting-btn').addEventListener('click', () => {
      showPage('counting-difficulty-page');
    });

    document.getElementById('solving-btn').addEventListener('click', () => {
      showPage('solving-difficulty-page');
    });

    document.getElementById('number-table-btn').addEventListener('click', () => {
      showPage('number-table-page');
    });

  document.getElementById('inequality-btn').addEventListener('click', () => {
  showPage('inequality-difficulty-page');
});

    // Back button navigation
    document.getElementById('back-from-counting-difficulty').addEventListener('click', () => {
      showPage('main-page');
    });

    document.getElementById('back-from-counting-quiz').addEventListener('click', () => {
      showPage('counting-difficulty-page');
    });

    document.getElementById('back-from-counting-score').addEventListener('click', () => {
      showPage('counting-difficulty-page');
    });

    document.getElementById('back-from-solving-difficulty').addEventListener('click', () => {
      showPage('main-page');
    });

    document.getElementById('back-from-operation-selection').addEventListener('click', () => {
      showPage('solving-difficulty-page');
    });

    document.getElementById('back-from-solving-quiz').addEventListener('click', () => {
      showPage('operation-selection-page');
    });

    document.getElementById('back-from-solving-score').addEventListener('click', () => {
      showPage('solving-difficulty-page');
    });

    document.getElementById('back-from-number-table').addEventListener('click', () => {
      showPage('main-page');
    });

    document.getElementById('back-from-number-display').addEventListener('click', () => {
      showPage('number-table-page');
    });

    document.getElementById('back-from-inequality-difficulty').addEventListener('click', () => {
      showPage('main-page');
    });

    document.getElementById('back-from-inequality-quiz').addEventListener('click', () => {
      showPage('inequality-difficulty-page');
    });

    document.getElementById('back-from-inequality-score').addEventListener('click', () => {
      showPage('inequality-difficulty-page');
    });

    // Utility functions
    function shuffle(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    function generateSequence(start, end, difficulty) {

      let length = 5; // default = easy
      if (difficulty == "moderate" || difficulty == "hard") {
        length = 10;
  }

      const maxStart = end - 4;
      const randomStart = start + Math.floor(Math.random() * (maxStart - start + 1));
      
      const numbers = [];
      
      /*if (difficulty === 'easy') {
       for (let i = 0; i < 5; i++) {
        numbers.push(randomStart + i);
       }
      } else {
        for (let i = 0; i < 10; i++) {
        numbers.push(randomStart + i);
      }
    }
      return numbers;*/

   for (let i = 0; i < length; i++) {
    numbers.push(randomStart + i);
  }
      return numbers;
}

    function getScoreMessage(percentage) {
      const lang = localStorage.getItem('lang') || 'en';
       let messageKey;

  if (percentage === 100) {
    messageKey = 'score_message_100';
  } else if (percentage >= 80) {
    messageKey = 'score_message_80';
  } else if (percentage >= 60) {
    messageKey = 'score_message_60';
  } else if (percentage >= 40) {
    messageKey = 'score_message_40';
  } else {
    messageKey = 'score_message_below';
  }
  
  const message = translations[lang][messageKey] || translations['en'][messageKey];  // Fallback to English
  const icon = (percentage === 100) ? '🎉' : (percentage >= 80) ? '🌟' : (percentage >= 60) ? '👍' : (percentage >= 40) ? '😊' : '💪';
  
  return { icon, message };
    }

    // ===== COUNTING SECTION =====
          // max mistakes depends on difficulty

// ========================
// START QUIZ
// ========================
document.getElementById('counting-easy-btn').addEventListener('click', () => {
  startCountingQuiz('easy');
});
document.getElementById('counting-moderate-btn').addEventListener('click', () => {
  startCountingQuiz('moderate');
});
document.getElementById('counting-hard-btn').addEventListener('click', () => {
  startCountingQuiz('hard');
});

function startCountingQuiz(difficulty) {
  countingDifficulty = difficulty;
  countingScore = 0;
  countingProgress = 0;

  let start, end;

  if (difficulty === 'easy') {
    totalCountingQuestions = 5;
    countingTries = 3;   // easy has 3 tries
    start = 1;
    end = 20;
  } else if (difficulty === 'moderate') {
    totalCountingQuestions = 10;
    countingTries = 5;   // moderate has 5 tries
    start = 1;
    end = 50;
  } else {
    totalCountingQuestions = 10;
    countingTries = 7;   // hard has 7 tries
    start = 1;
    end = 100;
  }

  countingSequence = generateSequence(start, end, difficulty);
  showCountingQuestion();
  showPage('counting-quiz-page');
}

// ========================
// SHOW QUESTION
// ========================
function showCountingQuestion() {
  const numberGrid = document.getElementById('counting-number-grid');
  const progressText = document.getElementById('counting-progress-text');

  progressText.textContent = `${countingProgress} / ${totalCountingQuestions}`;
  numberGrid.innerHTML = '';

  const shuffled = shuffle(countingSequence);
  shuffled.forEach((num) => {
    const btn = document.createElement('button');
    btn.className = 'number-btn';
    btn.textContent = num;
    btn.dataset.value = num;
    btn.addEventListener('click', () => handleCountingClick(btn, num));
    numberGrid.appendChild(btn);
  });

  applyQuizColors();
}

// ========================
// HANDLE NUMBER CLICK
// ========================
function handleCountingClick(button, value) {
  const expectedValue = countingSequence[countingProgress];

  if (value === expectedValue) {
    // Correct
    button.classList.add('correct');
    countingProgress++;
    countingScore++;
  } else {
    // Wrong
    button.classList.add('wrong');
    countingProgress++;
  }

  // Update progress display
  const progressText = document.getElementById('counting-progress-text');
  progressText.textContent = `${countingProgress} / ${totalCountingQuestions}`;

  // Check end conditions
  if (countingProgress === countingSequence.length) {
    // End of sequence or out of tries — show score
    setTimeout(() => showCountingScore(), 500);
    
    applyQuizColors();
    showPage('counting-score-page');
  }
}

// ========================
// SHOW SCORE
// ========================
function showCountingScore() {
  const totalQuestions = totalCountingQuestions;
  const percentage = (countingScore / totalQuestions) * 100;
  currentCountingPercentage = percentage;

  const scoreIcon = document.getElementById('counting-score-icon');
  const scoreNumber = document.getElementById('counting-score-number');
  const scoreMessage = document.getElementById('counting-score-message');

  const { icon, message } = getScoreMessage(percentage);

  scoreIcon.textContent = icon;
  scoreNumber.textContent = `${countingScore} / ${totalQuestions}`;
  scoreMessage.textContent = message;

  applyQuizColors();
  showPage('counting-score-page');
}

// ========================
// RETRY & CHANGE DIFFICULTY
// ========================
document.getElementById('counting-try-again-btn').addEventListener('click', () => {
  startCountingQuiz(countingDifficulty);
});

document.getElementById('counting-difficulty-btn').addEventListener('click', () => {
  showPage('counting-difficulty-page');
});

// ========================
// UTILITY FUNCTIONS
// ========================
/* function generateSequence(start, end, difficulty) {
  let length = (difficulty === 'easy') ? 5 : 10;

  const maxStart = end - (length - 1);
  const randomStart = start + Math.floor(Math.random() * (maxStart - start + 1));

  const numbers = [];
  for (let i = 0; i < length; i++) numbers.push(randomStart + i);
  return numbers;
}

function shuffle(arr) {
  return arr
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value);
} */

    // ===== SOLVING SECTION =====

    const numberImages = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🥕', '🌽', '🍒', '🍑', '🥝'];

    document.getElementById('solving-easy-btn').addEventListener('click', () => {
      solvingDifficulty = 'easy';
      showPage('operation-selection-page');
    });

    document.getElementById('solving-moderate-btn').addEventListener('click', () => {
      solvingDifficulty = 'moderate';
      showPage('operation-selection-page');
    });

    document.getElementById('solving-hard-btn').addEventListener('click', () => {
      solvingDifficulty = 'hard';
      showPage('operation-selection-page');
    });

    document.getElementById('add-operation-btn').addEventListener('click', () => {
      startSolving(solvingDifficulty, 'add');
    });

    document.getElementById('subtract-operation-btn').addEventListener('click', () => {
      startSolving(solvingDifficulty, 'subtract');
    });

    function generateEquation(start, end, operation) {
      let num1, num2, answer;
      
      if (operation === 'add') {
        num1 = start + Math.floor(Math.random() * (end - start + 1));
        const maxNum2 = end - num1;
        num2 = Math.floor(Math.random() * (maxNum2 + 1));
        answer = num1 + num2;
      } else {
        num1 = start + Math.floor(Math.random() * (end - start + 1));
        num2 = Math.floor(Math.random() * (num1 - start + 1));
        answer = num1 - num2;
      }
      
      const imageIndex = Math.floor(Math.random() * numberImages.length);
      const image = numberImages[imageIndex];
      
      return { num1, num2, answer, operation, image };
    }

    function generateImagesHTML(count, image) {
      let html = '<div class="equation-group">';
      html += '<div class="equation-images">';
      for (let i = 0; i < count; i++) {
        html += `<span class="equation-item">${image}</span>`;
      }
      html += '</div>';
      html += `<span class="equation-number">${count}</span>`;
      html += '</div>';
      return html;
    }

    function generateSolvingQuestions(difficulty, operation) {
      const questions = [];
      let count, start, end;

      if (difficulty === 'easy') {
        count = 5;
        start = 1;
        end = 10;
      } else if (difficulty === 'moderate') {
        count = 10;
        start = 1;
        end = 20;
      } else {
        count = 10;
        start = 1;
        end = 50;
      }

      for (let i = 0; i < count; i++) {
        questions.push(generateEquation(start, end, operation));
      }

      return questions;
    }

    function showSolvingQuestion() {
      const question = solvingQuestions[currentSolvingIndex];
      const equationDisplay = document.getElementById('equation-display');
      const answerInput = document.getElementById('answer-input');
      const feedbackMessage = document.getElementById('feedback-message');
      const progressText = document.getElementById('solving-progress-text');
      
      const opSymbol = question.operation === 'add' ? '+' : '−';
      
      equationDisplay.innerHTML = `
        ${generateImagesHTML(question.num1, question.image)}
        <span class="equation-operator">${opSymbol}</span>
        ${generateImagesHTML(question.num2, question.image)}
        <span class="equation-equals">=</span>
        <span class="equation-operator">?</span>
      `;
      
      answerInput.value = '';
      feedbackMessage.style.display = 'none';
      progressText.textContent = `${currentSolvingIndex + 1} / ${solvingQuestions.length}`;
      
      applyQuizColors();
    }

    function startSolving(difficulty, operation) {
      solvingDifficulty = difficulty;
      currentOperation = operation;
      solvingQuestions = generateSolvingQuestions(difficulty, operation);
      currentSolvingIndex = 0;
      solvingScore = 0;

      showSolvingQuestion();
      showPage('solving-quiz-page');
    }

    document.getElementById('check-btn').addEventListener('click', () => {
      const answerInput = document.getElementById('answer-input');
      const feedbackMessage = document.getElementById('feedback-message');
      const checkBtn = document.getElementById('check-btn');
      
      const userAnswer = parseInt(answerInput.value);
      
      if (isNaN(userAnswer)) {
        return;
      }
      
      const question = solvingQuestions[currentSolvingIndex];
      checkBtn.disabled = true;
      feedbackMessage.style.display = 'block';
      
      if (userAnswer === question.answer) {
        feedbackMessage.textContent = '🎉 Correct!';
        feedbackMessage.style.background = '#10b981';
        feedbackMessage.style.color = '#ffffff';
        solvingScore++;

        setTimeout(() => {
          currentSolvingIndex++;
          checkBtn.disabled = false;
        if (currentSolvingIndex < solvingQuestions.length) {
            showSolvingQuestion();
          } else {
            showSolvingScore();
          }
        }, 800);
      } else {
        feedbackMessage.textContent = '❌ Wrong! The answer is ' + question.answer;
        feedbackMessage.style.background = '#ef4444';
        feedbackMessage.style.color = '#ffffff';

        setTimeout(() => {
          currentSolvingIndex++;
          checkBtn.disabled = false;
          if (currentSolvingIndex < solvingQuestions.length) {
            showSolvingQuestion();
          } else {
            showSolvingScore();
          }
        }, 1500);
      }

    });

  function showSolvingScore() {
      const totalQuestions = solvingQuestions.length;
      const percentage = (solvingScore / totalQuestions) * 100;
      currentSolvingPercentage = percentage;
      
      const scoreIcon = document.getElementById('solving-score-icon');
      const scoreNumber = document.getElementById('solving-score-number');
      const scoreMessage = document.getElementById('solving-score-message');

      const { icon, message } = getScoreMessage(percentage);
      
      scoreIcon.textContent = icon;
      scoreNumber.textContent = `${solvingScore} / ${totalQuestions}`;
      scoreMessage.textContent = message;

      const yourScoreText = message[currentLanguage]?.yourScore || "Your Score";
      document.getElementById('ur-score').textContent = `${yourScoreText}: ${Math.round(percentage)}%`;  
      applyQuizColors();
      showPage('solving-score-page');
    
  }
    document.getElementById('solving-try-again-btn').addEventListener('click', () => {
      startSolving(solvingDifficulty, currentOperation);
    });

    document.getElementById('solving-difficulty-btn').addEventListener('click', () => {
      showPage('solving-difficulty-page');
    });
  
    // ===== NUMBER TABLE SECTION =====


   /* function showNumberTable(start, end) {
      currentTableStart = start;
      currentTableEnd = end;

      const numberDisplayList = document.getElementById('number-display-list');
      const numberDisplayTitle = document.getElementById('number-display-title');
      //const words = (numberWords[currentLanguage] && numberWords[currentLanguage].numberWords) || numberWords.en || numberWords.fil || numberWords.hil;
      const numberWordsforlang = numberWords[currentLanguage] || numberWords.en || numberWords.fil || numberWords.hil;
      
      numberDisplayTitle.textContent = `${start}-${end}`;
      numberDisplayList.innerHTML = '';
      
      
      for (let num = start; num <= end; num++) {
        const card = document.createElement('div');
        card.className = 'number-display-card';
        
        const numberLarge = document.createElement('div');
        numberLarge.className = 'number-large';
        numberLarge.textContent = num;
        
        const wordLarge = document.createElement('div');
        wordLarge.className = 'word-large';
        wordLarge.textContent = numberWordsforlang[num] || numberWords.en[num];
        
        card.appendChild(numberLarge);
        card.appendChild(wordLarge);
        
        numberDisplayList.appendChild(card);
        //applyQuizColors();
        //showPage('number-table-display-page');
      }
      
      applyQuizColors();
      showPage('number-table-display-page');
    } 

      function showNumberTable(start, end) {
      currentTableStart = start;
      currentTableEnd = end;

      const numberDisplayList = document.getElementById('number-display-list');
      const numberDisplayTitle = document.getElementById('number-display-title');
      const numberWordsForLang = numberWords[currentLanguage] || numberWords.en;

      numberDisplayTitle.textContent = `${start}-${end}`;

      // If the grid is already rendered, update text in-place instead of re-creating
      const existingCards = numberDisplayList.querySelectorAll('.number-display-card');
      if (existingCards.length === (end - start + 1)) {
        // Update existing cards
        let num = start;
        existingCards.forEach(card => {
          const numberLarge = card.querySelector('.number-large');
          const wordLarge = card.querySelector('.word-large');
          if (numberLarge) numberLarge.textContent = num;
          if (wordLarge) wordLarge.textContent = numberWordsForLang[num] || numberWords.en[num];
          num++;
        });
      } else {
        // Full re-render only if the range size changed (fallback)
        numberDisplayList.innerHTML = '';
        for (let num = start; num <= end; num++) {
          const card = document.createElement('div');
          card.className = 'number-display-card';

          const numberLarge = document.createElement('div');
          numberLarge.className = 'number-large';
          numberLarge.textContent = num;

          const wordLarge = document.createElement('div');
          wordLarge.className = 'word-large';
          wordLarge.textContent = numberWordsForLang[num] || numberWords.en[num];

          //TTS click event
          card.addEventListener('click', () => {
          speakNumberWord(num);
        });
          card.appendChild(numberLarge);
          card.appendChild(wordLarge);
          numberDisplayList.appendChild(card);
        }
      }

      applyQuizColors();
      showPage('number-table-display-page');
    }*/


      function showNumberTable(start, end) {
  currentTableStart = start;
  currentTableEnd = end;

  const numberDisplayList = document.getElementById('number-display-list');
  const numberDisplayTitle = document.getElementById('number-display-title');
  const numberWordsForLang = numberWords[currentLanguage] || numberWords.en;

  numberDisplayTitle.textContent = `${start}-${end}`;

  // Always re-render to ensure correct TTS listeners
  numberDisplayList.innerHTML = '';
  for (let num = start; num <= end; num++) {
    const card = document.createElement('div');
    card.className = 'number-display-card';

    const numberLarge = document.createElement('div');
    numberLarge.className = 'number-large';
    numberLarge.textContent = num;

    const wordLarge = document.createElement('div');
    wordLarge.className = 'word-large';
    wordLarge.textContent = numberWordsForLang[num] || numberWords.en[num];

    // TTS click event with correct num closure
    card.addEventListener('click', () => {
      speakNumberWord(num);
    });

    card.appendChild(numberLarge);
    card.appendChild(wordLarge);
    numberDisplayList.appendChild(card);
  }

  applyQuizColors();
  showPage('number-table-display-page');
}

    //TTS FUNCTION
    function speakNumberWord(num) {
      console.log('Attempting TTS for', num, '- TTS enabled:', ttsEnabled);  // Debug log
      console.log('numberWords:', numberWords);
  if (!ttsEnabled || !('speechSynthesis' in window)) {
    console.warn('TTS skipped: disabled or not supported.');
    return;
  }
      if (!ttsEnabled || !('speechSynthesis' in window)) {
    console.warn('TTS is disabled or not supported.');
    return;
    }
    if (!('speechSynthesis' in window)) {
      console.warn('TTS not supported in this browser.');
      return;
    }

  const lang = currentLanguage || 'en';
  const word = (numberWords[lang] && numberWords[lang][num]) || numberWords.en[num];
  if (!word) return;

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = ttsLanguages[lang] || 'en-US';  // Set language for TTS

  // Optional: Select a voice if available (e.g., for better Filipino support)
  const voices = speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => voice.lang.startsWith(utterance.lang));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  speechSynthesis.speak(utterance);
}   

    function playClickSound() {
  const clickSound = document.getElementById('click-sound');
  if (clickSound) {
    try {
      clickSound.currentTime = 0;
      clickSound.play().catch(error => {
        console.error('Error playing click sound:', error);
      });
    } catch (error) {
      console.error('Error resetting click sound:', error);
    }
  } else {
    console.warn('Click sound element not found.');
  }
}

        numberTableRangeGrid.addEventListener('click', (e) => {
      const rangeBtn = e.target.closest('.operation-btn');
      if (rangeBtn) {
        const start = parseInt(rangeBtn.dataset.start);
        const end = parseInt(rangeBtn.dataset.end);
        showNumberTable(start, end);
      }
    });
    
    //Fallback
    
    
    // ===== INEQUALITY SECTION =====

    document.getElementById('inequality-easy-btn').addEventListener('click', () => {
      startInequalityQuiz('easy');
    });

    document.getElementById('inequality-moderate-btn').addEventListener('click', () => {
      startInequalityQuiz('moderate');
    });

    document.getElementById('inequality-hard-btn').addEventListener('click', () => {
      startInequalityQuiz('hard');
    });

    function generateInequalityQuestions(difficulty) {
      const questions = [];
      let count, minRange, maxRange;

      if (difficulty === 'easy') {
        count = 5;
        minRange = 1;
        maxRange = 9;
      } else if (difficulty === 'moderate') {
        count = 10;
        minRange = 1;
        maxRange = 99;
      } else {
        count = 10;
        minRange = 10;
        maxRange = 99;
      }

      for (let i = 0; i < count; i++) {
        let num1, num2;
        
        if (difficulty === 'moderate') {
          if (Math.random() < 0.5) {
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 90) + 10;
          } else {
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 9) + 1;
          }
        } else {
          num1 = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
          num2 = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        }

        let correctSymbol;
        if (num1 < num2) correctSymbol = '<';
        else if (num1 > num2) correctSymbol = '>';
        else correctSymbol = '=';

        questions.push({ num1, num2, correctSymbol });
      }

      return questions;
    }

    function startInequalityQuiz(difficulty) {
      inequalityDifficulty = difficulty;
      inequalityQuestions = generateInequalityQuestions(difficulty);
      currentInequalityIndex = 0;
      inequalityScore = 0;

      showInequalityQuestion();
      showPage('inequality-quiz-page');
    }

    function showInequalityQuestion() {
      const question = inequalityQuestions[currentInequalityIndex];
      const leftNum = document.getElementById('inequality-left');
      const rightNum = document.getElementById('inequality-right');
      const progressText = document.getElementById('inequality-progress-text');

      leftNum.textContent = question.num1;
      rightNum.textContent = question.num2;
      progressText.textContent = `${currentInequalityIndex + 1} / ${inequalityQuestions.length}`;

      document.querySelectorAll('.inequality-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
      });

      applyQuizColors();
    }

    function handleInequalityAnswer(selectedSymbol, button) {
      const question = inequalityQuestions[currentInequalityIndex];
      const allButtons = document.querySelectorAll('.inequality-btn');

      allButtons.forEach(btn => btn.disabled = true);

      if (selectedSymbol === question.correctSymbol) {
        button.classList.add('correct');
        inequalityScore++;

        setTimeout(() => {
          currentInequalityIndex++;
          if (currentInequalityIndex < inequalityQuestions.length) {
            showInequalityQuestion();
          } else {
            showInequalityScore();
          }
        }, 800);
      } else {
        button.classList.add('wrong');

        setTimeout(() => {
          currentInequalityIndex++;
          if (currentInequalityIndex < inequalityQuestions.length) {
            showInequalityQuestion();
          } else {
            showInequalityScore();
          }
        }, 800);
      }
    }

    function showInequalityScore() {
      const totalQuestions = inequalityQuestions.length;
      const percentage = (inequalityScore / totalQuestions) * 100;
      currentInequalityPercentage = percentage;

      const scoreIcon = document.getElementById('inequality-score-icon');
      const scoreNumber = document.getElementById('inequality-score-number');
      const scoreMessage = document.getElementById('inequality-score-message');

      const { icon, message } = getScoreMessage(percentage);
      
      scoreIcon.textContent = icon;
      scoreNumber.textContent = `${inequalityScore} / ${totalQuestions}`;
      scoreMessage.textContent = message;

      const yourScoreText = message[currentLanguage]?.yourScore || "Your Score";
      document.getElementById('ur-score').textContent = `${yourScoreText}: ${Math.round(percentage)}%`;

      applyQuizColors();
      showPage('inequality-score-page');
      //showPage('inequality-difficulty-page');
    }

    document.getElementById('inequality-options').addEventListener('click', (e) => {
      const button = e.target.closest('.inequality-btn');
      if (button && !button.disabled) {
        const selectedSymbol = button.dataset.symbol;
        handleInequalityAnswer(selectedSymbol, button);
      }
    });

    document.getElementById('inequality-try-again-btn').addEventListener('click', () => {
      startInequalityQuiz(inequalityDifficulty);
    });

  document.getElementById('inequality-difficulty-btn').addEventListener('click', () => { 
  showPage('inequality-difficulty-page');
});

    // Mute/Unmute Background Music
const muteBtn = document.getElementById('mute-btn');
const bgMusic = document.getElementById('bg-music');

muteBtn.addEventListener('click', () => {
  bgMusicMuted = !bgMusicMuted;
  bgMusic.muted = bgMusicMuted;
  localStorage.setItem('bgMusicMuted', bgMusicMuted); 
  console.log('Background music muted:', bgMusicMuted);
  if (bgMusic.muted) {
    bgMusic.muted = false;
    muteBtn.textContent = '🎵';  // Unmute icon
    muteBtn.title = 'Mute Background Music';
    muteBtn.classList.remove('disabled');
  } else {
    bgMusic.muted = true;
    muteBtn.textContent = '🤐';  // Mute icon
    muteBtn.title = 'Unmute Background Music';
    muteBtn.classList.add('disabled');
  }
});

    // TTS Enable/Disable
const ttsBtn = document.getElementById('tts-btn');
ttsBtn.addEventListener('click', () => {
  ttsEnabled = !ttsEnabled;
  localStorage.setItem('ttsEnabled', ttsEnabled); //save to storage
  console.log('TTS enabled:', ttsEnabled);
  if (ttsEnabled) {
    ttsBtn.textContent = '🔊';  // Enabled icon
    ttsBtn.title = 'Disable Text-to-Speech';
    ttsBtn.classList.remove('disabled');
  } else {
    ttsBtn.textContent = '🔇';  // Disabled icon
    ttsBtn.title = 'Enable Text-to-Speech';
    ttsBtn.classList.add('disabled');  //
  }
});

// Set initial TTS button state based on loaded value
if (ttsEnabled) {
  ttsBtn.textContent = '🔊';
  ttsBtn.title = 'Disable Text-to-Speech';
  ttsBtn.classList.remove('disabled');
} else {
  ttsBtn.textContent = '🔇';
  ttsBtn.title = 'Enable Text-to-Speech';
  ttsBtn.classList.add('disabled');
}

if (!bgMusic.muted) {
  muteBtn.textContent = '🎵';
  muteBtn.title = 'Mute Background Music';
  muteBtn.classList.remove('disabled');
} else {
  muteBtn.textContent = '🤐';
  muteBtn.title = 'Unmute Background Music';
  muteBtn.classList.add('disabled');
}

    // Initialize
    if (window.elementSdk) {
      onConfigChange(window.elementSdk.config || defaultConfig);
    } else {
      onConfigChange(defaultConfig);
    }

    function mapToCapabilities(config) {
      return {
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              config.surface_color = value;
              window.elementSdk.setConfig({ surface_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.primary_action_color || defaultConfig.primary_action_color,
            set: (value) => {
              config.primary_action_color = value;
              window.elementSdk.setConfig({ primary_action_color: value });
            }
          },
          {
            get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
            set: (value) => {
              config.secondary_action_color = value;
              window.elementSdk.setConfig({ secondary_action_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      };
    }
    
