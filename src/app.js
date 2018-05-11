//imports
const {getApiUrl, getLoginUrl, getReferrerUrl} = require('./util/uri.js');

/**
 * Dotenv
 * Needed for loading our environment variables on a local build
 */
require('dotenv').config();
const DataController = require('./DataFilter.js');
/**
 * Used to emulate user behaviour on their website to prevent web scraping preventions build into their site
 * @type {Nightmare}
 */
const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: true,
    openDevTools: {mode: 'detach'},
    typeInterval: 10
});

// Account-Data we need to login to the website
let username = '';
let password = '';
process.env.username ? username = process.env.username : console.log("Please specifie a username in the '.env' file (username=username)");
process.env.password ? password = process.env.password : console.log("Please specifie a password in the '.env' file (password=password)");

function startScraping() {
    //Emulate login into the Website to prevent the csrf protection
    nightmare.useragent(getUserAgent())
        .viewport(1680, 1050)
        .goto(getLoginUrl())
        .type('input#u', username)
        .wait(getRandomInt(1, 5) * 1000)
        .type('input#p', password)
        .wait(getRandomInt(1, 5) * 1000)
        .click('input#signinButton')
        .wait('.content')
        .wait('.toolbar > .horzNoScroll > :nth-child(2) > a')
        .wait(getRandomInt(1, 5) * 1000)
        .click('.toolbar > .horzNoScroll > :nth-child(2) > a')
        .wait(getRandomInt(1, 5) * 1000)
        .goto(getApiUrl())
        .wait('pre')
        .end()
        .evaluate(() => document.body.innerHTML)
        .then(backEndResponse => {
            const dataHandler = new DataController(backEndResponse)
            dataHandler.startFiltering();
        })
        .catch(console.error);
}
//TODO: add scheduler Option
startScraping();