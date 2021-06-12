//choose element
const timer = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const pausrButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');


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

//show the current time
var currentTime = setInterval(() => {
    var d = new Date();
    var t = d.toLocaleTimeString("en-JP");
    const options = { month: "short", day: "numeric", weekday: "long" };
    var today = d.toLocaleDateString("en-JP", options);
    document.getElementById("now").innerHTML = today + ` _ ` + t;
}, 1000);

//toggleClock function
//Toggle between work and break sessions 

const toggleClock = reset => {
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

                //step donw function
                const stepDown = () => {
                    if (currentTimeLeftInSession > 0) {
                        currentTimeLeftInSession--;
                        timeSpentIncurrentSession++;
                    } else if (currentTimeLeftInSession === 0) {
                        timeSpentIncurrentSession = 0;

                        //display a log of our completed sessions
                        if (type == "Work") {
                            currentTimeLeftInSession = breakSessionDuration;
                            displySessionLog("Work");
                            type = "Break";
                        } else {
                            currentTimeLeftInSession = workSessionDuration;
                            displaySessionLog("Break");
                            type = "Work";
                        }

                    }
                }

                displayCurrentTimeLeftInSession(); //show the left time
            }, 1000);
        }
    }
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
}

//displaySessionLog function
const displaySessionLog =


    //Customize the work label and the duration of the sessions

    //Add a circular progress bar to the timer