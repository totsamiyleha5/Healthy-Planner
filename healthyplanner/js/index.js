if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}
function ready() {
    if (document.getElementById('timer')) {
        pomodoroTimer();
    };
    headerMoves();
}
function pomodoroTimer() {
    const timer = document.getElementById('pomodoro-count');
    const tabs = document.querySelectorAll('.btn-switch');
    const pomoTab = document.getElementById('pomodoro');
    const shortTab = document.getElementById('short-break');
    const longTab = document.getElementById('long-break');
    const btn = document.getElementById('start');
    const progressBar = document.getElementById('progress-bar');
    const pomoCounter = document.getElementById('pomo-number-total');
    const clickSound = new Audio('audio/click-sound.mp3');
    const finishSound = new Audio('audio/finish.mp3');
    let pomoTimer = null;
    let isRunning = false;
    let type = 'pomo';  
    let pomoCount = 0;
    let pomoCountTotal = 0;
    const pomoTime = 1500;
    const shortBreak = 300;
    const longBreak = 600;
    let time = pomoTime;
    let progressTotal = time;
    let progressNow = (time / progressTotal) * 100;
    btn.addEventListener('click', () => {
        if (!isRunning) {
            pomoTimer = setInterval(timerStarts, 1000);
            btn.classList.add('pressed');
            btn.innerHTML = 'PAUSE';
            clickSound.play();
        } else {
            timerStops();
        }
        isRunning = !isRunning;
    });
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            btn.click();
        }
    });
    function timerStarts() {
        
        if (time === 0) {
            timerStops(true);
            finishSound.play();
            isRunning = false;
            pomoTimer = null;
            if (type === 'pomo') {
                pomoCount++;
                pomoCountTotal++;
                pomoCounter.innerHTML = pomoCountTotal;
            }
            if (type === 'pomo' && pomoCount < 4) {
                switchToShort();
            } else if (type === 'pomo' && pomoCount === 4) {
                switchToLong();
            } else if (type === 'long') {
                switchToPomo();
                pomoCount = 0;
            } else {
                switchToPomo();
            }
        } else {
            if (type === 'pomo') {
                switchBackground('green');
                time--;
                timer.innerHTML = formatTime(time);
                progressBarCount();
            } else {
                time--;
                timer.innerHTML = formatTime(time);
                progressBarCount();
            };
        }
    };
    function timerStops(silent = false) {
        if (!silent) clickSound.play();
        clearInterval(pomoTimer);
        btn.classList.remove('pressed');
        btn.innerHTML = 'START';
    };
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    function switchToShort() {
        type = 'short';
        tabs.forEach((tab) => tab.classList.remove('active'));
        shortTab.classList.add('active');
        switchBackground('purple');
        time = shortBreak;
        timer.innerHTML = formatTime(time); 
        progressTotal = time;
        progressBarCount(); 
    }
    function switchToLong() {
        type = 'long';
        tabs.forEach((tab) => tab.classList.remove('active'));
        longTab.classList.add('active');
        switchBackground('orange');
        time = longBreak;
        timer.innerHTML = formatTime(time);  
        progressTotal = time;
        progressBarCount(); 
    }
    function switchToPomo() {
        type = 'pomo';
        tabs.forEach((tab) => tab.classList.remove('active'));
        pomoTab.classList.add('active');
        switchBackground('default');
        time = pomoTime;
        timer.innerHTML = formatTime(time);
        progressTotal = time;   
        progressBarCount();
    }
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const tabID = tab.getAttribute('id');
            timerStops(true);
            isRunning = false;
            pomoTimer = null;
            const body = document.body;
            if (tabID === 'pomodoro') {
                switchToPomo();
            } 
            if (tabID === 'short-break') {
                switchToShort();
            } 
            if (tabID === 'long-break') {
                switchToLong();
            }
        });
    });
    function progressBarCount() {
        progressNow = (time / progressTotal) * 100;
        progressBar.style.width = `${progressNow}%`;
    };
};
function switchBackground(type) {
    document.querySelectorAll('.bg-layer').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`.bg-${type}`).classList.add('active');
};
function headerMoves() {
    const header = document.getElementById('header');
    window.addEventListener("scroll", () => {
        if (window.scrollY >= 50) {
            header.classList.add('moved');
        } else {
            header.classList.remove('moved');
        }
    });
};