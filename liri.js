var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require("fs");

var t_consumer_key = keys.twitterKeys.consumer_key;
var t_consumer_secret = keys.twitterKeys.consumer_secret;
var t_access_token_key =  keys.twitterKeys.access_token_key;
var t_access_token_secret = keys.twitterKeys.access_token_secret;
var s_id = keys.spotifyKeys.id;
var s_secret = keys.spotifyKeys.secret;
var o_key = keys.omdbKeys.key;

var searchCmd = process.argv[2];
var searchVar = process.argv.slice(3).join("+");

switch (searchCmd) {
  case "my-tweets":
    getTwitter();
    break;
  case "spotify-this-song":
    getSpotify();
    break;
  case "movie-this":
    getMovie();
    break;
  case "do-what-it-says":
    getRandom();
    break;
}

function getTwitter() {
  
  var client = new Twitter({
    consumer_key: t_consumer_key,
    consumer_secret: t_consumer_secret,
    access_token_key: t_access_token_key,
    access_token_secret: t_access_token_secret
  });
  
  var params = {screen_name: 'nodejs'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log("------------------------------")
        console.log(tweets[i].text);
        console.log("Created at: " + tweets[i].created_at);
        console.log("By: " + tweets[i].user.name);
      }
    }
  });

}

function getSpotify() {
  var spotify = new Spotify({
    id: s_id,
    secret: s_secret
  });

  if (!searchVar) {
    searchVar = "The Sign Ace of Base";
  }
  
  spotify.search({ type: 'track', query: searchVar }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var arr = data.tracks.items;
    for (var i = 0; i < arr.length; i++) {
      console.log("------------------------------");
      var artists = arr[i].artists;
      var artistsStr = "Artist(s): " + artists[0].name;
      for (var j = 1; j < artists.length; j++) {
        if (artists.length > 1) {
          artistsStr += ", " + artists[j].name;
        }
      }
      console.log(artistsStr);
      console.log("Song: " + arr[i].name);
      console.log("Album: " + arr[i].album.name);
      console.log("Preview: " + arr[i].preview_url);
    }
  });
}

function getMovie() {

  if (!searchVar) {
    searchVar = "Mr.Nobody";
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + searchVar + "&y=&plot=short&apikey=" + o_key;

  request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDb Rating: " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}

function getRandom() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split(",");
    searchVar = data[1];
    switch (data[0]) {
      case "my-tweets":
        getTwitter();
        break;
      case "spotify-this-song":
        getSpotify();
        break;
      case "movie-this":
        getMovie();
        break;
    }
  });
}