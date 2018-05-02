const DataFormatter = require('./DataFormatter.js');
const DataExporter = require('./DataExporter.js');
const cheerio = require('cheerio');

class DataController {
    static dataHandler(data) {
        //Used to gather type information
        let typeArr = [];

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
            if (!typeArr.find((typeInArr) => typeInArr === type)) {
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

    }
}

module.exports = DataController;