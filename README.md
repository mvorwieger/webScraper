# Node JS Webscraper

to install:`npm install --save`

to start: `node src/app.js`

## Configuration

configuration is done by creating a .env file with the following Properties:
```
username=YOURUSERNAME
password=YOURPASSWORD
dbuser=YOURDATABASEUSERNAME
dbpassword=YOURDATABASEPASSWORD
dbhost=YOURDATABASEHOSTURL
dbname=YOURDATABASENAME
limit=HOWMANYSETSOFDATATOPULL -> Will pull 10 Datasets per Default if not given
```

make sure to start your Database before you start the App and create the database you've disclosed
in the configuration file(`YOURDATABASENAME`).

## Saving of Data
Data is saved in 3 Sources:
+ In `./csv/*` as Single Files per Action Type (Walking, Sleeping etc.)
+ As an Array of Objects in the data.json file in the root of the Project
+ In the Database you've enclosed in the configuration file

The Data in the Local files will be overwritten when new Data is pulled so make sure to Back them up if 
you do not have a Database to save it (could change in the future).

The Tables for the Database will be created by the Programme so make sure to either exactly copy the createTable script in `./scr/createTableQuery.js`
or just give your DBUSER the rights to create tables.

# Todo
Possible Features that are not implemented yet:
+ Scheduler
+ Optional Db Connection
+ Optional Local Saving
