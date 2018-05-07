const cm = require('csv-mysql');
const fs = require('fs');
const Client = require('mariasql');

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
            const blood_pressure = "CREATE TABLE IF NOT EXISTS blood_pressure(\n" +
                "   datetime  DATETIME   PRIMARY KEY\n" +
                "  ,systolic  INTEGER  \n" +
                "  ,diastolic INTEGER  \n" +
                "  ,map       NUMERIC(5,1) \n" +
                "  ,pulse     INTEGER  \n" +
                ");";

            const elliptical = "CREATE TABLE IF NOT EXISTS elliptical(\n" +
                "   datetime       DATETIME   PRIMARY KEY\n" +
                "  ,duration       INTEGER\n" +
                "  ,calories       INTEGER  \n" +
                "  ,min_heart_rate INTEGER  \n" +
                "  ,avg_heart_rate INTEGER  \n" +
                "  ,max_heart_rate INTEGER  \n" +
                ");";

            const other = "CREATE TABLE IF NOT EXISTS other(\n" +
                "   datetime       DATETIME   PRIMARY KEY\n" +
                "  ,duration       INTEGER\n" +
                "  ,calories       INTEGER  \n" +
                "  ,min_heart_rate INTEGER  \n" +
                "  ,avg_heart_rate INTEGER  \n" +
                "  ,max_heart_rate INTEGER  \n" +
                ");";

            const sleep = "CREATE TABLE IF NOT EXISTS sleep(\n" +
                "   datetime         DATETIME   PRIMARY KEY\n" +
                "  ,sleeping         NUMERIC(3,1) \n" +
                "  ,awakenings       BIT  \n" +
                "  ,sleep_efficiency INTEGER  \n" +
                ");";

            const steps = "CREATE TABLE IF NOT EXISTS steps(\n" +
                "   datetime       DATE   PRIMARY KEY\n" +
                "  ,distance       NUMERIC(4,1) \n" +
                "  ,calories       INTEGER  \n" +
                "  ,min_heart_rate INTEGER  \n" +
                "  ,avg_heart_rate INTEGER  \n" +
                "  ,max_heart_rate INTEGER  \n" +
                "  ,steps          INTEGER  \n" +
                ");";

            const walking = "CREATE TABLE IF NOT EXISTS walking(\n" +
                "   datetime  DATETIME  PRIMARY KEY\n" +
                "  ,Distance  NUMERIC(4,1) \n" +
                "  ,Duration  INTEGER  \n" +
                "  ,Calories  INTEGER  \n" +
                "  ,Avg_Speed NUMERIC(3,1) \n" +
                "  ,Max_Speed NUMERIC(3,1) \n" +
                "  ,Pace      INTEGER \n" +
                ");";

            const weigh_in = "CREATE TABLE IF NOT EXISTS weigh_in(\n" +
                "   datetime         DATETIME   PRIMARY KEY\n" +
                "  ,weight           NUMERIC(4,1) \n" +
                "  ,bmi              NUMERIC(4,1) \n" +
                "  ,fat_free_mass    NUMERIC(4,1) \n" +
                "  ,fat_mass_weight  NUMERIC(4,1) \n" +
                "  ,fat_ratio        NUMERIC(4,1) \n" +
                "  ,body_water      NUMERIC(4,1)\n" +
                "  ,body_mass        NUMERIC(4,1) \n" +
                "  ,bone_mass        NUMERIC(4,1) \n" +
                "  ,body_muscle_mass NUMERIC(4,1) \n" +
                ");";

            const weights = "CREATE TABLE IF NOT EXISTS weights(\n" +
                "   datetime DATETIME   PRIMARY KEY\n" +
                "  ,duration INTEGER \n" +
                "  ,calories INTEGER\n" +
                ");";

            const queryArr = [blood_pressure, elliptical, other, sleep, steps, walking, weigh_in, weights];
            queryArr.forEach(sql => this.client.query(sql, (err, d) => {
                if(err) console.log(err);
                resolve(true);
            }));

        });
    };

    sendData(data, tableName) {
        this.createTables().then(resolved => {
            const values = '(' + data.body.map(d => {
                let obj = Object.values(d).map((d, index) => index === 0 ? "'" + d + "'" : d)
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

            const query = `insert ignore into ${tableName}(${data.head.join(',')}) values ${values}`;

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