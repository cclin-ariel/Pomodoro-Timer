//choose element
const timer = document.querySelector('#timer');
const playButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');

//btn CLICK function

playButton.addEventListener('click', () => {
    toggleClock();
});

stopButton.addEventListener('click', () => {
    toggleClock(true);
});

//variables
var isClockRunning = false; //default is not running

var workSessionDuration = 1500; //25 mins
var currentTimeLeftInSession = 1500; //25 mins
var breakSessionDuration = 300; //5 mins

var type = "Work";
var timeSpentIncurrentSession = 0;

var currentTaskLabel = document.querySelector('#task');

//Customize the duration of the sessions
var updatedWorkSessionDuration;
var updatedBreakSessionDuration;

var workDurationInput = document.querySelector('#input-work-duration');
var breakDurationInput = document.querySelector('#input-break-duration');

workDurationInput.value = "25"; //mins
breakDurationInput.value = "5"; //mins

// UPDATE WORK TIME
workDurationInput.addEventListener('input', () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
});
// UPDATE PAUSE TIME
breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
});

const minuteToSeconds = (mins) => {
    return mins * 60
};

//check the customized WorkSessionDuration is updated
const setUpdatedTimers = () => {
    if (type === "Work") {
        currentTimeLeftInSession = updatedWorkSessionDuration ?
            updatedWorkSessionDuration :
            workSessionDuration;
        workSessionDuration = currentTimeLeftInSession;
    } else {
        currentTimeLeftInSession = updatedBreakSessionDuration ?
            updatedBreakSessionDuration :
            breakSessionDuration;
        breakSessionDuration = currentTimeLeftInSession;
    }
};

//show the date of today
var currentTime = setInterval(() => {
    var d = new Date();
    var t = d.toLocaleTimeString("en-JP");
    const options = { month: "short", day: "numeric", weekday: "long" };
    var today = d.toLocaleDateString("en-JP", options);
    document.getElementById("now").innerHTML = today + ` _ ` + t;
}, 1000);

//toggleClock function
var isClockStopped = true;

const toggleClock = reset => {
    togglePlayPauseIcon(reset);
    //Toggle between work and break sessions 
    if (reset) {
        //stop the time
        stopClock();
    } else {
        if (isClockStopped) {
            setUpdatedTimers();
            isClockStopped = false;
        }
        if (isClockRunning == true) {
            //pause the time
            clearInterval(clockTimer);
            isClockRunning = false;
        } else {
            //start the time
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
//step donw function
const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
        currentTimeLeftInSession--;
        timeSpentIncurrentSession++;
    } else if (currentTimeLeftInSession === 0) {
        timeSpentIncurrentSession = 0;

        //display a log of our completed sessions
        if (type === "Work") {
            displaySessionLog("Work");
            currentTimeLeftInSession = breakSessionDuration;
            type = "Break";
            setUpdatedTimers();

            //label
            currentTaskLabel.value = "Break";
            currentTaskLabel.disabled = true;
        } else {
            displaySessionLog("Break");
            currentTimeLeftInSession = workSessionDuration;
            type = "Work";
            setUpdatedTimers();

            //label
            if (currentTaskLabel.value === "Break") {
                currentTaskLabel.value = workSessionLabel;
            }
            currentTaskLabel.disabled = false;
        }

    }
    displayCurrentTimeLeftInSession(); //show the left time

};

//displayCurrentTimeLeftInSession function   

const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession;
    var result = "";
    const seconds = secondsLeft % 60;
    const mins = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);
    // add leading zeroes if it's less than 10
    const addLeadingZeroes = time => {
        return time < 10 ? `0${time}` : time;
    }

    if (hours > 0) result += `${hours}:`;
    result += `${addLeadingZeroes(mins)}:${addLeadingZeroes(seconds)}`;
    progressBar.text.innerText = result.toString();
};

//displaySessionLog function
const displaySessionLog = type => {
    var sessionLabel = type;
    if (type === "Work") {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : "Work";
        workSessionLabel = sessionLabel;
    } else {
        sessionLabel = "Break";
    };
    const sessionList = document.querySelector('#session-list');
    //append li to it
    const li = document.createElement('li');

    var elapsedTime = parseInt(timeSpentIncurrentSession / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
    li.appendChild(text);
    sessionList.appendChild(li);
};

//stopClock() stop and reset the timer

const stopClock = () => {
    timeSpentInCurrentSession = 0;
    setUpdatedTimers();
    displaySessionLog(type); //to display the time spent so far in this session
    //stop counting down
    clearInterval(clockTimer);
    //stop the timer running
    isClockStopped = true;
    isClockRunning = false;
    //reset the work session duration to defualt
    currentTimeLeftInSession = workSessionDuration;
    // update the timer diplay
    displayCurrentTimeLeftInSession();
    type = "Work"; //to reset the session to work
};

//togglePlayPauseIcon 

const togglePlayPauseIcon = (reset) => {
    const playIcon = document.querySelector('#play')
    const pauseIcon = document.querySelector('#pause')
    if (reset) {
        // when resetting -> always revert to play icon
        if (playIcon.classList.contains('hidden')) {
            playIcon.classList.remove('hidden')
        }
        if (!pauseIcon.classList.contains('hidden')) {
            pauseIcon.classList.add('hidden')
        }
    } else {
        playIcon.classList.toggle('hidden')
        pauseIcon.classList.toggle('hidden')
    }
};

//showStopIcon when timer is running

const showStopIcon = () => {
    const stopIcon = document.querySelector('#stop');
    const playIcon = document.querySelector('#play')
    stopIcon.classList.remove('hidden');
};

//progress bar
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
        type === 'Work' ? workSessionDuration : breakSessionDuration
    return (timeSpentInCurrentSession / sessionDuration) * 10
};