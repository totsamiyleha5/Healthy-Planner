if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}
function ready() {
    pomodoroTimer();
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
    const body = document.body;
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
            time--;
            timer.innerHTML = formatTime(time);
            progressBarCount();
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
        body.classList.remove('pomo-color', 'long-color');
        body.classList.add('short-color');
        time = shortBreak;
        timer.innerHTML = formatTime(time); 
        progressTotal = time;
        progressBarCount(); 
    }
    function switchToLong() {
        type = 'long';
        tabs.forEach((tab) => tab.classList.remove('active'));
        longTab.classList.add('active');
        body.classList.remove('pomo-color', 'short-color');
        body.classList.add('long-color');
        time = longBreak;
        timer.innerHTML = formatTime(time);  
        progressTotal = time;
        progressBarCount(); 
    }
    function switchToPomo() {
        type = 'pomo';
        tabs.forEach((tab) => tab.classList.remove('active'));
        pomoTab.classList.add('active');
        body.classList.remove('short-color', 'long-color');
        body.classList.add('pomo-color');
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