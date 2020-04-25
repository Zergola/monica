let weekendList = [];
var moment = require('moment');

// Display the user calendar
exports.displayCalendar = function(req, res) {
    weekendList = generateWeekendList();
    dateFormat =     {
        sameDay: "[Aujourd'hui]",
        nextDay: "[Demain]",
        nextWeek: "dddd",
        lastDay: "[Hier]",
        lastWeek: "dddd [dernier]",
        sameElse: "dddd Do MMM YYYY"
        }
    res.render('calendar', { title: 'Calendar', weekendList:weekendList, format:dateFormat });
};

function generateWeekendList() {
    let weekendList = [];

    for (let i = 0; i < 52; i++) {
        let firstDay = moment().day(6+7*i);
        let lastDay = moment().day(7+7*i);

        weekendList[i] = { 
        firstDay:firstDay,
        lastDay:lastDay
        }
    }
return weekendList;
}
