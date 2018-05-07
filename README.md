# Node JS Webscraper

to install:`npm install --save`

to start: `node src/app.js`

## Configuration

configuration is done by create a .env file.
Properties needed for the app to work:
```
username=YOURUSERNAME
password=YOURPASSWORD
dbuser=YOURDATABASEUSERNAME
dbpassword=YOURDATABASEPASSWORD
dbhost=YOURDATABASEHOSTURL
dbname=YOURDATABASENAME
```

make sure to start your Database before you start the App and create the database you've disclosed
in the configuration file.

## Saving of Data
Data is saved in 3 Sources:
+ In the CSV directory inside the Project as Single Files per Type
+ As an Array of Object in the data.json file in the root of the Project
+ In the Database you've enclosed in the configuration file

The Data in the Local files will be overwritten when new Data is pulled so make sure to Back them up if 
you don't have a Database to save it.