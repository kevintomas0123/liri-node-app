require('dotenv').config();
const fs = require('fs');

const request = require('request');
const Table = require('cli-table');

const Spotify = require('node-spotify-api');
const Twitter = require('twitter');

const keys = require('./keys');

//instantiations:
const client = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);
const table = new Table({
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
const getDate = () => {
  var nowUgly = Date.now();
  var timePretty = new Date(nowUgly);
  return timePretty;
};

const fetchAllLogs = () => {
  try {
    var allTheLogs = fs.readFileSync('log.txt', 'utf8');

    return JSON.parse(allTheLogs);
  } catch (error) {
    return [];
  }
};
const logData = text => {
  fs.writeFileSync('log.txt', JSON.stringify(text));
};
const updateLog = results => {
  var currentLogs = fetchAllLogs();
  currentLogs.push(results);
  logData(currentLogs);
};

//LIRI COMMANDS
const spotifyThisSong = title => {
  spotify.search(
    {
      type: 'track',
      query: title || 'A Town Called Malice'
    },
    function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      const preview = data.tracks.items[0].preview_url;
      const artist = data.tracks.items[0].artists[0].name;
      const album = data.tracks.items[0].artists[0].name;
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

const movieThis = name => {
  const url = `http://www.omdbapi.com/?t=${name ||
    'the castle'}&apikey=trilogy`;
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const info = JSON.parse(body);
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

const myTweets = () => {
  client.get(
    'statuses/user_timeline.json?screen_name=KevinTomas5&count=20',
    function(error, tweets, response) {
      if (error) throw error;
      for (var tweet in tweets) {
        table.push(
          { tweet: tweets[tweet]['text'] },
          { on: tweets[tweet]['created_at'] },
          { '': '🐦 🐦 🐦 🐦 🐦 🐦 🐦 🐦' }
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
const randomCommandom = () => {
  fs.readFile('random.txt', 'utf8', function(error, text) {
    if (error) throw error;
    var args = text.split(',');
    const song = args[1];
    const doThis = args[0];
    spotifyThisSong(song);
  });
};
const showLog = () => {
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