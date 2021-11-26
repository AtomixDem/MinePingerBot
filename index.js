const Discord = require('discord.js');
global.client = new Discord.Client();
const util = require('minecraft-server-util');
const motd = require('minecraft-motd-util');

client.login("TOKEN_HERE");

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

client.on("message", message => {
    if (message.content.startsWith("?status")) {

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
                .setTitle("SERVER STATUS")
                // .setThumbnail("https://i.imgur.com/kfKxWjA.jpg")
                .setThumbnail("https://api.mcsrvstat.us/icon/" + response.host)
                .setDescription("\n**Address:** " + response.host + "\n**Port:** " + response.port + "\n**Status:** 🟢 ONLINE\n**Latency:** " + response.roundTripLatency + " ms\n**SRV Record:** " + response.srvRecord)

                .addField("Minecraft Version:", response.version, false)
                .addField("Players:", response.onlinePlayers + "/" + response.maxPlayers, true)
                .addField("MOTD:", "`" + response.motd.clean + "`", false)

                .setFooter("Powered by MinePinger")
                .setTimestamp();

                message.channel.send(embedStatus)

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
                    console.error(error);

            });
    }
})