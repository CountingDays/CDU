// Twitter Bot - @Countingdaysup
// Author - Nishith P (@nishithp2004)

var Twit = require('twit');
const fetch = require('node-fetch');
const db = require('quick.db');
require('dotenv').config();

// Twitter API Configuration
var T = new Twit({
    consumer_key: process.env.KEY,
    consumer_secret: process.env.KEY_SECRET,
    access_token: process.env.TOKEN,
    access_token_secret: process.env.TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true
})

var daysOfYear, counter = 1,
    d = new Date();

// Twitter Bot Initialised on Jan 1st 2021 0300 UTC hours
if (d.getFullYear === 2021 && d.getUTCHours() === 3) {
    tweetStart();
}
// Setting Interval for Function repetition
setInterval(tweetStart, 60 * 60 * 24 * 1000);

async function tweetStart() {
    let date = new Date();
    const response = await fetch('https://api.quotable.io/random')
    const data = await response.json()
    const arr = date.toUTCString().slice(0).split(/ +/);
    const dateString = arr.splice(0, arr.length - 2).join(" ");
    var tweet = `Day ${counter} \nDate: ${dateString} \n\n${data.content} —${data.author} \nHave a great Day!!`;

    var counterVerify = db.get("Number of days worked");

    if (counterVerify !== counter) {
        counter = counterVerify;
    }
    
    T.post('statuses/update', {
        status: tweet
    }, tweetCallback());

    ++counter;
    db.set("Number of days worked", counter);

    // Verifying whether Leap year or not
    if (date.getFullYear() % 4 === 0) {
        daysOfYear = 366;

    } else {
        daysOfYear = 365;
    }

    // Resetting counter value after a year
    if (counter === daysOfYear) {
        counter = 1;
    }

    function tweetCallback(data, err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success !!');
        }
    }
}