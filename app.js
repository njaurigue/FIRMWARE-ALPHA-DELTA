var debug = false; //switch button visibility (for testing)
var minutes = 1;  //length of session (default 25 minutes)
var phoneIn = false; //true when phone is in, false when phone is out
var studying = false; //true when session is ongoing, false otherwise
var now = 0; //current time
var remainder = 0; //remaining time left in session in mimutes
var users;
var session = 0;
var sessionGoal = 1;

//DELIVERABLES
var id = ""; //DONE
var dur = 0; //60
var scs = true;
var strt = ""; //3:00
var nd = ""; //4:03 //SUCCESS DONE

var n;
var startMoment;

/*--------------PHONE INPUTS--------------*/

/*
 * checkEnter()
 * Check whether phone was removed during or outside of a session.
 * return - false if not studying, true if studying
 */
function checkEnter(){
    if(phoneIn){
        return;
    }
    document.getElementById("session").innerHTML = "Sessions: " + session + "/" + sessionGoal;
    document.getElementById("body").style.backgroundColor = "#7fbadc";
    document.getElementById("checkEnter").style.color = "#7fbadc";
    document.getElementById("checkExit").style.color = "#7fbadc";
    document.getElementById("updateDate").style.color = "#7fbadc";
    phoneIn = true;
    if(!studying){
        restart();
        studying = true;
        startMoment = moment();
        strt = fixMoment(String(startMoment.format()));
        if(session >= sessionGoal){
            session = 0;
            document.getElementById("session").innerHTML = "Sessions: " + session + "/" + sessionGoal;
        }
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
    if(!phoneIn){
        return;
    }
    phoneIn = false;
    if(!studying){ //start reset timer? (5 min)
        document.getElementById("text").innerHTML = "Welcome " + localStorage.n + "!";
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
    document.getElementById("text").innerHTML = "Welcome " + localStorage.n + "!";
    now = moment().toDate().getTime();
    target = now + time*60*1000;
    console.log(remainder/60000);
    while((now < target) && phoneIn){
        now = moment().toDate().getTime();
        remainder = String((target - now)/60000);
        var m = remainder.substring(0,remainder.indexOf('.'));
        var s = String(60*parseInt(remainder.substring(remainder.indexOf('.') + 1))).substring(0,2);
        remainder = parseFloat(remainder);
        if(remainder > 0.1667){
            document.getElementById("clock").innerHTML = (m + ":" + s).replace("-", "");
        }else if(remainder < 0.01667){
            document.getElementById("clock").innerHTML = ("0:00." + s.substring(0,1));
        }else{
            document.getElementById("clock").innerHTML = ("0:0" + s.substring(0,1) + "." + s.substring(1));
        }
        await sleep(0.25);
        console.log(m + ":" + s + "----r: " + remainder);
    }
    
    //SUCCESSFUL EXIT
    if(phoneIn){ 
        document.getElementById("clock").innerHTML = "0:00";
        console.log("SUCCESSFUL EXIT");
        dur = minutes;
        nd = fixMoment(String(moment().format()));
        scs = true;
        studying = false;
        session++;
        swap();
        document.getElementById("session").innerHTML = "Sessions: " + session + "/" + sessionGoal;
        document.getElementById("text").innerHTML = "Great Job! Remove and re-enter your phone to go again!";
        
        await postSession();
        for(var i = 0; i < 3; i++){
            confetti({
                spread: 100,
                particleCount: 10
            });
            await sleep(0.75);
        }

        console.log("START: " + strt);
        console.log("END:   " + nd);
        console.log("DURATION: " + dur);
        console.log("SUCCESS: " + scs);
        console.log("USERID: " + localStorage.id);
    }
}

var failing = false;
/*
 * exitEarly()
 * Pauses session when phone is removed, notifying user and updating UI accordingly.
 */
async function exitEarly(){
    console.log("EXIT EARLY")
    if(failing){
        return;
    }
    failing = true;
    setEmotion("sad");
    document.getElementById("text").innerHTML = "Hurry, Come Back!!";
    document.getElementById("body").style.backgroundColor = "#FF7276";
    document.getElementById("checkEnter").style.color = "#FF7276";
    document.getElementById("checkExit").style.color = "#FF7276";
    document.getElementById("updateDate").style.color = "#FF7276";
    curr = moment().toDate().getTime();
    var t = curr + 10*1000;
    var r = String((t - curr)/60000);
    while(!phoneIn && r > 0){
        document.getElementById("clock").innerHTML = "0:10.00";
        curr = moment().toDate().getTime();
        r = String((t - curr)/60000);
        var m = r.substring(0,r.indexOf('.'));
        var s = String(60*parseInt(r.substring(r.indexOf('.') + 1))).substring(0,2);
        r = parseFloat(r);
        if(r > 0.1667){
            document.getElementById("clock").innerHTML = (m + ":" + s).replace("-", "");
        }else if(r < 0.01667){
            document.getElementById("clock").innerHTML = ("0:00." + s.substring(0,1));
        }else{
            document.getElementById("clock").innerHTML = ("0:0" + s.substring(0,1) + "." + s.substring(1));
        }
        await sleep(0.25);
        console.log(m + ":" + s + "----r: " + r);
    }
    failing = false;

    //FAILED EXIT
    if(!phoneIn){
        document.getElementById("clock").innerHTML = "0:00.00";
        document.getElementById("text").innerHTML = "Click below to reset, you can do it!";
        document.getElementById("body").style.backgroundColor = "#6594b0";
        document.getElementById("checkEnter").style.color = "#6594b0";
        document.getElementById("checkExit").style.color = "#6594b0";
        document.getElementById("updateDate").style.color = "#6594b0";
        console.log("FAILED EXIT");
        dur = Math.round(parseFloat(moment().subtract(startMoment) / 60000));
        nd = fixMoment(String(moment().format()));
        scs = false;
        studying = false;

        await postSession();
        console.log("START: " + strt);
        console.log("END:   " + nd);
        console.log("DURATION: " + dur);
        console.log("SUCCESS: " + scs);
        console.log("USERID: " + localStorage.id);
    }
}

function restart(){
    setEmotion("happy");
    adjustTime(0);
    document.getElementById("text").innerHTML = "Welcome " + localStorage.n + "!";
    document.getElementById("body").style.backgroundColor = "#7fbadc";
    document.getElementById("checkEnter").style.color = "#7fbadc";
    document.getElementById("checkExit").style.color = "#7fbadc";
    document.getElementById("updateDate").style.color = "#7fbadc";
}

var editTimer = true
function swap(){
    if(studying){
        return;
    }
    if(editTimer){
        editTimer = false;
        document.getElementById("session").innerHTML = "->" + "Sessions: " + session + "/" + sessionGoal + "<-";
        document.getElementById("clock").innerHTML = minutes + ":00";
    }else{
        editTimer = true;
        document.getElementById("clock").innerHTML = "->" + minutes + ":00" + "<-";
        document.getElementById("session").innerHTML = "Sessions: " + session + "/" + sessionGoal;
    }
}

function adjust(i){
    console.log(editTimer);
    if(editTimer){
        adjustTime(i);
        return;
    }
    adjustSession(i);
}

/*
 * adjustTime(min):
 * Change global minutes variable by specified time
 */ 
function adjustTime(min){
    if(minutes > 1){
        minutes += min;
    }else if(min > 0){
        minutes += min;
    }
    var edit = "";
    var edit2 = "";
    if(editTimer){
        edit = "->";
        edit2 = "<-";
    }
    document.getElementById("clock").innerHTML = edit + minutes + ":00" + edit2;
    console.log(minutes)
}

function adjustSession(s){
    if(sessionGoal > 1 && s < 0 && sessionGoal > session){
        sessionGoal--;
    }else if(sessionGoal < 5 && s > 0){
        sessionGoal++;
    }
    var edit = "";
    var edit2 = "";
    if(!editTimer){
        edit = "->";
        edit2 = "<-";
    }
    document.getElementById("session").innerHTML = edit + "Sessions: " + session + "/" + sessionGoal + edit2;
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
        document.getElementById("text").innerHTML = "Welcome " + localStorage.n + "!";
        adjustTime(0);
        adjustSession(0);
        updateDate();
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

async function postSession(){
    const output = {
        userId:localStorage.id,
        duration:dur,
        success:scs,
        start:strt,
        end:nd
    }
    const post = await fetch('https://taumy-study-buddy.onrender.com/api/study/createSession', {
        method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(output),
    });
    console.log(post);
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
    localStorage.id = document.getElementById("ID" + String(user)).innerHTML;
    localStorage.n = document.getElementById("N" + String(user)).innerHTML;
    console.log(n);
    console.log(localStorage.id);
    window.location.href="timer.html"
}

function fixMoment(s){
    var i = s.lastIndexOf('-');
    var eight = s.lastIndexOf('8');
    return s.substring(0, i) + "+" + s.substring(i + 1, eight) + "0" + s.substring(eight + 1);
}