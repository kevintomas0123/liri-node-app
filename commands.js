require('dotenv').config();
var fs = require('fs');

var request = require('request');
var Table = require('cli-table');

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var keys = require('./keys');

//instantiations:
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var table = new Table({
  chars: {
    top: '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    bottom: '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    left: '',
    'left-mid': '',
    mid: '',
    'mid-mid': '',
    right: '',
    'right-mid': '',
    middle: ' '
  },
  style: { 'padding-left': 0, 'padding-right': 0 }
});

//HANDLE LOGGING INFO
var getDate = () => {
  var nowUgly = Date.now();
  var timePretty = new Date(nowUgly);
  return timePretty;
};

var fetchAllLogs = () => {
  try {
    var allTheLogs = fs.readFileSync('log.txt', 'utf8');

    return JSON.parse(allTheLogs);
  } catch (error) {
    return [];
  }
};
var logData = text => {
  fs.writeFileSync('log.txt', JSON.stringify(text));
};
var updateLog = results => {
  var currentLogs = fetchAllLogs();
  currentLogs.push(results);
  logData(currentLogs);
};

//LIRI COMMANDS
var spotifyThisSong = title => {
  spotify.search(
    {
      type: 'track',
      query: title || 'A Town Called Malice'
    },
    function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      var preview = data.tracks.items[0].preview_url;
      var artist = data.tracks.items[0].artists[0].name;
      var album = data.tracks.items[0].artists[0].name;
      table.push(
        { Title: title || 'A Town Called Malice' },
        { Artist: artist || 'The Jam' },
        { Album: album || '' },
        { Preview: preview || '' }
      );
      var spotifyData = {
        time: getDate(),
        Title: title || 'A Town Called Malice',
        Artist: artist || 'The Jam',
        Album: album || '',
        Preview: preview || ''
      };
      console.log(table.toString());
      updateLog(spotifyData);
    }
  );
};

var movieThis = name => {
  var url = `http://www.omdbapi.com/?t=${name ||
    'the castle'}&apikey=trilogy`;
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var info = JSON.parse(body);
      table.push(
        { 'Movie Title': info.Title },
        { 'Release Date': info.Year },
        { 'IMDB Rating': info.Ratings[0].Value },
        { 'Rotten Tomatoes Rating': info.Ratings[1].Value },
        { 'Country(ies)': info.Country },
        { Language: info.Language },
        { Starring: info.Actors },
        { Plot: info.Plot }
      );
      var movieResults = {
        time: getDate(),
        'Movie Title': info.Title,
        'Release Date': info.Year,
        'IMDB Rating': info.Ratings[0].Value,
        'Rotten Tomatoes Rating': info.Ratings[1].Value,
        'Country(ies)': info.Country,
        Language: info.Language,
        Starring: info.Actors,
        Plot: info.Plot
      };
      console.log(table.toString());
      updateLog(movieResults);
    }
  });
};

var myTweets = () => {
  client.get(
    'statuses/user_timeline.json?screen_name=KevinTomas5&count=20',
    function(error, tweets, response) {
      if (error) throw error;
      for (var tweet in tweets) {
        table.push(
          { tweet: tweets[tweet]['text'] },
          { on: tweets[tweet]['created_at'] },
        );
      }
      var tweetLog = {
        time: getDate(),
        text: 'Tweets retrieved'
      };
      console.log(table.toString());
      updateLog(tweetLog);
    }
  );
};
var randomCommandom = () => {
  fs.readFile('random.txt', 'utf8', function(error, text) {
    if (error) throw error;
    var args = text.split(',');
    var song = args[1];
    var doThis = args[0];
    spotifyThisSong(song);
  });
};
var showLog = () => {
  var logTxt = fetchAllLogs();
  console.log(logTxt);
};

module.exports = {
  spotifyThisSong,
  movieThis,
  myTweets,
  randomCommandom,
  showLog
};