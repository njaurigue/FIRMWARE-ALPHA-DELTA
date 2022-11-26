var manual = false;
var minutes = 25; /*DEFAULT 25 MINUTES*/
var phoneIn = true;

/*
 * timer(minutes)
 * Begin study session of specified length
 */ 
async function timer(){
    console.log(minutes);
    var now = moment().toDate().getTime();
    var end = now + minutes*60*1000;
    console.log(now);
    console.log(end);

    while((now < end) && phoneIn){
        console.log("RUNNING");
        now = moment().toDate().getTime();
        var diff = String((end - now)/60000);
        var m = diff.substring(0,diff.indexOf('.'));
        var s = String(60*parseInt(diff.substring(diff.indexOf('.') + 1))).substring(0,2);
        document.getElementById("clock").innerHTML = m + ":" + s;
        await sleep(0.25);
    }
    setEmotion("eating");
    await sleep(3);
    setEmotion("happy");
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