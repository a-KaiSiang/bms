const validateDate = require('./validateDate');

function getDateString(dateString){
    if(!validateDate(dateString)){
        throw new Error("Invalid date provided");
    }

    const dateObj = new Date(dateString);
    const formattedDate = `${dateObj.getFullYear()}-${dateObj.getMonth()+1}-${dateObj.getDate()}`;
    return formattedDate;
}

module.exports = getDateString;