const Discord = require("discord.js");
const RiotRequest = require("riot-lol-api");
const bot = new Discord.Client();
require('dotenv/config');

const YT_KEY = process.env.YT_KEY; //Youtube key
const token = process.env.DISCORD_TOKEN; //Discord token
const riotRequest = new RiotRequest("my_api_key"); //Riot api key -- still need to do this for when I add league stuff to the bot

const ytdl = require("ytdl-core");
const { YouTube } = require("better-youtube-api");
const youtube = new YouTube(YT_KEY, { cache: false });
const axios = require("axios");

const PREFIX = "uwu "; //Command prefix for people to interact with the bot

var servers = {};

bot.on("ready", () => {
    bot.user.setStatus("available");
    bot.user.setPresence({
        game: {
            name: PREFIX + "commands",
        },
    });
    console.log("This bot is online!");
});

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    let args = message.content.substring(PREFIX.length).split(" ");
    switch (args[0]) {
        case "coinflip":
            if (Math.floor(Math.random() * 2) == 1) {
                message.reply("heads");
            } else {
                message.reply("tails");
            }
            break;
        case "commands":
            let embed = new Discord.MessageEmbed()
                .setTitle("List of Commands, UwU")
                .addField(PREFIX + "bedtime", "I read a bedtime story out loud.")
                .addField(PREFIX + "coinflip", "50/50 heads or tails.")
                .addField(PREFIX + "dance", "I dance for u.")
                .addField(PREFIX + "joke", "I tell a joke.")
                .addField(PREFIX + "cat", "I send u a cat photo.")
                .addField(PREFIX + "voiceping", "I ping everyone in your voice channel.")
                .addField(
                    PREFIX + "cap [# of captains] except @User1 @User2",
                    "I pick team captains randomly from your voice channel. Optionally, to exclude specific users, type 'except' and @mention them in the message." +
                    "\n E.g: '" +
                    PREFIX +
                    "cap 2' or '" +
                    PREFIX +
                    "cap 2 except @" +
                    message.author.username +
                    "'"
                )
                .addField(
                    PREFIX + "randomteams [# of teams] [name 1],[name 2],...,[name n]",
                    "I generate random teams from a given list of players separated by commas.\n E.g.: '" +
                    PREFIX +
                    "randomteams 2 Faker, Darth Vader, Bjergsen, Squidward Tentacles'"
                )
                .addField(
                    PREFIX + "randomteamsvoice [# of teams] except @User1 @User2",
                    "I generate random teams from everyone in your current voice channel, not including my fellow bots. Optionally, to exclude specific users, type 'except' and @mention them in the message." +
                    "\n E.g: '" +
                    PREFIX +
                    "randomteamsvoice 2' or '" +
                    PREFIX +
                    "randomteamsvoice 2 except @" +
                    message.author.username +
                    "' or '" +
                    PREFIX +
                    "rtv 2' or '" +
                    PREFIX +
                    "rtv 2 except @" +
                    message.author.username +
                    "'"
                )
                .addField(
                    PREFIX + "rtv [# of teams] except @User1 @User2", "Same as randomteamsvoice, just shortened so you don't have to type it all out."
                )
                .addField(
                    PREFIX + "play song/video title or YouTube URL",
                    "Add a song to the queue. I'll join the voice channel and sing to you UwU. \nE.g. '" +
                    PREFIX +
                    "play spaghetti asmr' or '" +
                    PREFIX +
                    "play https://youtu.be/oN-HuMlf3bk'"
                )
                .addField(PREFIX + "skip", "Skips the current song.")
                .addField(
                    PREFIX + "stop",
                    "Clears the song queue and I leave the voice channel :(."
                )
                .setColor(0xde78e3);
            message.reply("Hello I'm the UwU bot");
            message.channel.send(embed);
            break;
        //------- Real commands start here --------\\
        //----- Random GArbage commands -----\\
        case "dance":
            try {
                let response = await axios.get(
                    "http://api.giphy.com/v1/gifs/random?api_key=VvFigFsfhXlS3ZZws76zv9qgJ3hBvUpB&tag=dancing&rating=pg"
                );
                let danceResponse = response.data;
                console.log(danceResponse);
                message.channel.send(danceResponse.data.embed_url);
            } catch (err) {
                console.log(err)
                message.channel.send(
                    "I can't dance right now :(."
                );
            }
            break;
        case "bedtime":
            message.channel.send("Once upon a time there was an uwu, the end.", {
                tts: true,
            });
            break;
        case "joke":
            try {
                let response = await axios.get(
                    "https://official-joke-api.appspot.com/random_joke"
                );
                let joke = response.data;
                message.channel.send(joke.setup + "\n" + joke.punchline + " UwU.");
            } catch {
                message.channel.send(
                    "Where does UwU bot get its jokes?\nA bad joke API cause it's broken now UwU :(."
                );
            }
            break;
        //----- RANDOM IMAGES -----\\
        case "cat":
            try {
                let response = await axios.get(
                    "https://api.thecatapi.com/v1/images/search?size=full"
                );
                let catResponse = response.data[0];
                console.log(catResponse);
                let catEmbed = new Discord.MessageEmbed()
                    .setImage(catResponse.url)
                    .setColor(0xde78e3);
                message.channel.send(catEmbed);
            } catch (err) {
                console.log(err)
                message.channel.send(
                    "Where does UwU bot get its cats?\nA bad cat API cause it's broken now UwU :(."
                );
            }
            break;
        case "anime":
            break;
        //----- League stuff? -----\\
        case "randomteams":
            //Will randomly separate a list of users evenly into a specified number of teams (up to 5 teams)
            //use case is: uwu randomteams [# of teams] [name 1],[name 2],[name 3],...,[name n]
            if (args[1] === "fromimage") {
                //Find the most recent image that has been uploaded by the user
                //use some javascript OCR library to get the names of everyone in the custom lobby
                //randomize teams
                message.channel.send("I can't do that yet uwu.");
                return;
            }

            //check if argument is a number
            console.log(args.length);
            console.log("Num teams " + args[1]);

            var numteams = parseInt(args[1]);

            if (!Number.isInteger(numteams)) {
                message.channel.send(
                    "Provide the number of teams you want to make (1 through 5).\nE.g.: " +
                    PREFIX +
                    "randomteams 2 Faker, Bjergsen, Bdd, Panama Hat"
                );
                return;
            }

            //Check if argument is between 1 and 5
            if (!(numteams >= 1 && numteams <= 5)) {
                message.channel.send(
                    "You can only make between 1 and 5 teams.\nE.g.: " +
                    PREFIX +
                    "randomteams 2 Faker, Bjergsen, Bdd, Panama Hat"
                );
                return;
            }

            let players = message.content
                .substring(PREFIX.length + "randomteams  n".length)
                .split(",");

            //Filter the blanks
            var filtered = players.filter(function (el) {
                return el != null && el.trim() != "";
            });

            if (filtered.length == 0) {
                message.channel.send(
                    "Please enter at least one name to make teams, uwu.\nE.g.: " +
                    PREFIX +
                    "randomteams 2 Faker, Bjergsen, Bdd, Panama Hat"
                );
                return;
            }
            if (filtered.length < numteams) {
                message.channel.send(
                    "You didn't give me enough players to make that many teams, :(."
                );
                return;
            }

            //randomize array
            shuffle(filtered);

            var split = chunkArrayInGroups(
                filtered,
                Math.ceil(filtered.length / numteams)
            );
            console.log(split);

            let team_embed = new Discord.MessageEmbed()
                .setTitle("Teams")
                .setColor(0xde78e3)
                .setThumbnail(
                    "https://vignette.wikia.nocookie.net/leagueoflegends/images/1/1e/UWU_Emote.png/revision/latest?cb=20190917205601"
                );

            for (var i = 0; i < numteams; i++) {
                var team_str = "";
                for (var j = 0; j < split[i].length; j++)
                    team_str += split[i][j].trim() + "\n";
                team_embed.addField("Team " + (i + 1), team_str);
            }
            message.channel.send(team_embed);

            break;
        case "rtv":
        case "randomteamsvoice":
            //Will randomly separate users in voice channel evenly into a specified number of teams (up to 50 teams)

            //Check if user is in a voice channel
            if (!message.member.voice.channel) {
                message.channel.send(
                    "You need to be in a voice channel to do this. :("
                );
                return;
            }
            //check if argument is a number
            console.log(message.content);
            console.log(message.mentions.users);
            console.log(args.length);
            console.log("Num teams " + args[1]);

            var numteams = parseInt(args[1]);
            var excludeOn = message.content.includes("except");

            if (!Number.isInteger(numteams)) {
                var errMessage =
                    "Provide the number of teams you want to make (1 through 50).\nE.g.: " +
                    PREFIX +
                    "randomteamsvoice 2";
                if (excludeOn) {
                    errMessage += " except <@" + message.author.id + ">";
                }
                message.channel.send(errMessage);
                return;
            }

            //Check if argument is between 1 and 5
            if (!(numteams >= 1 && numteams <= 50)) {
                var errMessage =
                    "You can only make between 1 and 50 teams.\nE.g.: " +
                    PREFIX +
                    "randomteamsvoice 2";
                if (excludeOn) {
                    errMessage += " except <@" + message.author.id + ">";
                }
                message.channel.send(errMessage);
                return;
            }

            if (excludeOn && message.mentions.users.size == 0) {
                message.channel.send(
                    "It looks like you tried to exclude people but didn't @ mention anyone (you can exclude multiple people too by just @ing them all). Try: " +
                    PREFIX +
                    "randomteamsvoice 2 except <@" +
                    message.author.id +
                    ">"
                );
            }

            var excludeOn = message.content.includes("except");
            var filtered = []; // from voice channel

            message.member.voice.channel.members.forEach(function (
                guildMember,
                guildMemberId
            ) {
                console.log(guildMemberId, guildMember.user.username);
                if (!guildMember.user.bot) {
                    //No bots and exclude any mentions
                    if (excludeOn) {
                        if (!message.mentions.users.has(guildMemberId)) {
                            filtered.push("<@" + guildMemberId + ">");
                        }
                    } else {
                        filtered.push("<@" + guildMemberId + ">");
                    }
                }
            });

            if (filtered.length == 0) {
                message.channel.send(
                    "Theres no available humans in your voice channel, uwu."
                );
                return;
            }
            if (filtered.length < numteams) {
                message.channel.send(
                    "There aren't enough available players in your channel to make that many teams, :(."
                );
                return;
            }

            //randomize array
            shuffle(filtered);

            var split = chunkArrayInGroups(
                filtered,
                Math.ceil(filtered.length / numteams)
            );
            console.log(split);

            let team_embed2 = new Discord.MessageEmbed()
                .setTitle("Teams")
                .setColor(0xde78e3)
                .setThumbnail(
                    "https://vignette.wikia.nocookie.net/leagueoflegends/images/1/1e/UWU_Emote.png/revision/latest?cb=20190917205601"
                );

            for (var i = 0; i < numteams; i++) {
                var team_str = "";
                for (var j = 0; j < split[i].length; j++)
                    team_str += split[i][j].trim() + "\n";
                team_embed2.addField("Team " + (i + 1), team_str);
            }
            message.channel.send(team_embed2);

            break;
        case "cap":
            //Will randomly pick captains from the user's voice channel

            //Check if user is in a voice channel
            if (!message.member.voice.channel) {
                message.channel.send(
                    "You need to be in a voice channel to do this. :("
                );
                return;
            }
            //check if argument is a number
            console.log(message.content);
            console.log(message.mentions.users);
            console.log(args.length);
            console.log("Num teams " + args[1]);

            var numcaps = parseInt(args[1]);
            var excludeOn = message.content.includes("except");

            if (!Number.isInteger(numcaps)) {
                var errMessage =
                    "Provide the number of captains you want to pick (1 through 50).\nE.g.: " +
                    PREFIX +
                    "cap 2";
                if (excludeOn) {
                    errMessage += " except <@" + message.author.id + ">";
                }
                message.channel.send(errMessage);
                return;
            }

            //Check if argument is between 1 and 5
            if (!(numcaps >= 1 && numcaps <= 50)) {
                var errMessage =
                    "You can only pick between 1 and 50 captains.\nE.g.: " +
                    PREFIX +
                    "cap 2";
                if (excludeOn) {
                    errMessage += " except <@" + message.author.id + ">";
                }
                message.channel.send(errMessage);
                return;
            }

            if (excludeOn && message.mentions.users.size == 0) {
                message.channel.send(
                    "It looks like you tried to exclude people but didn't @ mention anyone (you can exclude multiple people too by just @ing them all). Try: " +
                    PREFIX +
                    "cap 2 except <@" +
                    message.author.id +
                    ">"
                );
            }

            var filtered = []; // from voice channel

            message.member.voice.channel.members.forEach(function (
                guildMember,
                guildMemberId
            ) {
                console.log(guildMemberId, guildMember.user.username);
                if (!guildMember.user.bot) {
                    //No bots and exclude any mentions
                    if (excludeOn) {
                        if (!message.mentions.users.has(guildMemberId)) {
                            filtered.push("<@" + guildMemberId + ">");
                        }
                    } else {
                        filtered.push("<@" + guildMemberId + ">");
                    }
                }
            });

            if (filtered.length == 0) {
                message.channel.send(
                    "There are no available humans in your voice channel, uwu."
                );
                return;
            }
            if (filtered.length < numcaps) {
                message.channel.send(
                    "There aren't enough available players in your channel to pick that many captains, :(."
                );
                return;
            }

            //randomize array
            shuffle(filtered);

            let team_embed3 = new Discord.MessageEmbed()
                .setTitle("Team Captains")
                .setColor(0xe748f0)
                .setThumbnail(
                    "https://vignette.wikia.nocookie.net/leagueoflegends/images/1/1e/UWU_Emote.png/revision/latest?cb=20190917205601"
                );

            for (var i = 0; i < numcaps; i++) {
                team_embed3.addField("Captain " + (i + 1), filtered[i]);
            }
            message.channel.send(team_embed3);

            break;
        case "voiceping":
            //Will randomly separate a usrs in voice channel evenly into a specified number of teams (up to 5 teams)

            //Check if user is in a voice channel
            if (!message.member.voice.channel) {
                message.channel.send(
                    "You need to be in a voice channel to do this. :("
                );
                return;
            }

            let resp = ""

            message.member.voice.channel.members.forEach(function (
                guildMember,
                guildMemberId
            ) {
                console.log(guildMemberId, guildMember.user.username);
                if (!guildMember.user.bot) {
                    resp = resp + guildMember.toString() + " ";
                }
            });

            if (resp == "") {
                message.channel.send(
                    "There are no available humans in your voice channel, uwu."
                );
                return;
            }

            message.channel.send(resp);

            break;
        //----- MUSIC BOT THINGS -----\\
        case "play":
            function play(connection, message) {
                var server = servers[message.guild.id];
                const stream = ytdl(server.queue[0], {
                    filter: "audioonly",
                    highWaterMark: 1 << 25,
                });
                console.log("ATTEMPT PLAY: " + server.queue[0]);
                server.dispatcher = connection.play(stream).on("error", error => console.error(error));

                server.queue.shift();

                server.dispatcher.on("finish", function () {
                    if (server.queue[0]) {
                        play(connection, message);
                    } else {
                        connection.disconnect();
                    }
                });
            }

            var search_term = message.content.substring(PREFIX.length + 5).trim();
            console.log(search_term);

            if (!search_term) {
                message.channel.send(
                    "You need to provide a YouTube link or a song title."
                );
                return;
            }
            if (!message.member.voice.channel) {
                message.channel.send(
                    'You need to be in a voice channel to play music!'
                );
                return;
            }
            if (!message.member.voice.channel.joinable) {
                message.channel.send("UwU, I wasnt able to join the voice channel. :(");
                return;
            }
            if (!servers[message.guild.id]) servers[message.guild.id] = { queue: [] }; // Create a song queue for the server you're in

            var server = servers[message.guild.id];

            try {
                //const video = await youtube.getVideo(search_term);
                const response = await youtube.searchVideos(search_term, 1);
                console.log(response.results.length + " " + search_term);
                console.log(response.results);
                if (response.results.length === 0) {
                    message.channel.send("UwU, I couldn't find this video. :(");
                    return;
                }
                console.log(
                    "TITLE: " +
                    response.results[0].title +
                    "\n" +
                    "URL: " +
                    response.results[0].shortUrl
                );

                server.queue.push(response.results[0].url);

                let embed = new Discord.MessageEmbed()
                    .setTitle("Added to the queue, UwU")
                    .addField("Title", response.results[0].title, false)
                    .addField("Link", response.results[0].shortUrl, false)
                    .addField("Requester", message.author, false)
                    .setColor(0xde78e3)
                    .setThumbnail(response.results[0].thumbnails.high.url);
                message.channel.send(embed);

                if (!message.member.voice.connection) {
                    message.member.voice.channel.join().then(function (connection) {
                        play(connection, message);
                    });
                }
            } catch (e) {
                console.log(e);
                message.channel.send(
                    "UwU, something went wrong looking for this video. :("
                );
            }

            break;
        case "skip":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipped the song UwU.");
            break;
        case "stop":
            var server = servers[message.guild.id];
            if (message.member.voice.connection) {
                for (var i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                message.channel.send(
                    "Ended song queue, leaving the voice channel UwU."
                );
                console.log("stopped the queue");
            }
            break;
        default:
            message.reply(
                "I don't recognize that command. Type 'uwu commands' to see a list of commands and their syntax UwU."
            );
            break;
    }
});

bot.login(token);

function shuffle(array) {
    var idx = array.length;
    var rand, temp;

    while (idx !== 0) {
        rand = Math.floor(Math.random() * idx--);

        temp = array[idx];
        array[idx] = array[rand];
        array[rand] = temp;
    }
    return array;
}

function chunkArrayInGroups(arr, size) {
    var chunked = [];
    for (var i = 0; i < arr.length; i += size)
        chunked.push(arr.slice(i, i + size));

    return chunked;
}
