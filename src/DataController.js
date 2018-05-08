const DataFormatter = require('./DataFormatter.js');
const DataExporter = require('./DataExporter.js');
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
            let pcData = cheerio.load(data);
            let specificData = [];
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

            specificData = DataFormatter.createObjectOutOfArr(specificData);

            return {
                datetime: DataFormatter.formatDate(datetime),
                type,
                ...DataFormatter.formatPropertyNames(specificData)
            }
        });

        return DataFormatter.gatherByTypes(exportData, typeArr);
    }


    static dataHandler(data) {
        let exporter = new DataExporter(DataController._filterOutData(data));
        exporter.exportAsCSV();
        //exporter.exportToDb();
    }

}

module.exports = DataController;