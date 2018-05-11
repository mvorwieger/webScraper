const Client = require('mariasql');
const queryArr = require('./util/createTableQuery.js')();

/**
 * Class to Interact with the Database
 * Also formats Data to fit SQL-standards
 */
class DataBase {
    constructor(host, user, password, dbname) {
        this.options =
            {
                mysql:
                    {
                        host,
                        user,
                        password,
                        database: dbname,
                        db: dbname
                    },
                csv: {
                    auto_parse: true
                }
            };

        this.client = new Client(this.options.mysql);
    }

    createTables() {
        return new Promise((resolve, reject) => {
            /**
             * Uses queryArr imported from createTableQuery.js
             */
            queryArr.forEach(sql => this.client.query(sql, (err, d) => {
                if(err) console.log(err);
                resolve(true);
            }));
        });
    };

    sendCsv(data, tableName) {
        /**
         * Make sure to create Tables if they don't exist before we send the Data
         */
        this.createTables().then(resolved => {
            const values = data.body.map(dataBody => this._formatCsvDataForSql(dataBody, data.head));
            const valueParams = '(' + values.join('), (') + ')';
            const headParams = data.head.join(',').replace('_%', '');
            const query = `insert ignore into ${tableName}(${headParams}) values ${valueParams}`;

            this.client.query(query, (err) => {
                if(err) {
                    console.log(query);
                    console.log(err);
                }
                else console.log(tableName + '[DataBase Success]');
            });
        });
    }

    _formatCsvDataForSql(csvDataBody, csvDataHead) {

            /**
             * Add quotation marks around the Date for the SQL-Query
             * @type {string[]}
             */
            let obj = Object.values(csvDataBody)
                .map((d, index) => index === 0 ? "'" + d + "'" : d)
                .filter((val, index) => index !== 1);
            /**
             * We have to push 0 for non existing elements
             * because we cant have undefined parameters in our query
             */
            if(obj.length < csvDataHead.length) {
                obj.push(0);
            }

            return obj;

    }
}

module.exports = DataBase;