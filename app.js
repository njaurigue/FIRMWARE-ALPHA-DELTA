var debug = false; //switch button visibility (for testing)
var minutes = 1;  //length of session (default 25 minutes)
var phoneIn = false; //true when phone is in, false when phone is out
var studying = false; //true when session is ongoing, false otherwise
var now = 0; //current time
var remainder = 0; //remaining time left in session in mimutes
var users;

//DELIVERABLES
var userId = ""; //DONE
var duration = 0; //60
var success = true;
var start = ""; //3:00
var end = ""; //4:03 //SUCCESS DONE

var n;
var startMoment;

/*
 * abort()
 * Exit webdriver by clicking on Taumy's face manually (for testing)
 * return - none
 */
function abort(){
    console.log("ABORTING");
    document.getElementById("text").innerHTML = "ABORTING";
}

/*--------------PHONE INPUTS--------------*/

/*
 * checkEnter()
 * Check whether phone was removed during or outside of a session.
 * return - false if not studying, true if studying
 */
function checkEnter(){
    document.getElementById("body").style.backgroundColor = "#7fbadc";
    document.getElementById("checkEnter").style.color = "#7fbadc";
    document.getElementById("checkExit").style.color = "#7fbadc";
    document.getElementById("updateDate").style.color = "#7fbadc";
    phoneIn = true;
    if(!studying){
        studying = true;
        startMoment = moment();
        start = fixMoment(String(startMoment.format()));
        startTimer(minutes);
    }else{
        startTimer(remainder);
    }
}

/*
 * checkExit()
 * Check whether phone was removed during or outside of a session.
 * return false
 */
function checkExit(){
    phoneIn = false;
    if(!studying){ //start reset timer? (5 min)
        return;
    }else{
        tempEmotion("sad", "sad");
        exitEarly();
    }

}

/*--------------TIMERS--------------*/

/*
 * startTimer(minutes)
 * Begin study session of specified length
 * time - minutes in length to run timer on
 */ 
async function startTimer(time){
    console.log("STUDYING");
    tempEmotion("eating", "happy");
    now = moment().toDate().getTime();
    target = now + time*60*1000;
    console.log(remainder/60000);
    while((now < target) && phoneIn){
        now = moment().toDate().getTime();
        remainder = String((target - now)/60000);
        var m = remainder.substring(0,remainder.indexOf('.'));
        var s = String(60*parseInt(remainder.substring(remainder.indexOf('.') + 1))).substring(0,2);
        document.getElementById("clock").innerHTML = (m + ":" + s).replace("-", "");
        remainder = parseFloat(remainder);
        await sleep(0.25);
    }
    document.getElementById("clock").innerHTML = "0:00";
    
    //SUCCESSFUL EXIT
    if(phoneIn){ 
        console.log("SUCCESSFUL EXIT");
        success = true;
        end = fixMoment(String(moment().format()));
        duration = minutes;
        console.log(end);
        studying = false;

        console.log(start);
        console.log(duration);
        console.log(success);
    }
}

/*
 * exitEarly()
 * Pauses session when phone is removed, notifying user and updating UI accordingly.
 */
async function exitEarly(){
    console.log("EXIT EARLY")
    setEmotion("sad");
    document.getElementById("text").innerHTML = "Hurry, Come Back!!";
    document.getElementById("body").style.backgroundColor = "#6594b0";
    document.getElementById("checkEnter").style.color = "#6594b0";
    document.getElementById("checkExit").style.color = "#6594b0";
    document.getElementById("updateDate").style.color = "#6594b0";
    curr = moment().toDate().getTime();
    var t = curr + 10*1000;
    var r = String((t - curr)/60000);
    while(!phoneIn && r > 0){
        curr = moment().toDate().getTime();
        r = String((t - curr)/60000);
        var m = r.substring(0,r.indexOf('.'));
        var s = String(60*parseInt(r.substring(r.indexOf('.') + 1))).substring(0,2);
        document.getElementById("clock").innerHTML = (m + ":" + s).replace("-", "");
        r = parseFloat(r);
        await sleep(0.25);
    }
    document.getElementById("clock").innerHTML = "0:00";

    //FAILED EXIT
    if(!phoneIn){
        console.log("FAILED EXIT");
        success = false;
        duration = Math.round(parseFloat(moment().subtract(startMoment) / 60000));
        end = fixMoment(String(moment().format()));
        console.log("END:   " + end);
        studying = false;

        console.log("START: " + start);
        console.log("DURATION: " + duration);
        console.log("SUCCESS: " + success);
    }
    document.getElementById("text").innerHTML = "Click below to reset, you can do it!";
    document.getElementById("body").style.backgroundColor = "#FF7276";
    document.getElementById("checkEnter").style.color = "#FF7276";
    document.getElementById("checkExit").style.color = "#FF7276";
    document.getElementById("updateDate").style.color = "#FF7276";
}

function restart(){
    setEmotion("happy");
    adjustTime(0);
    document.getElementById("text").innerHTML = "Welcome " + n + "!";
    document.getElementById("body").style.backgroundColor = "#6594b0";
    document.getElementById("checkEnter").style.color = "#6594b0";
    document.getElementById("checkExit").style.color = "#6594b0";
    document.getElementById("updateDate").style.color = "#6594b0";
}

/*
 * adjustTime(min):
 * Change global minutes variable by specified time
 */ 
function adjustTime(min){
    if(minutes > 10){
        minutes += min;
    }else if(min > 0){
        minutes += min;
    }
    document.getElementById("clock").innerHTML = minutes + ":00";
    console.log(minutes)
}

/*
 * setEmotion(emotion):
 * Change Taumy's visual emotion to desired GIF
 */
function setEmotion(emotion){
    console.log("SETTING EMOTION");
    var src;
    switch(emotion){
        case "happy":
            src = "GIFS/emotionHappy.gif";
            break;
        case "sad":
            src = "GIFS/emotionSad.gif";
            break;
        case "laugh":
            src = "GIFS/emotionLaugh.gif";
            break;
        case "eating":
            src = "GIFS/emotionEating.gif";
            break;
        case "grin":
        default:
            src = "GIFS/emotionGrin.gif";
    }
    document.getElementById("face").src = src;
}

/*
 * tempEmotion(emotion):
 * Temporarily change Taumy's visual emotion to desired GIF, 
 * then swap back to previous state
 */
async function tempEmotion(emotion1, emotion2){
    setEmotion(emotion1);
    await sleep(2);
    setEmotion(emotion2)
}

/*
 * setVisibility():
 * Change button visibility by clicking on timer.
 */
function setVisibility(){
    console.log("PRESSED");
    var color;
    if(!debug){
        color = "black";
        debug = true;
    }else{
        color = "#7fbadc";
        debug = false;
    }
    var buttons = document.getElementsByClassName("button")
    for(var i = 0; i < buttons.length; i++){
        console.log(buttons[i]);
        buttons[i].style.color = color;
    }
}

function updateDate(){
    document.getElementById("date").innerHTML = moment().format("MM/DD/YY") + " - " + moment().format("h:mmA");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms*1000));
}

/*--------------INDEX.HTML--------------*/
var user = 1

function onload(type){
    if(type == 'index'){
        updateUser(0);
        getUsers();
    }else{
        document.getElementById("text").innerHTML = "Welcome " + n + "!";
        adjustTime(0);
        updateDate();
        /*fetch('https://taumy-study-buddy.onrender.com/api/study/createSession', {
            method: 'POST', // or 'PUT'
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(output),
        })
            .then((response) => response.json())
            .then((data) => {
            console.log('Success:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
        */
    }
}

function getUsers(){
    console.log("FETCHING");
    fetch('https://taumy-study-buddy.onrender.com/api/users/everyone')
        .then(response => response.json())
        .then(data => {
            console.log(data.length)
            console.log(data)
            var i = 1;
            while(i < data.length + 1 && i < 6){
                document.getElementById("N" + String(i)).innerHTML = data[i-1].name;
                document.getElementById("E" + String(i)).innerHTML = data[i-1].email;
                document.getElementById("ID" + String(i)).innerHTML = data[i-1]._id;
                i++;
            }
        });
}

function postSession(){
    return;
}

function updateUser(change){
    if(user == 1 && change < 0 || user == 5 && change > 0){
        return;
    }
    document.getElementById("U" + String(user)).style.outline = "2px solid #7fbadc"
    user += change;
    document.getElementById("U" + String(user)).style.outline = "2px solid black"
}

function login(){
    userId = document.getElementById("ID" + String(user)).innerHTML;
    n = document.getElementById("N" + String(user)).innerHTML;
    console.log(n);
    console.log(userId);
    window.location.href="timer.html"
}

function fixMoment(s){
    var i = s.lastIndexOf('-');
    return s.substring(0, i) + "+" + s.substring(i + 1);
}