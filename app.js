const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: true,
    openDevTools: {mode: 'detach'},
    typeInterval: 1
});
const cheerio = require('cheerio');
const username = 'rm.social@t-online.de';
const password = 'klarastrasse';
const streamQueries = 'Activity,Weight,BloodPressure,Glucose,Nutrition,Oxygen,Sleep,Temperature';
const offset = 0;
const limit = 10;
const startMonthname = 'Feb';
const startDay = 1;
const startYear = 2018;
const endMonthname = 'Apr';
const endDay = 28;
const endYear = 2018;
const startDate = `${startMonthname}%20${startDay},%20${startYear}`;
const endDate = `${endMonthname}%20${endDay},%20${endYear}`;
let data = [];

nightmare.goto('https://www.fitnesssyncer.com/sign-in')
    .type('input#u', 'rm.social@t-online.de')
    .type('input#p', 'klarastrasse')
    .click('input#signinButton')
    .wait('.content')
    .goto(`https://www.fitnesssyncer.com/notebook-data?op=list&stream=${streamQueries}&taskIds=Notebook,43c4e088-4cf3-4ef0-9d7f-f710f699a3f5,99ed24a3-3b43-4b6d-9656-9882cb0a72fc,ac3271dd-b481-48f8-9642-e6d768cdb124&activityTypes=&offset=${offset}&limit=${limit}&customStartDate=${startDate}&customEndDate=${endDate}`)
    .wait('pre')
    .evaluate(() => {
        return document.body.innerHTML;
    })
    .then((data) => {
        let cData = cheerio.load(data);
        let parsedData = JSON.parse(cData('pre').text());
        let pureDataArr = parsedData.data
            .map(data => data[0])
            .filter(data => data !== 'Data for Stream');

        let exportData = pureDataArr.map(data => {
            let pcData = cheerio.load(data);
            let title = pcData('.title span').text();
            let datetime = pcData('.datetime').text();
            let specificData = [];
            let specDataArr = pcData('.kpi');

            specDataArr.each(function(index, data) {
                specificData.push({
                    label: cData(this).find('.label').text(),
                    value: cData(this).find('.value').text(),
                    unit: cData(this).find('.unit').text()
                });
            });

            return {
                title,
                datetime,
                specificData
            }
        });
        //TODO: Add data to database
        console.dir(exportData, {color: true, depth: 10});
    })
    .catch(err => console.error(err));