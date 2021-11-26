const Discord = require('discord.js');

module.exports = {
    name: "info",
    description: "Comando info",
    aliases: ["information"],
    execute(message, args) {

        message.react("⏳");

        var info = new Discord.MessageEmbed()
            .setColor("#00ff55")
            .setTitle("INFO - MY BIOGRAPHY")
            .setDescription("Here is the main information about me. Write me `?help` privately to know my commands!\nMinePinger#7640 is a bot to view the status of any Minecraft server.")

            .addField("📟 Version:", "`1.0`", true)
            .addField("📚 Autor:", "`AtomixDem#9036`", true)
            .addField("📩 Discord:", "https://discord.gg/e9CtEWMZHJ", true)
            .addField("📂 Repository:", "https://github.com/AtomixDem/MinePingerBot", true)

            .setFooter("© 2021 - AtomixDem#9036")
            .setTimestamp()

        message.react("✅");

        message.author.send(info);

    }
}