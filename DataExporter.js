const JsonToCSVParser = require('json2csv').Parser;
const fs = require('fs');
class DataExporter {
    constructor(dataToExport) {
        this.dataToExport = dataToExport;
    }

    exportAsCSVTo(path) {
        //Figure out the csv format to export the data in
    }

    exportAsJSONTo(path) {
        fs.writeFile(path, this.dataToExport , (err) => {
            if(err) {
                console.log(err);
            } else{
                console.log('file has been successfully created');
            }
        });
    }
}

module.exports = DataExporter;