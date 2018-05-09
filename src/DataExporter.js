const JsonToCSVParser = require('json2csv').Parser;
const fs = require('fs');
const DataBase = require('./DataBase.js');

/**
 * Used to export data that was initially constructed with this class
 */
class DataExporter {
    constructor(dataToExport) {
        this.dataToExport = dataToExport;
    }

    exportAsCSV() {
        this.dataToExport.forEach(dataset => {
            const fields = this._collectTypenames(dataset);
            const csv = this._parseCSV(dataset, [...fields.values()]);
            const writePath = `./csv/${dataset[0].type}.csv`.toLowerCase();

            fs.writeFile(writePath, csv, err => {
                if (err) {
                    throw err;
                } else {
                    console.log(writePath + ' created');
                }
            })
        });
    }

    /**
     * @param database: DataBase
     */
    exportToDatabase(database) {
        this.dataToExport.forEach(dataset => {
            const fields = this._collectTypenames(dataset);
            const csv = this._parseCSV(dataset, [...fields.values()]);

            database.sendData({
                head: [...fields.values()],
                body: dataset
            }, dataset[0].type.split(' ').join('_').replace('-', '_').toLowerCase());
        })
    }

    /**
     * Export the Data constructed with this Object as Json
     * @param path
     */
    exportAsJSONTo(path) {
        fs.writeFile(path, JSON.stringify(this.dataToExport, null, 4), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(path + ' created');
            }
        });
    }

    /**
     * @param set
     * @return {Set<any>}
     * @private
     */
    _collectTypenames(set) {
        /**
         * Using a Set because we don't want double entries
         * @type {Set<any>}
         */
        const fields = new Set();

        set.forEach(obj => {
            Object.entries(obj).map(d => d[0]).forEach(typename => {
                if (!(fields.has(typename) || typename === 'type')) {
                    fields.add(typename);
                }
            });
        });

        return fields;
    }

    /**
     * @param csvData
     * @param fieldNames
     * @return {String}
     * @private
     */
    _parseCSV(csvData, fieldNames) {
        const json2csvParser = new JsonToCSVParser({fields: fieldNames});
        return json2csvParser.parse(csvData);
    }
}

module.exports = DataExporter;