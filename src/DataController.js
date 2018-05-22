const DataFilter = require('./DataFilter.js');

class DataController {
    constructor(websiteData) {
        this.websiteData = websiteData;
    }

    controll() {
        let dataFilterer = new DataFilter(this.websiteData);
        let db = new DataBase(process.env.dbhost, process.env.dbuser, process.env.dbpassword, process.env.dbname);
        let exporter = new DataExporter(DataFilter.filterOutData(this.websiteData));

        //exporter.exportToDatabase(db);
        exporter.exportAsJSONTo('data.json');
        exporter.exportAsCSV();
    }
}

module.exports = DataController;