//choose element
const timer = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const pausrButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');
const sessionList = document.querySelector('#session-list');


//3 btn CLICK function

startButton.addEventListener('click', () => {
    toggleClock();
});

pausrButton.addEventListener('click', () => {
    toggleClock()
});

stopButton.addEventListener('click', () => {
    toggleClock(true)
});

//variables
var isClockRunning = false; //default is not running

var workSessionDuration = 1500; //25 mins
var currentTimeLeftInSession = 1500; //25 mins
var breakSessionDuration = 300; //5 mins

var type = "Work";
var timeSpentIncurrentSession = 0;

//Customize the duration of the sessions
var updatedWorkSessionDuration;
var updatedBreakSessionDuration;
var workDuraqtionInput = document.querySelector("#input-work-duration");
var breakDurationInput = document.querySelector("input-break-duration");

workDuraqtionInput = "25"; //mins
breakDurationInput = "5"; //mins

//update the work time
workDuraqtionInput.addEventListener("input", () => {
    updatedWorkSessionDuration = minuteToSecond(workDuraqtionInput.value)
});
breakDurationInput.addEventListener("input", () => {
    updatedBreakSessionDuration = minuteToSecond(breakDurationInput.value)
});

const minuteToSecond = mins => {
    return mins * 60;
}

//show the current time
var currentTime = setInterval(() => {
    var d = new Date();
    var t = d.toLocaleTimeString("en-JP");
    const options = { month: "short", day: "numeric", weekday: "long" };
    var today = d.toLocaleDateString("en-JP", options);
    document.getElementById("now").innerHTML = today + ` _ ` + t;
}, 1000);

//toggleClock function
const toggleClock = reset => {
    //Toggle between work and break sessions 
    if (reset) {
        //stop the time
        stopClock();
    } else {
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
            }, 1000);
        }
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
            displySessionLog("Work");
            currentTimeLeftInSession = breakSessionDuration;
            type = "Break";

            //label
            currentTaskLabel.value = "Break";
            currentTaskLabel.disabled = true;
        } else {
            displaySessionLog("Break");
            currentTimeLeftInSession = workSessionDuration;
            type = "Work";

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
    timer.innerHTML = result.toString();
};

//displaySessionLog function
const displaySessionLog = type => {
    if (type === "work") {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel : "Work";
        workSessionLabel = sessionLabel;
    } else {
        sessionLabel = "Break";
    };
    const li = document.createElement("li");
    var sessionLabel = type;
    var elapsedTime = parseInt(timeSpentIncurrentSession / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : "< 1";

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
    li.appendChild(text);
    sessionList.appendChild(li);
};

//stopClock() stop and reset the timer

const stopClock = () => {
    //??? stop counting down???
    clearInterval(clockTimer);
    //stop the timer running
    isClockRunning = false;
    //reset the work session duration to defualt
    currentTimeLeftInSession = workSessionDuration;
    // update the timer diplay
    displayCurrentTimeLeftInSession();
};






//Add a circular progress bar to the timer