var box = require('./keys.js');
var request = require('request');
var filez = require('file-system');

var jax = require('ajax-request');

liri = function (command, qry) {

    command = process.argv[2] || command;
    qry = process.argv[3] || qry;

    if (command === 'my-tweets') {
        //pull last 20 tweets
        var Twitter = require('twitter');

        var keys = new Twitter(box.twitterKeys);

        var params = {screen_name: 'IzayoiLiyen', count: 20}
        keys.get('statuses/user_timeline', params, function(err, tweets, response) {
            if (!err) {
                twBox = [];
                for (var i = 0; i < tweets.length; i++) {
                    twBox.push({
                        'created: ' : tweets[i].created_at,
                        'Tweets: ' : tweets[i].text
                    });  
                };
                console.log(twBox);
            };
        })
    }

    else if (command === 'spotify-this-song') {
        // Show info about song - Artist, name, preview link, album
        var Spotify = require('node-spotify-api');
        var search = function(songName) {
            var spotify = new Spotify(box.spotifyKeys);

            var artistName = function(artist) {
                return artist.name;
            };
            var songName = process.argv[3] || 'The Sign';

            spotify.search({type: 'track', query: songName, limit: 7}, function(err, data) {
                if (!err) {
                    var songs = data.tracks.items;
                    var compilation = [];
                    for (var i = 0; i < songs.length; i++) {
                        compilation.push({
                            'artist: ' : songs[i].artists.map(artistName),
                            'song: ' : songs[i].name,
                            'preview: ' : songs[i].preview_url,
                            'album: ' : songs[i].album.name,
                        });
                    };
                    console.log(compilation);
                }
                else if (err) {
                    console.log('Error: ' + err)
                }
                // else if (songName == undefined) {
                //     songName = 'The Sign';
                //     search('The Sign');
                // };
            });
        };

        var select = function(caseData, functionData) {
            switch (caseData) {
                case 'spotify-this-song':
                search();
                break;
            default:
                console.log('申し訳ありませんが、入力が分かりません');
            }
        }
        var runSpotify = function(a, b) {
            select(a, b);
        };
        runSpotify(process.argv[2], process.argv[3]);

    }

    else if (command === 'movie-this') {
        // Movie - title, year, IMDB rating, Rotten Tomatoes rating, country, language, plot, actors
        var title = qry || 'Mr. Nobody';
        var queryURL = "http://www.omdbapi.com/?t=" + 
        title + "&y=&plot=short&apikey=40e9cece";
        
            request(queryURL ,function(err, response, body) {

                var film = JSON.parse(body)
                console.log('Title: ' + film['Title']);
                console.log('Year: ' + film['Year']);
                console.log('imdbRating: ' + film['Ratings'][0]['Value']);
                console.log('Rotten Tomatoes Rating: ' + film['Ratings'][1]['Value']);
                console.log('Country: ' + film['Country']);
                console.log('Language: ' + film['Language']);
                console.log('Plot: ' + film['Plot']);
                console.log('Actors: ' + film['Actors']);

        });



    }

    else if (command === 'do-what-it-says') {
        // Look inside of random.txt
        var doIt = './random.txt';
        filez.readFile(doIt, 'utf8', function(err, data) {
            if (err) throw err;
            var split = data.split(',');
            process.argv[2] = split[0];
            process.argv[3] = split[1];
            liri(process.argv[2], process.argv[3])
        });
    }
    else {
        console.log('申し訳ありませんが、入力された命令が分かりません。');
        console.log('---');
        console.log('my-tweets');
        console.log('---');
        console.log('spotify-this-song');
        console.log('---');
        console.log('movie-this');
        console.log('---');
        console.log('あるいは、');
        console.log('---');
        console.log('do-what-it-says');
        console.log('---');
        console.log('を入力してください。')
    }
};

liri();