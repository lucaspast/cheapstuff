const Discord = require('discord.js');

module.exports = {
    name: "kick",
    run: async (message) => {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            try {
                let member = message.mentions.members.first();
                member.kick().then((member) => {
                    message.channel.send(":wave: " + member.displayName + " has been kicked!").catch(() => {
                        message.channel.send({ embed: { color: "RED", description: "error uhg!" } });
                    })
                })
            } catch (err) {
                console.log('error rong mention');
                catcherr(err, message);
            }
        }
    }
}