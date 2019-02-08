/*This script is a general purpose timing script*/

/**
 * @name Mode
 * @label Mode
 * @type select
 * @options Clock||Clock24||Count||Date||Duration||Timer
 * @description Clock = Current Time AM/PM format||Clock24 = Current Time 24hour format||Count = Counts towards or away from a certain Time and Date.||Duration = Counts up from time of load, remember to check "Keep Source in Memory" to avoid reload in-between scenes||Timer = Counts down a certain number of minutes and seconds. This is reset on scene change unless "Keep Source in Memory" is checked. If more than 2 hours use Count
 */
var Mode = "Clock";

/**
 * @name TextBefore
 * @label Text Before
 * @type text
 * @description Text that will go before the timer
 */
var TextBefore = "";

/**
 * @name TextAfter
 * @label Text After
 * @type text
 * @description Text that will go after the timer
 */
var TextAfter = "";

/**
 * @name CountModeSettings
 * @label Count Mode / Duration Mode Settings
 * @type head
 */
//Count Mode & Duration Mode Settings;

/**
 * @name CountDateValue
 * @label Date
 * @type date
 * @description Date to countdown to/countup from, format MM/DD/YYYY
 */
var CountDateValue = "02/08/2019";

/**
 * @name CountTime
 * @label Time
 * @type time
 * @description Time to countdown to/countup from, 24-hr format HH:MM
 */
var CountTime = "13:01";

/**
 * @name CountStartingFormat
 * @label Format
 * @type select
 * @options D, HH : MM : SS||HH : MM : SS||MM : SS||SS
 * @description Time format to be used.
 */
var CountStartingFormat = "D, HH : MM : SS";

/**
 * @name CountHideExtraZero
 * @label Hide extra zero
 * @type boolean
 * @description If enabled and leftmost time unit value is in single digit, no leading zero will be added
 */
var CountHideExtraZero = false;

/**
 * @name DateModeSettings
 * @label Date Mode Settings
 * @type head
 */
//Date Mode Settings;

/**
 * @name DateFormat
 * @label Date Format
 * @type select
 * @options Short||Long
 * @description Short = Display date in short format(DDD MM/DD/YY such as Thu 01/01/15)||Long = Display date in long format (DAY_OF_WEEK, MONTH DAY, YEAR such as Thursday, January 1, 2015)
 */
var DateFormat = "Short";

/**
 * @name DisplayDayBeforeMonth
 * @label Display Day Before Month
 * @type boolean
 * @description This displays day before month, such that short format is DDD DD/MM/YY and long format is DAY_OF_WEEK, DAY MONTH, YEAR
 */
var DisplayDayBeforeMonth = false;

/**
 * @name TimerModeSettings
 * @label Timer Mode Settings
 * @type head
 */
//Timer Mode Settings;

/**
 * @name TimerMinutes
 * @label Minutes
 * @type spinner
 * @min 0
 * @max 120
 * @step 1
 * @description Values between 0 and 120
 */
var TimerMinutes = 0;

/**
 * @name TimerSeconds
 * @label Seconds
 * @type spinner
 * @min 0
 * @max 59
 * @step 1
 * @description Values between 0 and 59
 */
var TimerSeconds = 0;

/**
 * @name TimerStartingFormat
 * @label Format
 * @type select
 * @options MM : SS||SS
 * @description Time format to be used.
 */
var TimerStartingFormat = "MM : SS";

/**
 * @name TimerHideExtraZero
 * @label Hide extra zero
 * @type boolean
 * @description If enabled and leftmost time unit value is in single digit, no leading zero will be added
 */
var TimerHideExtraZero = false;

/* Special thanks to xsplit forum moderator MsgtGunny for some general revisions and the count up functionality. :)
   Kudos also to YJR BOURRET (forum name, Pho.Host) for proposing the Date stamp functionality.
*/

/*Do not modify anything below*/

/**
 * @name XJS_URL
 * @description XJS FRAMEWORK URL LOCATION
*/
var XJS_URL = "http://cdn2.xsplit.com/xjs/download/2.1.1/xjs.min.js?source";

function loadScript(url, callback)
{
    // Adding the script tag to the head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}


var isPaused = false;
var CountDateArray = CountDateValue.split("/");
CountDateValue = CountDateArray[2] + "," + CountDateArray[0] + "," + CountDateArray[1];
var CountDate = new Date(CountDateValue);
var CountHours = parseInt(CountTime.split(":")[0]);
var CountMinutes = parseInt(CountTime.split(":")[1]);
var UPDATEINTERVAL = 500; //0.5 seconds
var DAY_ARRAY = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    DAY_ARRAY_SHORT = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
    MONTH_ARRAY = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
var currentTimeString='';
var startTime = new Date();



function getTime()
{
    var currentTime = new Date();

    if((Mode=='Count')||(Mode=='Duration'))
    {
        Count(currentTime);
    }
    else if(Mode=='Date')
    {
        var currentWeekDay = currentTime.getDay();
        var currentDay = currentTime.getDate();
        var currentMonth = currentTime.getMonth();
        var currentYear = currentTime.getFullYear();

        if (DateFormat=='Short')
        {
            currentDay = ( currentDay < 10 ? '0' : '' ) + currentDay;
            currentMonth = ( currentMonth < 9 ? '0' : '' ) + (currentMonth+1);

            if (DisplayDayBeforeMonth)
            {
                currentTimeString = DAY_ARRAY_SHORT[currentWeekDay] + ' ' + currentDay + '/' + currentMonth + '/' + currentYear.toString().substring(2);
            }
            else
            {
                currentTimeString = DAY_ARRAY_SHORT[currentWeekDay] + ' ' + currentMonth + '/' + currentDay + '/' + currentYear.toString().substring(2);
            }
        }
        else
        {
            if (DisplayDayBeforeMonth)
            {
                currentTimeString = DAY_ARRAY[currentWeekDay] + ', ' + currentDay + ' ' + MONTH_ARRAY[currentMonth] + ', ' + currentYear;
            }
            else
            {
                currentTimeString = DAY_ARRAY[currentWeekDay] + ', ' + MONTH_ARRAY[currentMonth] + ' ' + currentDay + ', ' + currentYear;
            }

        }
        SetText(TextBefore + currentTimeString + TextAfter, 'General Purpose Clock');
    }
    else if(Mode=='Timer')
    {
        CountDownTime(currentTime);
    }
    else
    {
        var currentHours = currentTime.getHours();
        var currentMinutes = currentTime.getMinutes();
        var currentSeconds = currentTime.getSeconds();

        currentMinutes = ( currentMinutes < 10 ? '0' : '' ) + currentMinutes;
        currentSeconds = ( currentSeconds < 10 ? '0' : '' ) + currentSeconds;

        if(Mode=='Clock24')
        {
            currentTimeString = currentHours + ':' + currentMinutes + ':' + currentSeconds;
            //currentTimeString=currentTime.toLocaleTimeString();
        }
        else
        {
            var timeOfDay = ( currentHours < 12 ) ? 'AM' : 'PM';
            currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
            currentHours = ( currentHours == 0 ) ? 12 : currentHours;

            currentTimeString = currentHours + ':' + currentMinutes + ':' + currentSeconds+' '+timeOfDay;
        }
        SetText(TextBefore + currentTimeString + TextAfter, 'General Purpose Clock');
    }
    smlTitleTimeouts = setTimeout(function() { getTime(); }, UPDATEINTERVAL);
}

var isPreview = false, isThumbnail = false, isKeepLoaded = false;
var XJS, XJS_ITEM;
var xjsIsReady = false, shouldTogglePause = false;


var then;
function CountDownTime(currentTime)
{
    if (isPaused)
    {
        return;
    }

    var now=Math.ceil((currentTime.getTime()*1)/1000);
    now=parseInt(now,10);
    TimerSeconds=parseInt(TimerSeconds);
    TimerMinutes=parseInt(TimerMinutes);
    if(!then)
    {
        then=now+(TimerSeconds)+(TimerMinutes*60);
    }

    processTimeValues();

}

function SetCountDownTime(now)
{
    var diff=(then-now);
    var displayText = "";

    if(diff <=0)
    {
        if (TimerStartingFormat == "SS")
        {
            if (TimerHideExtraZero)
            {
                displayText = '0';
            }
            else
            {
                displayText = '00';
            }
        }
        else
        {
            if (TimerHideExtraZero)
            {
                displayText = '0:00';
            }
            else
            {
                displayText = '00:00';
            }
        }
        SetText(TextBefore + displayText + TextAfter, 'General Purpose Clock');

        return;
    }

    var seconds=diff%60;
    var minutes=((diff-seconds)/60);

    if (TimerStartingFormat == "MM : SS")
    {
        if (!TimerHideExtraZero)
        {
            minutes = ( minutes < 10 ? '0' : '' ) + minutes;
        }
        seconds = ( seconds < 10 ? '0' : '' ) + seconds;
        displayText = minutes+':'+seconds;
    }
    else
    {
        seconds = diff;
        if (!TimerHideExtraZero)
        {
            seconds = ( seconds < 10 ? '0' : '' ) + seconds;
        }
        displayText = seconds;
    }

    SetText(TextBefore + displayText + TextAfter, 'General Purpose Clock');
}

var dateCount;
function Count(currentTime)
{
    if (Mode=='Duration')
    {
        if (isPaused)
        {
            return;
        }

        dateCount=parseInt(Math.ceil(startTime.getTime()/1000));
        processTimeValues();

    }
    else
    {
        dateCount=parseInt(Math.ceil(CountDate.getTime()/1000));
        dateCount=(dateCount+(CountHours*3600)+(CountMinutes*60));
        SetCount(currentTime);
    }


}

function SetCount(currentTime)
{
    var now=parseInt(Math.ceil(currentTime.getTime()/1000));

    var diff = parseInt(now-dateCount);
    if(diff < 0)
    {
        diff=diff*(-1);
    }

    var daysDifference = parseInt(Math.floor(diff/60/60/24));
    diff -= daysDifference*60*60*24;

    var hoursDifference = parseInt(Math.floor(diff/60/60));
    var hoursDifferenceInitial = hoursDifference;
    diff -= hoursDifference*60*60;

    var minutesDifference = parseInt(Math.floor(diff/60));
    var minutesDifferenceInitial = minutesDifference;
    diff -= minutesDifference*60;

    var secondsDifference = Math.floor(diff);
    var secondsDifferenceInitial = secondsDifference;

    hoursDifference = ( hoursDifference < 10 ? '0' : '' ) + hoursDifference;
    minutesDifference = ( minutesDifference < 10 ? '0' : '' ) + minutesDifference;
    secondsDifference = ( secondsDifference < 10 ? '0' : '' ) + secondsDifference;

    if (CountStartingFormat == "D, HH : MM : SS")
    {
        var daysText = '';
        if(daysDifference > 1)
        {
            daysText = daysDifference+' Days, ';
        }
        else if (daysDifference==1)
        {
            daysText = daysDifference+' Day, ';
        }
        SetText(TextBefore + daysText + hoursDifference+':'+minutesDifference+':'+secondsDifference+ TextAfter, 'General Purpose Clock');
    }
    else
    {
        hoursDifferenceInitial = (daysDifference * 24) + hoursDifferenceInitial;
        if (CountStartingFormat == "HH : MM : SS")
        {

            if (CountHideExtraZero)
            {
                SetText(TextBefore + hoursDifferenceInitial+':'+minutesDifference+':'+secondsDifference+ TextAfter, 'General Purpose Clock');
            }
            else
            {
                hoursDifference = ( hoursDifferenceInitial < 10 ? '0' : '' ) + hoursDifferenceInitial;
                SetText(TextBefore + hoursDifference+':'+minutesDifference+':'+secondsDifference+ TextAfter, 'General Purpose Clock');
            }

            return;
        }
        else if (CountStartingFormat == "MM : SS")
        {
            minutesDifferenceInitial = (hoursDifferenceInitial * 60) + minutesDifferenceInitial;
            if (CountHideExtraZero)
            {
                SetText(TextBefore + minutesDifferenceInitial+':'+secondsDifference+ TextAfter, 'General Purpose Clock');
            }
            else
            {
                minutesDifference = ( minutesDifferenceInitial < 10 ? '0' : '' ) + minutesDifferenceInitial;
                SetText(TextBefore  + minutesDifference+':'+secondsDifference+ TextAfter, 'General Purpose Clock');
            }

            return;
        }
        else
        {
            secondsDifferenceInitial = (hoursDifferenceInitial * 60 * 60) + (minutesDifferenceInitial * 60) + secondsDifferenceInitial;
            if (CountHideExtraZero)
            {
                SetText(TextBefore + secondsDifferenceInitial + TextAfter, 'General Purpose Clock');
            }
            else
            {
                secondsDifference = ( secondsDifferenceInitial < 10 ? '0' : '' ) + secondsDifferenceInitial;
                SetText(TextBefore + secondsDifference + TextAfter, 'General Purpose Clock');
            }
            return;
        }

    }
}

function OnSceneLoad()
{
    if(xjsIsReady) {
        XJS_ITEM.getItemList()
        .then(function(items){
            if(items.length > 0) {
                processTimeValues();
            }
        });
    }
}

var secondsElapsed = 0;
var startPause, endPause;


function TogglePause()
{
    if(xjsIsReady) {
        var item;

        XJS_ITEM.getItemList()
        .then(function(items){

            if(items.length > 0) {
                item = items[0];
                return item.loadConfig();
            }

        }).then(function(config){
            if (Mode == "Duration")
            {
                isPaused = !isPaused;
                if (isPaused == true)
                {
                    var timeNow = new Date();
                    startPause = Math.ceil((timeNow.getTime()*1)/1000);
                }
                else
                {
                    var timeNow = new Date();
                    endPause = Math.ceil((timeNow.getTime()*1)/1000);
                    secondsElapsed = endPause - startPause;
                    startTime.setSeconds(startTime.getSeconds() + secondsElapsed);
                }
            }
            else if (Mode == "Timer")
            {
                isPaused = !isPaused;
                if (isPaused == true)
                {
                    var timeNow = new Date();
                    startPause = Math.ceil((timeNow.getTime()*1)/1000);
                }
                else
                {
                    var timeNow = new Date();
                    endPause = Math.ceil((timeNow.getTime()*1)/1000);
                    secondsElapsed = endPause - startPause;
                    then = then + secondsElapsed;
                }
            }

            if(Mode == "Duration" || Mode == "Timer")
            {
                config.isPaused = isPaused.toString();
                item.saveConfig(config);
            }
            shouldTogglePause = false;
        });
    } else {
      shouldTogglePause = true;
    }
}

function processTimeValues()
{

    var item, allItems;
    XJS_ITEM.getItemList()
    .then(function(items) {

        if(items.length > 0) {
            item = items[0];
            allItems = items;
            return item.getKeepLoaded();
        }

    }).then(function(isLoaded){

        isKeepLoaded = isLoaded;
        return new Promise(function(resolve) {

            let isLoaded = false;
            let idPromiseArray = [];
            for (var i = 0; i < allItems.length; i++) {
                idPromiseArray.push(new Promise(function(innerResolve) {
                    allItems[i].getView().then(function(view) {
                        innerResolve(view);
                    })
                }));
            }
            Promise.all(idPromiseArray).then(function(allResolve) {
                if (allResolve.indexOf(0)) {
                    resolve(0);
                } else if (allResolve.indexOf(1)){
                    resolve(1);
                } else if (allResolve.indexOf(2)){
                    resolve(2);
                } else {
                    resolve(0);
                }
            });

        });

    }).then(function(view) {

        isPreview = view == 1 || view == 2;
        isThumbnail = view == 2;
        var currentTime = new Date();
        var now=Math.ceil((currentTime.getTime()*1)/1000);
        now=parseInt(now,10);

        if(Mode == "Timer") {

            if(isPreview) {

                if(isKeepLoaded) {
                   SetCountDownTime(now);
                } else if(isThumbnail) {
                    then=now+(TimerSeconds)+(TimerMinutes*60);
                    TimerMinutes = ( TimerMinutes < 10 ? '0' : '' ) + TimerMinutes;
                    TimerSeconds = ( TimerSeconds < 10 ? '0' : '' ) + TimerSeconds;
                    SetText(TextBefore + TimerMinutes+':'+TimerSeconds + TextAfter, 'General Purpose Clock');
                } else {
                    SetCountDownTime(now);
                }

            } else {
                SetCountDownTime(now);
            }

        } else if(Mode == "Duration" || Mode == "Count") {

            if(isPreview) {

                if(isKeepLoaded) {
                    SetCount(currentTime);
                } else if(isThumbnail) {
                    startTime = new Date();
                    SetText(TextBefore + '0:00:00' + TextAfter, 'General Purpose Clock');
                } else {
                    SetCount(currentTime);
                }

            } else {
                SetCount(currentTime);
            }
        }

    });
}

function HandlePostMessage(event)
{
    if (event.data == "OnSceneLoad")
    {
        OnSceneLoad();
    }
    else if (event.data == "TogglePause")
    {
        TogglePause();
    }
}

if (smlTitleTimeouts && smlTitleTimeouts != null)
{
    clearTimeout(smlTitleTimeouts);
}

window.addEventListener('message', HandlePostMessage, false);

SetText("", 'General Purpose Clock');

var loadScriptCallback = function() {
     XJS = require('xjs');
     XJS.ready().then(function() {
        XJS_ITEM = XJS.Item;
        xjsIsReady = true;
        if(shouldTogglePause){
            shouldTogglePause = false;
            TogglePause();
        }
        getTime();
     })


};

loadScript(XJS_URL, loadScriptCallback);
