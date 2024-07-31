async function validateDate(dateString){
    const dateObj = new Date(`${dateString}`);
    const time = dateObj.getTime();
    // console.log(isNaN(time));
    return !isNaN(time);

    // when is nan, means time is not number, invalid. 
    // when is not nan, means time is number, valid.
}

module.exports = validateDate;