const Client = require('mariasql');
const queryArr = require('./createTableQuery.js')();

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

    sendData(data, tableName) {
        this.createTables().then(resolved => {
            const values = '(' + data.body.map(d => {
                /**
                 * Add quotation marks around the Date for the SQL-Query
                 * @type {string[]}
                 */
                let obj = Object.values(d)
                    .map((d, index) => index === 0 ? "'" + d + "'" : d)
                    .filter((val, index) => index != 1);
                /**
                 * We have to push 0 for non existing elements
                 * because we cant have undefined parameters in our query
                 */
                if(obj.length < data.head.length) {
                    obj.push(0);
                }

                return obj;
            }).join('), (') + ')';

            const query = `insert ignore into ${tableName}(${data.head.join(',').replace('_%', '')}) values ${values}`;

            this.client.query(query, (err, d) => {
                if(err) {
                    console.log(query);
                    console.log(err);
                }
                else console.log(tableName + '[Success]');
            });
        });
    }
}

module.exports = DataBase;