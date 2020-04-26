var moment = require('moment');

let holidaysList = {
    fr:{
    }
};
//add holidays in 2020
addHoliday('fr',2020,01,01,"Jour de l'An");
addHoliday('fr',2020,04,13,"Pâques");
addHoliday('fr',2020,05,01,"Fête du Travail");
addHoliday('fr',2020,05,08,"Armistice 1945");
addHoliday('fr',2020,05,21,"Ascension");
addHoliday('fr',2020,06,01,"Pentecôte");
addHoliday('fr',2020,07,14,"Fête nationale");
addHoliday('fr',2020,08,15,"Assomption");
addHoliday('fr',2020,11,01,"Toussaint");
addHoliday('fr',2020,11,11,"Armistice 1918");
addHoliday('fr',2020,12,25,"Noël");
//add holidays in 2021
addHoliday('fr',2021,01,01,"Jour de l'An");
addHoliday('fr',2021,04,05,"Pâques");
addHoliday('fr',2021,05,01,"Fête du Travail");
addHoliday('fr',2021,05,08,"Armistice 1945");
addHoliday('fr',2021,05,13,"Ascension");
addHoliday('fr',2021,05,24,"Pentecôte");
addHoliday('fr',2021,07,14,"Fête nationale");
addHoliday('fr',2021,08,15,"Assomption");
addHoliday('fr',2021,11,01,"Toussaint");
addHoliday('fr',2021,11,11,"Armistice 1918");
addHoliday('fr',2021,12,25,"Noël");

function addHoliday(country,YYYY,mm,dd,label){
    if (dd < 10) { DD = '0'+dd};
    if (mm < 10) { MM = '0'+mm};

    let newHoliday = {
        moment:moment(YYYY+'-'+MM+'-'+DD),
        label:label
    }

    if (holidaysList[country]) { // a holiday has already been set in this country
        if (holidaysList[country][YYYY]) { // a holiday has already been set in this country and this year
            if (holidaysList[country][YYYY][mm]) { // a holiday has already been set in this country and this year and this month
                holidaysList[country][YYYY][mm][dd] = newHoliday;

            }
            else { // no holiday in this month has been set yet 
                holidaysList[country][YYYY][mm] = {} ;
                holidaysList[country][YYYY][mm][dd] = newHoliday ;
            } 
        }
        else { holidaysList[country][YYYY] = {} ; // no holiday in this year has been set yet
        holidaysList[country][YYYY][mm] = {};
        holidaysList[country][YYYY][mm][dd] = newHoliday;
        }

    }
    else { //holidaysList[country] = {YYYY : { mm : { dd : newHoliday } } }
    holidaysList[country] = {};
    holidaysList[country][YYYY] = {};
    holidaysList[country][YYYY][mm] = {};
    holidaysList[country][YYYY][dd] = newHoliday;

    } ;// no holiday in this country has been set yet 

}

exports.holidaysList = function (){ return holidaysList };

exports.isHoliday = function(country,moment) {
    const year =  moment.year();
    const month =  moment.month()+1;
    const date =  moment.date();
    if ( country in holidaysList){
        if ( year in holidaysList[country]) {
             if ( month in holidaysList[country][year]) {
                if ( date in holidaysList[country][year][month]) {
                    
                    return holidaysList[country][year][month][date].label ;
    
                }
                else return false;
            }
            else return false;

        }
        else return false;
        
    }
    else return false;
}