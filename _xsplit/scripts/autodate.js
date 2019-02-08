/*This script is a general purpose timing script*/

/**
 * @name DefaultSettings
 * @label 기초 설정
 * @type head
 */
//Count Mode & Duration Mode Settings;

/**
 * @name Mode
 * @label 모드
 * @type select
 * @options Date
 * @description 간단하게 오늘의 날짜를 표기해 줍니다.
 */
var Mode = "Date";

/**
 * @name DateFormat
 * @label 요일 표기
 * @type select
 * @options 짧게||길게
 * @description 짧게 = 2019년 1월 1일 화||길게 = 2019년 1월 1일 화요일
 */
var DateFormat = "길게";



var CountDateValue = "01/17/2018";
var CountTime = "06:44";
var CountStartingFormat = "HH : MM : SS";
var CountHideExtraZero = false;
var DisplayDayBeforeMonth = false;
var TimerMinutes = 0;
var TimerSeconds = 0;
var TimerStartingFormat = "MM : SS";
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
var DAY_ARRAY = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'),
    DAY_ARRAY_SHORT = new Array('일', '월', '화', '수', '목', '금', '토'),
    MONTH_ARRAY = new Array('1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월');
var currentTimeString='';
var startTime = new Date();
var componentName = '오늘의 날짜';


function getTime()
{
    var currentTime = new Date();

    if(Mode=='Date')
    {
        var currentWeekDay = currentTime.getDay();
        var currentDay = currentTime.getDate();
        var currentMonth = currentTime.getMonth();
        var currentYear = currentTime.getFullYear();

        if (DateFormat=='짧게')
        {
            // currentDay = ( currentDay < 10 ? '0' : '' ) + currentDay;
            // currentMonth = ( currentMonth < 9 ? '0' : '' ) + (currentMonth+1);

            if (DisplayDayBeforeMonth)
            {
                currentTimeString = currentYear + '년 ' + MONTH_ARRAY[currentMonth] + currentDay + '일 ' + DAY_ARRAY_SHORT[currentWeekDay];
                /* currentTimeString = DAY_ARRAY_SHORT[currentWeekDay] + ' ' + currentDay + '/' + currentMonth + '/' + currentYear.toString().substring(2); */
            }
            else
            {
                /* currentTimeString = DAY_ARRAY_SHORT[currentWeekDay] + ' ' + currentMonth + '/' + currentDay + '/' + currentYear.toString().substring(2); */
                currentTimeString = currentYear + '년 ' + MONTH_ARRAY[currentMonth] + currentDay + '일 ' + DAY_ARRAY_SHORT[currentWeekDay];
            }
        }
        else
        {
            if (DisplayDayBeforeMonth)
            {
                /* currentTimeString = DAY_ARRAY[currentWeekDay] + ', ' + currentDay + ' ' + MONTH_ARRAY[currentMonth] + ', ' + currentYear; */
                currentTimeString = currentYear + '년 ' + MONTH_ARRAY[currentMonth] + currentDay + '일 ' + DAY_ARRAY[currentWeekDay];
            }
            else
            {
                currentTimeString = currentYear + '년 ' + MONTH_ARRAY[currentMonth] + currentDay + '일 ' + DAY_ARRAY[currentWeekDay];
                /* currentTimeString = DAY_ARRAY[currentWeekDay] + ', ' + MONTH_ARRAY[currentMonth] + ' ' + currentDay + ', ' + currentYear; */
            }

        }
        SetText(currentTimeString, componentName);
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
        SetText(currentTimeString, componentName);
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
        SetText(displayText, componentName);

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

    SetText(displayText, componentName);
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
        SetText(daysText + hoursDifference+':'+minutesDifference+':'+secondsDifference, componentName);
    }
    else
    {
        hoursDifferenceInitial = (daysDifference * 24) + hoursDifferenceInitial;
        if (CountStartingFormat == "HH : MM : SS")
        {

            if (CountHideExtraZero)
            {
                SetText(hoursDifferenceInitial+':'+minutesDifference+':'+secondsDifference, componentName);
            }
            else
            {
                hoursDifference = ( hoursDifferenceInitial < 10 ? '0' : '' ) + hoursDifferenceInitial;
                SetText(hoursDifference+':'+minutesDifference+':'+secondsDifference, componentName);
            }

            return;
        }
        else if (CountStartingFormat == "MM : SS")
        {
            minutesDifferenceInitial = (hoursDifferenceInitial * 60) + minutesDifferenceInitial;
            if (CountHideExtraZero)
            {
                SetText(minutesDifferenceInitial+':'+secondsDifference, componentName);
            }
            else
            {
                minutesDifference = ( minutesDifferenceInitial < 10 ? '0' : '' ) + minutesDifferenceInitial;
                SetText(minutesDifference+':'+secondsDifference, componentName);
            }

            return;
        }
        else
        {
            secondsDifferenceInitial = (hoursDifferenceInitial * 60 * 60) + (minutesDifferenceInitial * 60) + secondsDifferenceInitial;
            if (CountHideExtraZero)
            {
                SetText(secondsDifferenceInitial, componentName);
            }
            else
            {
                secondsDifference = ( secondsDifferenceInitial < 10 ? '0' : '' ) + secondsDifferenceInitial;
                SetText(secondsDifference, componentName);
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
                    SetText(TimerMinutes+':'+TimerSeconds, componentName);
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
                    SetText('0:00:00', componentName);
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

SetText("", componentName);

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
