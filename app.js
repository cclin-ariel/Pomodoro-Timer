/* eslint-disable */

// choose element
const playButton = document.querySelector('#play');
const stopButton = document.querySelector('#stop');

// btn CLICK function

playButton.addEventListener('click', () => {
  toggleClock();
});

stopButton.addEventListener('click', () => {
  toggleClock(true);
});

// variables
let isClockRunning = false; // default is not running

let workSessionDuration = 1500; // 25 mins
let currentTimeLeftInSession = 1500; // 25 mins
let breakSessionDuration = 300; // 5 mins

let type = 'Work';
let timeSpentInCurrentSession = 0;

const currentTaskLabel = document.querySelector('#task');
let clockTimer;

// Customize the duration of the sessions
let updatedWorkSessionDuration;
let updatedBreakSessionDuration;

const workDurationInput = document.querySelector('#input-work-duration');
const breakDurationInput = document.querySelector('#input-break-duration');

workDurationInput.value = '25'; // mins
breakDurationInput.value = '5'; // mins

// UPDATE WORK TIME
workDurationInput.addEventListener('input', () => {
  updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value);
});
// UPDATE PAUSE TIME
breakDurationInput.addEventListener('input', () => {
  updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value);
});

const minuteToSeconds = (mins) => mins * 60;

// check the customized WorkSessionDuration is updated
const setUpdatedTimers = () => {
  if (type === 'Work') {
    currentTimeLeftInSession =
      updatedWorkSessionDuration || workSessionDuration;
    workSessionDuration = currentTimeLeftInSession;
  } else {
    currentTimeLeftInSession =
      updatedBreakSessionDuration || breakSessionDuration;
    breakSessionDuration = currentTimeLeftInSession;
  }
};

// show the date of today
const currentTime = setInterval(() => {
  const d = new Date();
  const t = d.toLocaleTimeString('en-JP');
  const options = { month: 'short', day: 'numeric', weekday: 'long' };
  const today = d.toLocaleDateString('en-JP', options);
  document.getElementById('now').innerHTML = `${today} _ ${t}`;
}, 1000);

// toggleClock function
let isClockStopped = true;

const toggleClock = (reset) => {
  togglePlayPauseIcon(reset);
  // Toggle between work and break sessions
  if (reset) {
    // stop the time
    stopClock();
  } else {
    if (isClockStopped) {
      setUpdatedTimers();
      isClockStopped = false;
    }
    if (isClockRunning === true) {
      // pause the time
      clearInterval(clockTimer);
      isClockRunning = false;
    } else {
      // start the time
      isClockRunning = true;

      // decrease time left & increase time spent
      clockTimer = setInterval(() => {
        stepDown();
        displayCurrentTimeLeftInSession();
        progressBar.set(calculateSessionProgress());
      }, 1000);
      isClockRunning = true;
    }

    showStopIcon();
  }
};
// step down function
const stepDown = () => {
  if (currentTimeLeftInSession > 0) {
    currentTimeLeftInSession--;
    timeSpentInCurrentSession++;
  } else if (currentTimeLeftInSession === 0) {
    timeSpentInCurrentSession = 0;
    // display a log of our completed sessions
    if (type === 'Work') {
      displaySessionLog('Work');
      currentTimeLeftInSession = breakSessionDuration;
      type = 'Break';
      setUpdatedTimers();

      // label
      currentTaskLabel.value = 'Break';
      currentTaskLabel.disabled = true;
    } else {
      displaySessionLog('Break');
      currentTimeLeftInSession = workSessionDuration;
      type = 'Work';
      setUpdatedTimers();

      // label
      if (currentTaskLabel.value === 'Break') {
        currentTaskLabel.value = workSessionLabel;
      }
      currentTaskLabel.disabled = false;
    }
  }
  displayCurrentTimeLeftInSession(); // show the left time
};

// displayCurrentTimeLeftInSession function

const displayCurrentTimeLeftInSession = () => {
  const secondsLeft = currentTimeLeftInSession;
  let result = '';
  const seconds = secondsLeft % 60;
  const mins = parseInt(secondsLeft / 60) % 60;
  const hours = parseInt(secondsLeft / 3600);
  // add leading zeroes if it's less than 10
  const addLeadingZeroes = (time) => (time < 10 ? `0${time}` : time);

  if (hours > 0) result += `${hours}:`;
  result += `${addLeadingZeroes(mins)}:${addLeadingZeroes(seconds)}`;
  progressBar.text.innerText = result.toString();
};

// displaySessionLog function
const displaySessionLog = (type) => {
  let sessionLabel = type;
  if (type === 'Work') {
    sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work';
    workSessionLabel = sessionLabel;
  } else {
    sessionLabel = 'Break';
  }
  const sessionList = document.querySelector('#session-list');
  // append li to it
  const li = document.createElement('li');

  let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
  elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';

  const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
  li.appendChild(text);
  sessionList.appendChild(li);
};

// stopClock() stop and reset the timer

const stopClock = () => {
  timeSpentInCurrentSession = 0;
  setUpdatedTimers();
  displaySessionLog(type); // to display the time spent so far in this session
  // stop counting down
  clearInterval(clockTimer);
  // stop the timer running
  isClockStopped = true;
  isClockRunning = false;
  // reset the work session duration to default
  currentTimeLeftInSession = workSessionDuration;
  // update the timer display
  displayCurrentTimeLeftInSession();
  type = 'Work'; // to reset the session to work
};

// togglePlayPauseIcon

const togglePlayPauseIcon = (reset) => {
  const playIcon = document.querySelector('#play');
  const pauseIcon = document.querySelector('#pause');
  if (reset) {
    // when resetting -> always revert to play icon
    if (playIcon.classList.contains('hidden')) {
      playIcon.classList.remove('hidden');
    }
    if (!pauseIcon.classList.contains('hidden')) {
      pauseIcon.classList.add('hidden');
    }
  } else {
    playIcon.classList.toggle('hidden');
    pauseIcon.classList.toggle('hidden');
  }
};

// showStopIcon when timer is running

const showStopIcon = () => {
  const stopIcon = document.querySelector('#stop');
  stopIcon.classList.remove('hidden');
};

// progress bar
const progressBar = new ProgressBar.Circle('#timer', {
  strokeWidth: 2,
  text: {
    value: '25:00',
  },
  trailColor: '#f4f4f4',
});

// calculate the completion rate of this session
const calculateSessionProgress = () => {
  const sessionDuration =
    type === 'Work' ? workSessionDuration : breakSessionDuration;
  return (timeSpentInCurrentSession / sessionDuration) * 10;
};
