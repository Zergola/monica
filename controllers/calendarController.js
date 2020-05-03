var moment = require('moment');
var Event = require('../models/events');
var validator = require('validator');
// il faut importer la holidayList pour localeHolidaysList depuis holidaysController afin que la fonction
// generateWeekendList fonctionne
//
//

var holidaysModule = require("../modules/holidays");
let isHoliday = holidaysModule.isHoliday;
let defaultCountry = 'fr';
let weekendToDisplay = 52;

// Display the user calendar
exports.displayCalendar = async function(req, res) {
    let weekendList = generateWeekendList();
    let userEventList = await generateUserEventList(weekendList);

    dateFormat =     {
        sameDay: "[Aujourd'hui]",
        nextDay: "[Demain]",
        nextWeek: "dddd [prochain]",
        lastDay: "[Hier]",
        lastWeek: "dddd [dernier]",
        sameElse: "dddd Do MMM YYYY"
        }
    res.render('calendar', { title: 'Calendar', weekendList:weekendList, userEventList:userEventList, format:dateFormat });
};

function generateWeekendList(weekendList) {
    weekendList = [];
    for (let i = 0; i < weekendToDisplay; i++) {
        let saturday = moment().day(6+7*i);
        saturday.set('hour', 13); // resolve pb of timezone


        weekendList[i] = [];
        //let lastDay = { moment:moment().day(7+7*i), type:'weekendDay'};
        
        // checks if there is a long weekend or a bridge BEFORE the weekend
        for (let p = 3 ; p >= -1 ; p--) { //check from last wednesday to sunday
            // Object Day implementation
            let dayObj = {}
            let day = moment(saturday).subtract(p,'days');
            dayObj.moment = day;
            let holidayCheck = isHoliday(defaultCountry,day);
            
            if (holidayCheck){ 
                dayObj.type = "holiday";
                dayObj.label = holidayCheck;
            }
            else if ( (day.day() !== 0) && (day.day() !== 6) )  { 
                dayObj.type = "weekDay";
            }
            else { dayObj.type = "weekendDay"; }

            // update the list of days
            if (weekendList[i].length > 0) { //the weekend already started
                weekendList[i].push(dayObj);
            }
            else { if (holidayCheck || (dayObj.type === "weekendDay")){ weekendList[i].push(dayObj) } }
        }


        // checks if there is a long weekend or a bridge AFTER the weekend

        let endOfWeekendDays = [];
        for (let p = 4 ; p >= 2 ; p--) {
            // Object Day implementation
            let dayObj = {}
            let day = moment(saturday).add(p,'days');
            dayObj.moment = day;
            let holidayCheck = isHoliday(defaultCountry,day);

            if (holidayCheck){ 
                dayObj.type = "holiday";
                dayObj.label = holidayCheck;
            }
            else if ( (day.day() !== 0) && (day.day() !== 6) )  { 
                dayObj.type = "weekDay";
            }
            else { dayObj.type = "weekendDay"; }

            // update the list of days
            if (endOfWeekendDays.length > 0) { //the last day of the weekend is already in endOfWeekendDays[]
                endOfWeekendDays.push(dayObj);
            }
            else {
                if (holidayCheck){
                    endOfWeekendDays.push(dayObj);
                }
            }
        }
        endOfWeekendDays.reverse()
        weekendList[i] = weekendList[i].concat(endOfWeekendDays);
    }

return weekendList;
}

async function generateUserEventList(weekendList) {
    // list the user events


    var promesse = new Promise((resolve, reject) => {
        Event.find().exec(function(err,foundEvents){
            let eventList=[];
            eventList.length=52;

            for (let j in foundEvents) {
                let event = foundEvents[j];
                let eventStartDate = moment(event.startDate);
                let eventEndDate = moment(event.endDate);

                for (let i = 0; i < weekendToDisplay;i++) {
                    let weekendStartDate = weekendList[i][0].moment;
                    let weekendEndDate = weekendList[i][weekendList[i].length-1].moment;


                    if (eventEndDate.isBefore(weekendStartDate,'day') || weekendEndDate.isBefore(eventStartDate,'day') ) {
                    }
                    else {
                        eventList[i] = event;
                        eventList[i].title = validator.unescape(eventList[i].title);
                    }
                }
            }
            resolve(eventList);
        })
    });

    return(promesse);   
}