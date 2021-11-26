const Discord = require('discord.js');

module.exports = {
    name: "invite",
    description: "Comando per ivitare il bot",
    aliases: ["invites"],
    execute(message, args) {

        var invite = new Discord.MessageEmbed()
            .setColor("#00ddff")
            .setTitle("INVITE ME")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=913525293740855337&permissions=10240&scope=bot")
            .setDescription("Invite me to your magical server! 🔗\nhttps://bit.ly/minepinger")

            .setFooter("Powered by MinePinger")
            .setTimestamp()

        message.channel.send(invite);

    }
}