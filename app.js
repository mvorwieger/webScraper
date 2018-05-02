//imports
const DataExporter = require('./DataExporter.js');
const DataFormatter = require('./DataFormatter.js');
const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: false,
    openDevTools: {mode: 'detach'},
    typeInterval: 1
});
const cheerio = require('cheerio');

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

//Used to gather type information
let typeArr = [];

nightmare.goto('https://www.fitnesssyncer.com/sign-in')
    .type('input#u', 'rm.social@t-online.de')
    .type('input#p', 'klarastrasse')
    .click('input#signinButton')
    .wait('.content')
    .goto(uri)
    .wait('pre')
    .evaluate(() => document.body.innerHTML)
    .then((data) => {
        let cData = cheerio.load(data);
        let parsedData = JSON.parse(cData('pre').text());
        let pureDataArr = parsedData.data
            .map(data => data[0])
            .filter(data => data !== 'Data for Stream');

        let exportData = pureDataArr.map(data => {
            //Render the dom part we need with cheerio
            let pcData = cheerio.load(data);

            //Storage for the Data
            let specificData = [];

            //Get title and datetime of activity
            let type = pcData('.title span').text();
            /**
             * Gather Typenames
             */
            if(!typeArr.find((typeInArr) => typeInArr === type)) {
                typeArr.push(type);
            }

            let datetime = pcData('.datetime').text();
            let specDataArr = pcData('.kpi');

            specDataArr.each(function() {
                specificData.push({
                    label: cData(this).find('.label').text(),
                    value: cData(this).find('.value').text(),
                    unit: cData(this).find('.unit').text()
                });
            });

            specificData = specificData.map(data => {
               return {[data.label]: data.value}
            });

            return {
                type,
                datetime,
                ...DataFormatter.realFlatten(specificData)
            }
        });
        //TODO: Add data to database
        let filteredData = DataFormatter.gatherByTypes(exportData, typeArr);
        let exporter = new DataExporter(JSON.stringify(filteredData, null, 4));
        exporter.exportAsJSONTo('./data.json');
        //console.dir(exportData, {color: true, depth: 10});
    })
    .catch(err => console.error(err));