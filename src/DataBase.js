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
        this.createTables();
    }

    createTables() {
        const blood_pressure = "CREATE TABLE IF NOT EXISTS blood_pressure(\n" +
            "   datetime  VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Systolic  INTEGER  NOT NULL\n" +
            "  ,Diastolic INTEGER  NOT NULL\n" +
            "  ,MAP       NUMERIC(5,1) NOT NULL\n" +
            "  ,Pulse     INTEGER  NOT NULL\n" +
            ");";

        const elliptical = "CREATE TABLE IF NOT EXISTS elliptical(\n" +
            "   datetime       VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Duration       INTEGER  NOT NULL\n" +
            "  ,Calories       INTEGER  NOT NULL\n" +
            "  ,Min_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Avg_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Max_Heart_Rate INTEGER  NOT NULL\n" +
            ");";

        const other = "CREATE TABLE IF NOT EXISTS other(\n" +
            "   datetime       VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Duration       INTEGER  NOT NULL\n" +
            "  ,Calories       INTEGER  NOT NULL\n" +
            "  ,Min_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Avg_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Max_Heart_Rate INTEGER  NOT NULL\n" +
            ");";

        const sleep = "CREATE TABLE IF NOT EXISTS sleep(\n" +
            "   datetime         VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Sleeping         NUMERIC(3,1) NOT NULL\n" +
            "  ,Awakenings       BIT  NOT NULL\n" +
            "  ,Sleep_Efficiency INTEGER  NOT NULL\n" +
            ");";

        const steps = "CREATE TABLE IF NOT EXISTS steps(\n" +
            "   datetime       VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Distance       NUMERIC(4,1) NOT NULL\n" +
            "  ,Calories       INTEGER  NOT NULL\n" +
            "  ,Min_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Avg_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Max_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Steps          INTEGER  NOT NULL\n" +
            ");";

        const walking = "CREATE TABLE IF NOT EXISTS walking(\n" +
            "   datetime  VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Distance  NUMERIC(4,1) NOT NULL\n" +
            "  ,Calories  INTEGER  NOT NULL\n" +
            "  ,Min_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Avg_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Max_Heart_Rate INTEGER  NOT NULL\n" +
            "  ,Steps     INTEGER  NOT NULL\n" +
            ");";

        const weigh_in = "CREATE TABLE IF NOT EXISTS weigh_in(\n" +
            "   datetime         VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Weight           NUMERIC(4,1) NOT NULL\n" +
            "  ,BMI              NUMERIC(4,1) NOT NULL\n" +
            "  ,Fat_Free_Mass    NUMERIC(4,1) NOT NULL\n" +
            "  ,Fat_Mass_Weight  NUMERIC(4,1) NOT NULL\n" +
            "  ,Fat_Ratio        NUMERIC(4,1) NOT NULL\n" +
            "  ,Body_Water_      NUMERIC(4,1)\n" +
            "  ,Body_Mass        NUMERIC(4,1) NOT NULL\n" +
            "  ,Bone_Mass        NUMERIC(4,1) NOT NULL\n" +
            "  ,Body_Muscle_Mass NUMERIC(4,1) NOT NULL\n" +
            ");";

        const weights = "CREATE TABLE IF NOT EXISTS weights(\n" +
            "   datetime VARCHAR(20)  NOT NULL PRIMARY KEY\n" +
            "  ,Duration BIT  NOT NULL\n" +
            "  ,Calories INTEGER  NOT NULL\n" +
            ");";

        const queryArr = [blood_pressure, elliptical, other, sleep, steps, walking, weigh_in, weights];
        queryArr.forEach(sql => this.client.query(sql, (err, d) => console.log(err, d)));
    };

    sendData(data) {
        fs.readdir('./csv', (err, files) => {
            files.forEach(filename => {
                const noEnding = filename.split('.')[0].split(" ").join("_");
                this.options.table = noEnding;
                cm.import(this.options, data, function(err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(rows);
                    }
                });
            })
        });
    }

    disconnect() {
    }
}

module.exports = DataBase;