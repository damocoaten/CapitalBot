"use strict";
var request = require('request'),
  cheerio = require('cheerio'),
  fs = require('fs'),
  i = 0,
  content = 'Ed Sheeran',
  time = 180000;

var pull = setInterval(fetch, time);

function fetch() {
  //calling array inside function cleans the json file on initiation
  var list = {};
  request('http://www.capitalfm.com/radio/playlist/', function (error, response, body) {
    if (error) {
      console.log('Error: ' + error);
    }

    console.log('Success');

    var $ = cheerio.load(body);

    $('.now-playing__text-content').filter(function () {
      var title = $(this).find(".track a").text().trim();
      var artist = $(this).find(".artist").text().trim();
      var hours = new Date().getHours();
      var mins = new Date().getMinutes();

      list['current' + i] = {
        trackName: title,
        artistTitle: artist,
        playTime: hours + ":" + mins
      };

    });

    //write to file
    fs.writeFileSync('trackList.json', JSON.stringify(list, null, 4), function (error) {
      if (error) {
        console.log('Write error: ' + error);
      };
    });
    //read file
    fs.readFile('trackList.json', 'utf8', function (error, data) {
      if (error) {
        return console.log("Read error: " + error);
      }
      if (data.match(content)) {
        console.log('yaaas');
        fs.writeFileSync('result.js', '$(document).ready(function(){$(".ed-status").text("Of course he is!");$(".sad-ed").attr("src", "/images/happy-ed.jpg");})');
      } else {
        console.log('nope');
        fs.writeFileSync('result.js', '$(document).ready(function(){$(".ed-status").text("WHAT!? Not at the moment");$(".sad-ed").attr("src", "/images/sad-ed.jpg");})');
      }
    })
    i++;
  });
};