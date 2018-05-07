const DataFormatter = require('./DataFormatter.js');
const DataExporter = require('./DataExporter.js');
const cheerio = require('cheerio');
const DataBase = require('./DataBase.js');

/**
 * used for overall controlling of our Application after the login emulation
 */
class DataController {
    static dataHandler(data) {
        //Used to gather type information
        let typeArr = [];

        let cData = cheerio.load(data);
        let parsedData = JSON.parse(cData('pre').text());
        let pureDataArr = parsedData.data
            .map(data => data[0])
            .filter(data => data !== 'Data for Stream');

        /**
         * Map through the Array that is filled with html content
         * @type {Int32Array}
         */
        let exportData = pureDataArr.map(data => {
            //Render the dom part we need with cheerio
            let pcData = cheerio.load(data);

            //Storage for the Data
            let specificData = [];

            //Get title and datetime of activity
            let type = pcData('.title span').text();

            /**
             * Gather Type-names
             */
            if (!typeArr.find((typeInArr) => typeInArr === type)) {
                typeArr.push(type);
            }

            /**
             * Filter out the relevant Data and collect it in the Array
             */
            let datetime = pcData('.datetime').text();
            let specDataArr = pcData('.kpi');
            specDataArr.each(function() {
                specificData.push({
                    label: cData(this).find('.label').text(),
                    value: parseFloat(cData(this).find('.value').text()),
                    unit: cData(this).find('.unit').text()
                });
            });

            /**
             * modified data to label : value pairs
             * @type {any[]}
             */
            specificData = specificData.map(data => {
                return {[data.label]: data.value}
            });

            return {
                datetime: DataFormatter.formatDate(datetime),
                type,
                ...DataFormatter.formatPropertyNames(specificData)
            }
        });
        let filteredData = DataFormatter.gatherByTypes(exportData, typeArr);
        let exporter = new DataExporter(filteredData);
        exporter.exportAsJSONTo('./data.json');
        exporter.exportAsCSV();
    }
}

module.exports = DataController;