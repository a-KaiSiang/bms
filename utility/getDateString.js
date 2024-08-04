const validateDate = require('./validateDate');

function getDateString(dateString){
    if(!validateDate(dateString)){
        throw new Error("Invalid date provided");
    }

    const dateObj = new Date(dateString);
    
    const month = (dateObj.getMonth() + 1).toString();
    const day = (dateObj.getDate()).toString();

    const formattedMonth = month.length < 2 ? `0${month}` : month;
    const formattedDay = day.length < 2 ? `${day}` : day;
    const formattedDate = `${dateObj.getFullYear()}-${formattedMonth}-${formattedDay}`;
    return formattedDate;
}

module.exports = getDateString;