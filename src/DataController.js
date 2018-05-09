const DataFormatter = require('./DataFormatter.js');
const DataExporter = require('./DataExporter.js');
const DataBase = require('./DataBase.js');
const cheerio = require('cheerio');

/**
 * used for overall controlling of our Application after the login emulation
 */
class DataController {
    /**
     * Logic after Browser emulation
     * @param data
     * @return {
     *              datetime,
     *              type,
     *              ...specificData
     *          }
     * @private
     */
    static _filterOutData(data) {
        const cheerioData = cheerio.load(data);
        const parsedData = JSON.parse(cheerioData('pre').text());
        const pureDataArr = parsedData.data
            .map(data => data[0])
            .filter(data => data !== 'Data for Stream');

        let typeNamesCollection = [];
        const exportData = DataController._b(pureDataArr, typeNamesCollection, cheerioData);

        return DataFormatter.gatherByTypes(exportData, typeNamesCollection);
    }

    static _findDataStructur(originalCheerioObject, cheerioObject) {
        let specDataArr = cheerioObject;
        let dataStructure = [];

        specDataArr.each(function() {
            dataStructure.push({
                label: originalCheerioObject(this).find('.label').text(),
                value: parseFloat(originalCheerioObject(this).find('.value').text()),
                unit: originalCheerioObject(this).find('.unit').text()
            });
        });

        return dataStructure;
    }

    static _b(htmlArrayToFilterDataOutOf, typeNamesArray, cheerioObject) {
        return htmlArrayToFilterDataOutOf.map(data => {
            let pcData = cheerio.load(data);
            let type = pcData('.title span').text();

            /**
             * Gather Type-names
             */
            if (!typeNamesArray.find((typeInArr) => typeInArr === type)) {
                typeNamesArray.push(type);
            }

            /**
             * Filter out the relevant Data and collect it in the Array
             */
            let datetime = pcData('.datetime').text();
            let convertedData = DataController._findDataStructur(cheerioObject ,pcData('.kpi'));

            convertedData = DataFormatter.createObjectOutOfArr(convertedData);

            return {
                datetime: DataFormatter.formatDate(datetime),
                type,
                ...DataFormatter.formatPropertyNames(convertedData)
            }
        });
    }

    static dataHandler(data) {
        let db = new DataBase(process.env.dbhost, process.env.dbuser, process.env.dbpassword, process.env.dbname);
        let exporter = new DataExporter(DataController._filterOutData(data));

        exporter.exportToDatabase(db);
        exporter.exportAsJSONTo('data.json');
        exporter.exportAsCSV();
    }
}

module.exports = DataController;