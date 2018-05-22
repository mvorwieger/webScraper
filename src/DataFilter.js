const DataFormatter = require('./DataFormatter.js');
const DataExporter = require('./DataExporter.js');
const DataBase = require('./DataBase.js');
const cheerio = require('cheerio');

class DataFilter {
    constructor(htmlData) {
        this.$ = cheerio.load(htmlData);
        this.htmlData = htmlData;
    }


    /**
     * Gives us the important data of the html templates
     * @param data
     * @return {
     *              datetime,
     *              type,
     *              ...specificData
     *          }
     *
     */
     filterOutData(data) {
        const cheerioData = this.$;
        const parsedData = JSON.parse(cheerioData('pre').text());
        const pureDataArr = parsedData.data
            .map(data => data[0])
            .filter(data => data !== 'Data for Stream');

        let typeNamesCollection = [];
        const exportData = this._filterOutRelevantDataOutOf(pureDataArr, typeNamesCollection, cheerioData);

        return DataFormatter.gatherByTypes(exportData, typeNamesCollection);
    }

     _findDataStructure(cheerioChildInstance) {
        const $ = this.$;
        const dataStructure = [];

         /**
          * using each and push here because the $.each method has a weird api
          */
         cheerioChildInstance.each(function() {
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
            let convertedData = this._findDataStructure(childInstance('.kpi'));
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