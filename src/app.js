//imports
const {getApiUrl, getLoginUrl} = require('./uri.js');

/**
 * Dotenv
 * Needed for loading our environment variables on a local build
 */
require('dotenv').config();
const DataController = require('./DataController.js');
/**
 * Used to emulate user behaviour on their website to prevent web scraping preventions build into their site
 * @type {Nightmare}
 */
const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: true,
    openDevTools: {mode: 'detach'},
    typeInterval: 1
});

// Account-Data we need to login to the website
let username = '';
let password = '';
process.env.username ? username = process.env.username : console.log("Please specifie a username in the '.env' file (username=username)");
process.env.password ? password = process.env.password : console.log("Please specifie a password in the '.env' file (password=password)");

function startScraping() {
    //Emulate login into the Website to prevent the csrf protection
    nightmare.useragent('chrome')
        .goto(getLoginUrl())
        .type('input#u', username)
        .type('input#p', password)
        .click('input#signinButton')
        .wait('.content')
        .goto(getApiUrl())
        .wait('pre')
        .evaluate(() => document.body.innerHTML)
        .end()
        .then(DataController.dataHandler)
        .catch(console.error);
}
//TODO: add scheduler Option
startScraping();
