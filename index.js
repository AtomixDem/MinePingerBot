/*
Error: Index.js is nearing completion...
Author: AtomixDem#9036
*/
const Discord = require('discord.js');
global.client = new Discord.Client();
const disbut = require("discord-buttons")
const util = require('minecraft-server-util');
const motd = require('minecraft-motd-util');
const MongoClient = require("mongodb").MongoClient;
const { MessageButton, MessageActionRow } = require("discord-buttons")
const options = {
    enableSRV: true // SRV record lookup
};

client.login("TOKEN");

const fs = require("fs");

client.commands = new Discord.Collection();

const commandsFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

const eventsFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventsFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args))
}

client.on("message", message => {
    const prefix = "?";

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))) return

    var comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))

    if (comando.onlyStaff) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send("You are not allowed! 😶")
            return
        }
    }

    if (comando.onlyMod) {
        if (!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "MUTE_MEMBERS", "MANAGE_MESSAGES")) {
            message.channel.send("You are not allowed! 😶")
            return
        }
    }

    if (comando.onlyHelper) {
        if (!message.member.hasPermission("MUTE_MEMBERS", "MANAGE_MESSAGES")) {
            message.channel.send("You are not allowed! 😶")
            return
        }
    }

    comando.execute(message, args);
})


    // database.createCollection("Server") // Crea una nuova Collection

    // database.collection("Server").insertOne({id:"1234", username:"Test"})

    // database.collection("Server").updateOne({id:"1234"}, {$set:{username:"Test2"}})

    // database.collection("Server").deleteOne({id:"1234"})

    /*
    database.collection("Server").find({id:"1234"}).toArray(function(err, result) {
        // console.log(result)
        console.log(result[0].username)
    })
    */

var urldb = "mongodb+srv://minepinger:listpinser06@minepingerserverlist.59blbhv.mongodb.net/test"
MongoClient.connect(urldb, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
var database = db.db("InfoData");

// database.collection("McData").deleteOne({ServerIP:"metamc.it"})



client.on("message", message => {
    if (message.content.startsWith("?status")) {

        message.react("⏳");

        var ServerIp = message.content.slice(8);

        var wrongFormat = new Discord.MessageEmbed()
        .setColor("#f53333")
        .setTitle("🚫 Wrong format!")
        .setDescription("Wrong format for view the status!\n\nUse: `?status <IP address>`\n\nFor more help write me **?help**")
        .setFooter("Powered by MinePinger")
        .setTimestamp();

        if(!ServerIp) {
            message.channel.bulkDelete(1, true);
            message.channel.send(wrongFormat)
            .then(msg =>{
            msg.delete({timeout:30000})
            })
            return;
        }

        util.status(ServerIp) // port is default 25565
            .then((response) => {
                var ServerIp = message.content.slice(8);

                var embedStatus = new Discord.MessageEmbed()
                .setColor("#36bf04")
                .setTitle("SERVER STATUS - JAVA")
                // .setThumbnail("https://i.imgur.com/kfKxWjA.jpg")
                .setThumbnail("https://api.mcsrvstat.us/icon/" + response.host)
                .setDescription("\n**Address:** " + response.host + "\n**Status:** 🟢 ONLINE\n**Port:** " + response.port)
                .addField("Latency:", response.roundTripLatency + " ms", false)
                .addField("Players:", response.onlinePlayers + "/" + response.maxPlayers, true)
                .addField("Minecraft Version:", response.version, false)
                .addField("SRV Record:", response.srvRecord, false)
                // .addField("Description:", response.descriptionText, false) // Not work .descriptionText
                // response.samplePlayers 
                // .addField("Test", response.status, false) // Not work .status
                .addField("MOTD:", "`" + response.motd.clean + "`", false)
                // .addField("MOTD:", "`" + response.motd.raw + "`", false)
                // .addField("MOTD:", "`" + response.motd.html + "`", false)

                .setFooter("Powered by MinePinger")
                .setTimestamp();


                var JavaType = "JAVA SERVER";
                var JavaUserCommand = "?status";

                var Shost = response.host
                var Sport = response.port
                var Sroundtriplatency = response.roundTripLatency
                var Ssrvrecord = response.srvRecord
                var Sversion = response.version
                var Sonlineplayers = response.onlinePlayers
                var Smaxplayers = response.maxPlayers
                var Smotdclean = response.motd.clean

                var InfoPlayers = Sonlineplayers + "/" + Smaxplayers


                var server = message.member.guild;
                var botCount = server.members.cache.filter(member => member.user.bot).size;
                var userCount = server.memberCount - botCount;
                var userTotal = server.memberCount

                var serverName = server.name
                var serverOwner = server.owner.user.username
                var serverId = server.id
                var serverRegion = server.region
                var serverCreated = server.createdAt.toDateString()
                var levelBoost = server.premiumTier
                var serverBoost = server.premiumSubscriptionCount

                var date = new Date();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var time = hour + ":" + minute

                database.collection("UserData").insertOne({Date:date, UserCommand:JavaUserCommand, Time:time, ServerName:serverName, ServerID:serverId, ServerRegion:serverRegion, ServerCreated:serverCreated, OwnerServer:serverOwner, ServerBotCount:botCount, ServerUserCount:userCount, ServerTotalUser:userTotal, LevelBoost:levelBoost, ServerBoost:serverBoost})
                database.collection("McData").insertOne({Date:date, ServerType:JavaType, ServerIP:Shost, Port:Sport, Latency:Sroundtriplatency, SRV_Record:Ssrvrecord, Version:Sversion, Online_Players:InfoPlayers, Motd:Smotdclean})


                message.channel.send(embedStatus)
                message.react("✅");
                console.log("[" + date + "] - {" + JavaType + "} Updated database: McData, UserData.");

            })
                .catch((error) => {
            
                    var embedNotStatus = new Discord.MessageEmbed()
                    .setColor("#f53333")
                    .setTitle("PING ERROR")
                    .setThumbnail("https://i.imgur.com/LOpkNfq.jpg")
                    .setDescription("Ping error! Unable to reach `" + ServerIp + "`.\nThe server is offline or unreachable.")

                    .addField("If the server appears to be online:", "Try removing firewalls, VPNs, or\nanything that might block the ping.", true)

                    .setFooter("Powered by MinePinger")
                    .setTimestamp();

                    message.channel.send(embedNotStatus)
                    message.react("❌");
                    console.error(error);

            });

            

    }
})



client.on("message", message => {
    if (message.content.startsWith("?brstatus")) {

        message.react("⏳");

        var BedServerIp = message.content.slice(10);

        var wrongFormat2 = new Discord.MessageEmbed()
        .setColor("#f53333")
        .setTitle("🚫 Wrong format!")
        .setDescription("Wrong format for view the status!\n\nUse: `?status <IP address>`\n\nFor more help write me **?help**")
        .setFooter("Powered by MinePinger")
        .setTimestamp();

        if(!BedServerIp) {
            message.channel.bulkDelete(1, true);
            message.channel.send(wrongFormat2)
            .then(msg =>{
            msg.delete({timeout:30000})
            })
            return;
        }

        util.statusBedrock(BedServerIp) // port is default 25565
            .then((result) => {
                var BedServerIp = message.content.slice(10);

                var embedStatus2 = new Discord.MessageEmbed()
                .setColor("#36bf04")
                .setTitle("SERVER STATUS - BEDROCK")
                // .setThumbnail("https://i.imgur.com/kfKxWjA.jpg")
                .setThumbnail("https://api.mcsrvstat.us/icon/" + result.host)
                .setDescription("\n**Address:** " + result.host + "\n**Status:** 🟢 ONLINE\n**Edition:** " + result.edition + "\n**Version:** " + result.version)
                .addField("Gamemode:", "[" + result.gameModeID + "] " + result.gameMode, false)
                .addField("Players:", result.onlinePlayers + "/" + result.maxPlayers, true)
                // result.samplePlayers
                .addField("Latency:", result.roundTripLatency + " ms", false)
                .addField("Port IPv4:", result.portIPv4, false)
                .addField("Port IPv6:", result.portIPv6, false)
                .addField("Server ID:", result.serverID, false)
                .addField("Server GUID:", result.serverGUID, false)
                .addField("SRV Record:", "Host: " + result.host + "\nPort: " + result.port, false)
                .addField("MOTD:", "`" + result.motd.clean + "`", false)
                // .addField("MOTD:", "`" + result.motd.raw + "`", false)
                // .addField("MOTD:", "`" + result.motd.html + "`", false)

                .setFooter("Powered by MinePinger")
                .setTimestamp();


                var BRType = "BEDROCK SERVER";
                var BRUserCommand = "?brstatus";

                var BRShost = result.host
                var BRSportIPv4 = result.portIPv4
                var BRSportIPv6 = result.portIPv6
                // var BRSroundtriplatency = result.roundTripLatency
                var BRSsrvrecord = result.srvRecord
                var BRSversion = result.version
                var BRSonlineplayers = result.onlinePlayers
                var BRSmaxplayers = result.maxPlayers
                var BRSmotdclean = result.motd.clean

                var BRInfoPlayers = BRSonlineplayers + "/" + BRSmaxplayers


                var server = message.member.guild;
                var botCount = server.members.cache.filter(member => member.user.bot).size;
                var userCount = server.memberCount - botCount;
                var userTotal = server.memberCount

                var serverName = server.name
                var serverOwner = server.owner.user.username
                var serverId = server.id
                var serverRegion = server.region
                var serverCreated = server.createdAt.toDateString()
                var levelBoost = server.premiumTier
                var serverBoost = server.premiumSubscriptionCount

                var date = new Date();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var time = hour + ":" + minute

                database.collection("UserData").insertOne({Date:date, UserCommand:BRUserCommand, Time:time, ServerName:serverName, ServerID:serverId, ServerRegion:serverRegion, ServerCreated:serverCreated, OwnerServer:serverOwner, ServerBotCount:botCount, ServerUserCount:userCount, ServerTotalUser:userTotal, LevelBoost:levelBoost, ServerBoost:serverBoost})
                database.collection("McData").insertOne({Date:date, ServerType:BRType, ServerIP:BRShost, Port_IPv4:BRSportIPv4, Port_IPv6:BRSportIPv6, /*Latency:Sroundtriplatency, */SRV_Record:BRSsrvrecord, Version:BRSversion, Online_Players:BRInfoPlayers, Motd:BRSmotdclean})


                message.channel.send(embedStatus2)
                message.react("✅");
                console.log("[" + date + "] - {" + BRType + "} Updated database: McData, UserData.");

            })
                .catch((error2) => {
            
                    var embedNotStatus2 = new Discord.MessageEmbed()
                    .setColor("#f53333")
                    .setTitle("PING ERROR")
                    .setThumbnail("https://i.imgur.com/LOpkNfq.jpg")
                    .setDescription("Ping error! Unable to reach `" + BedServerIp + "`.\nThe server is offline or unreachable.")

                    .addField("If the server appears to be online:", "Try removing firewalls, VPNs, or\nanything that might block the ping.", true)

                    .setFooter("Powered by MinePinger")
                    .setTimestamp();

                    message.channel.send(embedNotStatus2)
                    message.react("❌");
                    console.error(error2);

            });

            

    }
})
})
