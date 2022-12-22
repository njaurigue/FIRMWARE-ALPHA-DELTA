var debug = false; //switch button visibility (for testing)
var minutes = 25;  //length of session (default 25 minutes)
var phoneIn = false; //true when phone is in, false when phone is out
var studying = false; //true when session is ongoing, false otherwise
var now = 0; //current time
var remainder = 0; //remaining time left in session in mimutes

//temp testing
function abort(){
    console.log("ABORTING");
    document.getElementById("text").innerHTML = "ABORTING";
}

/*
 * checkEnter()
 * Check whether phone was removed during or outside of a session.
 * return - false if not studying, true if studying
 */
function checkEnter(){
    phoneIn = true;
    if(!studying){
        studying = true;
        start(minutes);
    }else{
        start(remainder);
    }
}

/*
 * checkExit()
 * Check whether phone was removed during or outside of a session.
 * return false
 */
function checkExit(){
    phoneIn = false;
    if(!studying){
        return;
    }else{
        tempEmotion("sad", "sad");
        document.getElementById("text").innerHTML = "Come Back!!";
    }

    exitEarly();
}

/*
 * start(minutes)
 * Begin study session of specified length
 * time - minutes in length to run timer on
 */ 
async function start(time){ //NEED TO FIX TARGET TIME, ONLY UPDATE TARGET AT BEGINNING OF SESSION
    document.getElementById("text").innerHTML = "Hi I'm Taumy!";
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
        document.getElementById("clock").innerHTML = m + ":" + s;
        remainder = parseFloat(remainder);
        await sleep(0.25);
        console.log(remainder);
    }
    if(phoneIn){ //if phone is in after exiting loop, then session completed successfully
        console.log("DONE");
        studying = false;
    }
}

/*
 * exitEarly()
 * Pauses session when phone is removed, notifying user and updating UI accordingly.
 */
async function exitEarly(){
    console.log("EXIT EARLY")
    setEmotion("sad");
    document.getElementById("text").innerHTML = "Come Back!!";
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
    await sleep(4);
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

/*
 * Keyboard listener
 */
document.addEventListener("keydown", e => {
    console.log(e);
    /*if(e.key == ' '){
        timer();
    }*/
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms*1000));
}