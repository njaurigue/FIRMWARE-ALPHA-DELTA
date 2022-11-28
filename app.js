var manual = false;
var minutes = 25; /*DEFAULT 25 MINUTES*/
var phoneIn = true;
var studying = false;

/*
 * checkEnter()
 * Check whether phone was removed during or outside of a session.
 * return - false if not studying, true if studying
 */
function checkEnter(){
    if(!studying){
        start();
        return;
    }
    //otherwise, call function to continue session
}

/*
 * checkExit()
 * Check whether phone was removed during or outside of a session.
 * return false
 */
function checkExit(){
    if(!studying){
        return;
    }
    //otherwise, call function to give 10s countdown
}

/*
 * start(minutes)
 * Begin study session of specified length
 */ 
async function start(){
    studying = true;
    tempEmotion("eating");
    var now = moment().toDate().getTime();
    var target = now + minutes*60*1000;
    console.log(now);
    console.log(target);

    while((now < target) && phoneIn){
        console.log("RUNNING");
        now = moment().toDate().getTime();
        var diff = String((target - now)/60000);
        var m = diff.substring(0,diff.indexOf('.'));
        var s = String(60*parseInt(diff.substring(diff.indexOf('.') + 1))).substring(0,2);
        document.getElementById("clock").innerHTML = m + ":" + s;
        await sleep(0.25);
    }
    studying = false;
    console.log("DONE");
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
async function tempEmotion(emotion){
    var src = document.getElementById("face").src;
    console.log("CURR: " + src);
    setEmotion(emotion);
    await sleep(4);
    document.getElementById("face").src = src;
}

/*
 * setVisibility():
 * Change button visibility by clicking on timer.
 */
function setVisibility(){
    console.log("PRESSED");
    var color;
    if(!manual){
        color = "black";
        manual = true;
    }else{
        color = "#7fbadc";
        manual = false;
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