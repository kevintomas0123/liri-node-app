require("dotenv").config();

//NODE MODULES
const fs = require('fs');

//THIRD PARTY MODULES
const inquirer = require('inquirer');

// OWN MODULES
const commands = require('./commands');

console.clear()

inquirer
.prompt([
  {type: "list",
  name: "commands",
  message: "What do you want from LIRI?",
  choices: ["my tweets", "spotify this song", "movie this", "do what this says", "show log"]}
])
.then(function(answer){
  var command = answer.commands;

  switch (command) {
    case 'my tweets':
      commands.myTweets();
      break;
    case 'spotify this song':
      inquirer
      .prompt([
        {
          name: "song",
          message: "What song would you like LIRI to look up? Use ''s or \"\"s, please."
        }
      ])
      .then(function(answer){
        var title = answer.song;
        // console.log(typeof title);//returns string
        commands.spotifyThisSong(title);
      })
      break;
    case 'movie this':
      inquirer
      .prompt([
        {
          name: "movie",
          message: "What movie would you like LIRI to look up? Use ''s or \"\"s, please."
        }
      ])
      .then(function(answer){
        var title = answer.movie;
        commands.movieThis(title);
      })
      break;
    case 'do what this says':
      commands.randomCommandom();
      break;
    case 'show log':
      commands.showLog();
      break;
    default:
      console.clear();
      console.log(`Sorry, I do not recognise ${command}. Please choose from the following: my tweets, spotify this song, movie this, do what this says, or show log.`);
  }
})


