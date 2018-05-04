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
        let db = new DataBase(process.env.dbhost, process.env.dbuser, process.env.dbpassword, process.env.dbname);

            this.dataToExport.forEach(objArr => {
                /**
                 * Using a Set because we don't want double entries
                 * @type {Set<any>}
                 */
                const fields = new Set();
                /**
                 * Get Field names of the property Keys
                 * and take out the type because we don't need it
                 */
                objArr.forEach(obj => {
                    Object.entries(obj).map(d => d[0]).forEach(data => {
                        fields.has(data) || data === 'type' ? console.log() : fields.add(data);
                    });
                });
                /**
                 * Set the Field names and parse our json data
                 * @type {JSON2CSVParser}
                 */
                const json2csvParser = new JsonToCSVParser({fields: [...fields.values()]});
                const csv = json2csvParser.parse(objArr);

                fs.writeFile(`./csv/${objArr[0].type}.csv`.toLowerCase(), csv, err => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(`./csv/${objArr[0].type}.csv has been successfully created`);
                        db.sendData(csv);
                    }
                })
            });
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
                console.log('file has been successfully created');
            }
        });
    }
}

module.exports = DataExporter;