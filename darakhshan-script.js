// ===== Configuration =====
const BIRTHDAY_DATE = new Date('March 22, 2026 00:00:00').getTime(); // Change to desired date

// ===== DOM Elements =====
const screens = {
    1: document.getElementById('screen1'),
    2: document.getElementById('screen2'),
    3: document.getElementById('screen3'),
    4: document.getElementById('screen4'),
    5: document.getElementById('screen5')
};

const countdownElements = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

const buttons = {
    countdownCelebrate: document.getElementById('countdownCelebrateBtn'),
    revealCelebrate: document.getElementById('revealCelebrateBtn'),
    yes: document.getElementById('yesBtn'),
    no: document.getElementById('noBtn'),
    letsGo: document.getElementById('letsGoBtn'),
    light: document.getElementById('lightBtn')
};

const surpriseElements = {
    darkOverlay: document.getElementById('darkOverlay'),
    roomDecorations: document.getElementById('roomDecorations'),
    fairyLights: document.getElementById('fairyLights'),
    floatingBalloons: document.getElementById('floatingBalloons'),
    cakeContainer: document.getElementById('cakeContainer'),
    finalTitle: document.getElementById('finalTitle'),
    envelopeOverlay: document.getElementById('envelopeOverlay'),
    envelopeContainer: document.getElementById('envelopeContainer'),
    letter: document.getElementById('letter'),
    clickHint: document.getElementById('clickHint')
};

const audio = {
    birthdayMusic: document.getElementById('birthdayMusic')
};

const bgDecorations = document.getElementById('bgDecorations');

// ===== State =====
let currentScreen = 1;
let countdownInterval = null;
let celebrationStarted = false;

// ===== Background Decorations =====
function createFloatingDecorations() {
    const decorations = ['💕', '💗', '💖', '✨', '⭐', '💫', '🌟'];
    const count = 20;

    for (let i = 0; i < count; i++) {
        const decoration = document.createElement('span');
        const isHeart = Math.random() > 0.4;
        decoration.className = isHeart ? 'floating-heart' : 'floating-star';
        decoration.textContent = decorations[Math.floor(Math.random() * decorations.length)];
        decoration.style.left = Math.random() * 100 + '%';
        decoration.style.animationDelay = Math.random() * 8 + 's';
        decoration.style.animationDuration = (Math.random() * 4 + 6) + 's';
        bgDecorations.appendChild(decoration);
    }
}

// ===== Screen Navigation =====
function showScreen(screenNumber) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        setTimeout(() => {
            if (!screen.classList.contains('active')) {
                screen.style.display = 'none';
            }
        }, 800);
    });

    // Show target screen
    setTimeout(() => {
        screens[screenNumber].style.display = 'flex';
        setTimeout(() => {
            screens[screenNumber].classList.add('active');
        }, 50);
        currentScreen = screenNumber;
    }, 800);
}

// ===== Countdown Timer =====
function updateCountdown() {
    const now = new Date().getTime();
    const distance = BIRTHDAY_DATE - now;

    if (distance < 0) {
        // Birthday has arrived!
        clearInterval(countdownInterval);
        countdownElements.hours.textContent = '00';
        countdownElements.minutes.textContent = '00';
        countdownElements.seconds.textContent = '00';
        
        // Auto-start celebration
        if (!celebrationStarted) {
            startCelebration();
        }
        return;
    }

    // Calculate time units (showing hours instead of days for more dynamic feel)
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update display with flip animation
    updateFlipDigit(countdownElements.hours, String(hours).padStart(2, '0'));
    updateFlipDigit(countdownElements.minutes, String(minutes).padStart(2, '0'));
    updateFlipDigit(countdownElements.seconds, String(seconds).padStart(2, '0'));
}

function updateFlipDigit(element, newValue) {
    if (element.textContent !== newValue) {
        const card = element.parentElement;
        card.style.transform = 'rotateX(-90deg)';
        
        setTimeout(() => {
            element.textContent = newValue;
            card.style.transform = 'rotateX(0deg)';
        }, 150);
    }
}

function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// ===== Celebration Flow =====
function startCelebration() {
    celebrationStarted = true;
    showScreen(2);
}

function showModal() {
    showScreen(3);
}

function showTransition() {
    showScreen(4);
}

function showFinalSurprise() {
    showScreen(5);
    
    // Start the surprise sequence
    setTimeout(() => {
        startSurpriseSequence();
    }, 1000);
}

// ===== Final Surprise Sequence =====
function startSurpriseSequence() {
    // Step 1: Show room decorations (after light is turned on)
    surpriseElements.roomDecorations.classList.add('visible');
    surpriseElements.fairyLights.classList.add('visible');

    // Show birthday banner
    const banner = document.getElementById('birthdayBanner');
    if (banner) {
        banner.classList.add('visible');
    }

    // Step 2: Show balloons (1 second later)
    setTimeout(() => {
        surpriseElements.floatingBalloons.classList.add('visible');
    }, 1000);

    // Step 3: Show cake with layer-by-layer drop (2 seconds after balloons)
    setTimeout(() => {
        dropCakeLayerByLayer();
    }, 2000);

    // Step 4: Show final title (after cake completes - 2.5 seconds)
    setTimeout(() => {
        surpriseElements.finalTitle.classList.add('visible');
        // After title appears, start blow candles countdown
        setTimeout(() => {
            showBlowCandlesPrompt();
        }, 2000);
    }, 4500);
}

// ===== Blow Candles Prompt =====
function showBlowCandlesPrompt() {
    // Use the existing placeholder
    const blowPrompt = document.getElementById('blowPromptPlaceholder');
    if (!blowPrompt) return;
    
    blowPrompt.innerHTML = `
        <p class="blow-prompt-text-inline handwritten">Make a wish & blow the candles! 🕯️</p>
        <div class="blow-countdown-inline" id="blowCountdown">5</div>
    `;
    blowPrompt.style.visibility = 'visible';

    // Start countdown
    let countdown = 5;
    const countdownElement = document.getElementById('blowCountdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownElement.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            blowCandles();
            // Hide prompt after candles are blown
            setTimeout(() => {
                blowPrompt.style.visibility = 'hidden';
                blowPrompt.innerHTML = '';
            }, 500);
        }
    }, 1000);
}

function blowCandles() {
    const cakeContainer = surpriseElements.cakeContainer;
    if (!cakeContainer) return;

    const candles = cakeContainer.querySelectorAll('.candle');
    
    // Remove flame from all candles
    candles.forEach((candle) => {
        candle.classList.remove('flame');
        candle.classList.add('blown');
    });

    // Add smoke effect
    candles.forEach((candle, index) => {
        setTimeout(() => {
            const smoke = document.createElement('span');
            smoke.className = 'smoke-effect';
            candle.appendChild(smoke);
            setTimeout(() => smoke.remove(), 2000);
        }, index * 200);
    });

    // Show envelope after candles are blown
    setTimeout(() => {
        showEnvelope();
    }, 1500);
}

// ===== Envelope Popup =====
function showEnvelope() {
    surpriseElements.envelopeOverlay.classList.add('visible');
}

function openEnvelope() {
    const envelopeContainer = surpriseElements.envelopeContainer;
    const letter = surpriseElements.letter;

    if (!envelopeContainer || !letter) return;

    // Open the envelope flap
    const flap = envelopeContainer.querySelector('.envelope-flap');
    if (flap) {
        flap.classList.add('open');
    }

    // Slide out the letter
    setTimeout(() => {
        letter.classList.add('open');
        envelopeContainer.classList.add('opened');
    }, 600);
}

// ===== Cake Layer by Layer Drop Animation =====
function dropCakeLayerByLayer() {
    const cakeContainer = surpriseElements.cakeContainer;
    if (!cakeContainer) return;

    // First make the container visible
    cakeContainer.classList.add('visible');

    const cakeTop = cakeContainer.querySelector('.cake-top');
    const cakePlate = cakeContainer.querySelector('.cake-plate');
    const cakeLayers = cakeContainer.querySelectorAll('.cake-layer');
    const candles = cakeContainer.querySelectorAll('.candle');

    // Sequence: Plate → Bottom Layer → Middle Layer → Top Layer → Candles
    // Total duration: ~2 seconds

    // 1. Drop the plate (0ms)
    setTimeout(() => {
        if (cakePlate) cakePlate.classList.add('visible');
    }, 0);

    // 2. Drop bottom layer (300ms)
    setTimeout(() => {
        if (cakeLayers[2]) cakeLayers[2].classList.add('visible');
    }, 300);

    // 3. Drop middle layer (600ms)
    setTimeout(() => {
        if (cakeLayers[1]) cakeLayers[1].classList.add('visible');
    }, 600);

    // 4. Drop top layer (900ms)
    setTimeout(() => {
        if (cakeLayers[0]) cakeLayers[0].classList.add('visible');
    }, 900);

    // 5. Drop cake top (1200ms)
    setTimeout(() => {
        if (cakeTop) cakeTop.classList.add('visible');
    }, 1200);

    // 6. Light up candles (1500ms)
    setTimeout(() => {
        candles.forEach((candle, index) => {
            setTimeout(() => {
                candle.classList.add('visible');
            }, index * 100);
        });
    }, 1500);
}

// ===== Event Listeners =====
buttons.countdownCelebrate.addEventListener('click', () => {
    startCelebration();
});

buttons.revealCelebrate.addEventListener('click', () => {
    showModal();
});

buttons.yes.addEventListener('click', () => {
    showTransition();
});

buttons.no.addEventListener('click', () => {
    // Playful - keep asking until they say yes
    const noBtn = buttons.no;
    noBtn.textContent = 'Please? 🥺';
    
    // Move button randomly on hover
    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    // After a few attempts, auto-accept
    let clickCount = 0;
    noBtn.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 3) {
            showTransition();
        } else {
            const phrases = ['Are you sure? 🥺', 'Please say yes! 💕', 'Okay, last chance! ✨'];
            noBtn.textContent = phrases[clickCount - 1] || 'Okay! 🎉';
        }
    });
});

buttons.letsGo.addEventListener('click', () => {
    // Play background music
    if (audio.birthdayMusic) {
        audio.birthdayMusic.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
    }
    showFinalSurprise();
});

buttons.light.addEventListener('click', () => {
    // Hide dark overlay
    surpriseElements.darkOverlay.classList.add('hidden');
});

// Envelope click to open (supports both click and touch)
if (surpriseElements.envelopeContainer) {
    let envelopeClicked = false;
    
    surpriseElements.envelopeContainer.addEventListener('click', (e) => {
        if (!envelopeClicked) {
            envelopeClicked = true;
            openEnvelope();
        }
        e.preventDefault();
    });

    // Touch support for mobile
    surpriseElements.envelopeContainer.addEventListener('touchend', (e) => {
        if (!envelopeClicked) {
            envelopeClicked = true;
            openEnvelope();
        }
        e.preventDefault();
    });
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Optional: Add escape functionality
    }
});

// ===== Initialize =====
window.addEventListener('load', () => {
    createFloatingDecorations();
    startCountdown();

    // Check if birthday has already arrived
    if (new Date().getTime() >= BIRTHDAY_DATE) {
        startCelebration();
    }
});

// ===== Performance: Pause animations when tab is not visible =====
document.addEventListener('visibilitychange', () => {
    // Animations will naturally pause when tab is hidden
    // This is handled by CSS and requestAnimationFrame
});

// ===== Prevent double-tap zoom on mobile =====
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== Handle orientation change =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recenter envelope on orientation change
        if (surpriseElements.envelopeOverlay && 
            surpriseElements.envelopeOverlay.classList.contains('visible')) {
            // Trigger reflow to recalculate centering
            surpriseElements.envelopeOverlay.style.display = 'none';
            surpriseElements.envelopeOverlay.offsetHeight; // Force reflow
            surpriseElements.envelopeOverlay.style.display = 'flex';
        }
    }, 250);
});
