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

const queryArr = () => [blood_pressure, elliptical, other, sleep, steps, walking, weigh_in, weights];

module.exports = queryArr;