const DataFormatter = require('./DataFormatter.js');
const DataExporter = require('./DataExporter.js');
const DataBase = require('./DataBase.js');
const cheerio = require('cheerio');

class DataFilter {
    constructor(htmlData) {
        this.$ = cheerio.load(htmlData);
        this.htmlData = htmlData;
    }

    startFiltering() {
        let db = new DataBase(process.env.dbhost, process.env.dbuser, process.env.dbpassword, process.env.dbname);
        let exporter = new DataExporter(this._filterOutData(this.htmlData));

        exporter.exportToDatabase(db);
        exporter.exportAsJSONTo('data.json');
        exporter.exportAsCSV();
    }

    /**
     * Gives us the important data of the html templates
     * @param data
     * @return {
     *              datetime,
     *              type,
     *              ...specificData
     *          }
     * @private
     */
     _filterOutData(data) {
        const cheerioData = this.$;
        const parsedData = JSON.parse(cheerioData('pre').text());
        const pureDataArr = parsedData.data
            .map(data => data[0])
            .filter(data => data !== 'Data for Stream');

        let typeNamesCollection = [];
        const exportData = this._filterOutRelevantDataOutOf(pureDataArr, typeNamesCollection, cheerioData);

        return DataFormatter.gatherByTypes(exportData, typeNamesCollection);
    }

     _findDataStructur(cheerioChildInstance) {
        const $ = this.$;
        const specDataArr = cheerioChildInstance;
        const dataStructure = [];

        specDataArr.each(function() {
            dataStructure.push({
                label: $(this).find('.label').text(),
                value: parseFloat($(this).find('.value').text()),
                unit: $(this).find('.unit').text()
            });
        });

        return dataStructure;
    }

     _filterOutRelevantDataOutOf(htmlArrayToFilterDataOutOf, typeCollection) {
        return htmlArrayToFilterDataOutOf.map(data => {
            const childInstance = cheerio.load(data);
            const type = childInstance('.title span').text();
            const datetime = childInstance('.datetime').text();
            let convertedData = this._findDataStructur(childInstance('.kpi'));
            this._gatherTypenames(typeCollection, type);

            convertedData = DataFormatter.createObjectOutOfArr(convertedData);

            return {
                datetime: DataFormatter.formatDate(datetime),
                type,
                ...DataFormatter.formatPropertyNames(convertedData)
            }
        });
    }
    _gatherTypenames(list, typeToSearchFor) {
        if (!list.find((typeInArr) => typeInArr === typeToSearchFor)) {
            list.push(typeToSearchFor);
        }
    }
}

module.exports = DataFilter;