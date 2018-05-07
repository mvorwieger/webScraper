const getDateTime = require ('./dateTime');

function getApiUrl() {
    const streamQueries = 'Activity,Weight,BloodPressure,Glucose,Nutrition,Oxygen,Sleep,Temperature',
        today = getDateTime(),
        offset = 0,
        limit = 10,
        startMonth = 'Feb',
        startDay = 1,
        startYear = 2018,
        endMonth = today.month,
        endDay = today.day,
        endYear = today.year,
        startDate = `${startMonth}%20${startDay},%20${startYear}`,
        endDate = `${endMonth}%20${endDay},%20${endYear}`,
        uri = `https://www.fitnesssyncer.com/notebook-data?op=list&stream=${streamQueries}&taskIds=Notebook,43c4e088-4cf3-4ef0-9d7f-f710f699a3f5,99ed24a3-3b43-4b6d-9656-9882cb0a72fc,ac3271dd-b481-48f8-9642-e6d768cdb124&activityTypes=&offset=${offset}&limit=${limit}&customStartDate=${startDate}&customEndDate=${endDate}`

    return uri;
}

function getLoginUrl() {
    return 'https://www.fitnesssyncer.com/sign-in';
}

module.exports = {getApiUrl, getLoginUrl};