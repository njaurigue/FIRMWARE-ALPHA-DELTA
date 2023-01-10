var minutes = 1;            //length of session (default 25 minutes)
var phoneIn = false;        //true when phone is in, false when phone is out
var studying = false;       //true when session is ongoing, false otherwise
var now = 0;                //current time
var remainder = 0;          //remaining time left in session in mimutes
var users;                  //list of users from HTTP GET
var session = 0;            //number of sessions logged
var sessionGoal = 1;        //goal number of sessions
var n;                      //name of current user
var startMoment;            //start of session (as moment() object)

//DELIVERABLES
var id = "";                //userId
var dur = 0;                //duration (in minutes)
var scs = true;             //state of session (successful or failed)
var strt = "";              //start time of session (standardized)
var nd = "";                //end time of session (standardized)

/*--------------PHONE INPUTS--------------*/

/*
 * checkEnter()
 * Check whether phone was entered during or outside of a session.
 * return - false if not studying, true if studying
 */
function checkEnter(){
    //Prevent duplicate enter calls occuring simultaneously
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
 */
function checkExit(){
    //Prevent duplicate enter calls occuring simultaneously
    if(!phoneIn){
        return;
    }
    phoneIn = false;
    //If not studying, set welcome phrase
    if(!studying){
        setPhrase("welcome");
        return;
    }
    //Otherwise, trigger earlyExit
    tempEmotion("sad", "sad");
    exitEarly();
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
    setPhrase("starting");
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
        setPhrase("success");
        
        await postSession();
        for(var i = 0; i < 3; i++){
            confetti({
                spread: 100,
                particleCount: 10
            });
            await sleep(0.75);
        }


    }
}

/*
 * exitEarly()
 * Pauses session when phone is removed, notifying user and starting 10s countdown.
 */
var failing = false;
async function exitEarly(){
    console.log("EXIT EARLY")
    //Prevents duplicate fails from occuring simultaneously
    if(failing){
        return;
    }
    failing = true;
    setEmotion("sad");
    setPhrase("failing");
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
        setPhrase("failed");
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

/*
 * restart()
 * Pauses session when phone is removed, notifying user and updating UI accordingly.
 */
function restart(){
    //Phone must be removed to restart
    if(phoneIn){
        return;
    }
    setEmotion("happy");
    adjustTime(0);
    setPhrase("welcome");
    document.getElementById("body").style.backgroundColor = "#7fbadc";
    document.getElementById("checkEnter").style.color = "#7fbadc";
    document.getElementById("checkExit").style.color = "#7fbadc";
    document.getElementById("updateDate").style.color = "#7fbadc";
}

/*--------------ADJUSTMENTS--------------*/

/*
 * swap()
 * Switch between editing timer length or session goal, updating UI accordingly.
 */
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

/*
 * adjustSession(s):
 * Change global session variable by specified amount
 */ 
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
        setPhrase("welcome");
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
        method: 'POST',
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

function setPhrase(state){
    var n = localStorage.n
    var out = "";
    switch(state){
        case "welcome":
            var welcome = [
                "Welcome, " + n + "!",
                "Greetings, " + n + "!",
                "Good to see you, " + n + "!",
                "Hey there, " + n + "!",
                "Bonjour, " + n + "!",
                "Hola, " + n + "!",
                "Howdy, " + n +"!" ,
                "How's it going, " + n + "!"
            ];
            out = welcome[Math.floor(Math.random() * 8)];
            break;
        case "starting":
            var starting = [
                "Let's get to work, " + n + "!",
                "Let's begin, " + n + "!",
                "Here we go, " + n + "!",
                "Let's do it, " + n + "!",
                "Happy studying, " + n + "!"
            ];
            out = starting[Math.floor(Math.random() * 5)];
            break;
        case "success":
            var success = [
                "Great Job!" + n + "! Remove your phone to reset!",
                "Great job " + n + "! Remove your phone to reset!",
                "Terrific job " + n + "! Remove your phone to reset!",
                "Wonderful job " + n + "! Remove your phone to reset!",
                "Outstanding job " + n + "! Remove your phone to reset!",
                "Great work " + n + "! Remove your phone to reset!",
                "Excellent work " + n + "! Remove your phone to reset!",
                "Well done " + n + "! Remove your phone to reset!",
                "Sensational  " + n + "! Remove your phone to reset!"
            ];
            out = success[Math.floor(Math.random() * 9)];
            break;
        case "failing":
            var failing = [
                "Hey, come back!",
                "Hey, give me that!",
                "Hurry, come back!",
                "Come on, stay focused!"
            ];
            out = failing[Math.floor(Math.random() * 4)];
            break;
        case "failed":
        default:
            var failed = [
                "Click below to reset, you can do it!",
                "Click below to reset, don't give up!",
                "Click below to reset, you can do this!",
                "Click below to reset, you got this!",
                "Click below to reset, never stop trying!"
            ];
            out = failed[Math.floor(Math.random() * 5)];
    }
    document.getElementById("text").innerHTML = out;
}

function testPrint(){
    console.log("START: " + strt);
    console.log("END:   " + nd);
    console.log("DURATION: " + dur);
    console.log("SUCCESS: " + scs);
    console.log("USERID: " + localStorage.id);
}