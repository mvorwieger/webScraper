//imports
const DataController = require('./DataController.js');
const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: false,
    openDevTools: {mode: 'detach'},
    typeInterval: 1
});


//move this to env props or request user input
const username = 'rm.social@t-online.de';
const password = 'klarastrasse';

//Config
const streamQueries = 'Activity,Weight,BloodPressure,Glucose,Nutrition,Oxygen,Sleep,Temperature';
const offset = 0;
const limit = 10;
const startMonthname = 'Feb';
const startDay = 1;
const startYear = 2018;
const endMonthname = 'Apr';
const endDay = 26;
const endYear = 2018;
const startDate = `${startMonthname}%20${startDay},%20${startYear}`;
const endDate = `${endMonthname}%20${endDay},%20${endYear}`;
const uri = `https://www.fitnesssyncer.com/notebook-data?op=list&stream=${streamQueries}&taskIds=Notebook,43c4e088-4cf3-4ef0-9d7f-f710f699a3f5,99ed24a3-3b43-4b6d-9656-9882cb0a72fc,ac3271dd-b481-48f8-9642-e6d768cdb124&activityTypes=&offset=${offset}&limit=${limit}&customStartDate=${startDate}&customEndDate=${endDate}`;

nightmare.goto('https://www.fitnesssyncer.com/sign-in')
    .type('input#u', username)
    .type('input#p', password)
    .click('input#signinButton')
    .wait('.content')
    .goto(uri)
    .wait('pre')
    .evaluate(() => document.body.innerHTML)
    .then(data => DataController.dataHandler(data))
    .catch(err => console.error(err));