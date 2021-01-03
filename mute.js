const Discord = require('discord.js');
const ms = require('ms');
const constructMute = require('./creamuted.js')

exports.mute = async (message) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) {
        return message.channel.send("you can't use this command!");
    }

    if (!message.guild.roles.cache.find(role => role.name == "Muted")) {
        let guild = message.guild;
        constructMute.creaMuted(guild);
        setTimeout(() => { return this.mute(message) }, 2000)
    }

    let user = message.mentions.members.first();
    if (!user) return message.channel.send("You need to mention the user!");


    if (!user.roles.cache.find(role => role.name == "Muted")) {

        let role = user.guild.roles.cache.find(role => role.name == "Muted");
        let reason = message.content.slice(29);
        if (!reason) {
            reason = "undefined";
        }

        if (user.user.avatarURL() == null) {
            user.roles.add(role).then(user => message.channel.send({
                embed: {
                    "description": `${message.member} muted ${user}`,
                    "color": 5855587,
                    "author": {
                        "name": `${user.user.username}`,
                        "icon_url": `https://cdn.discordapp.com/embed/avatars/0.png`
                    },
                    "fields": [
                        {
                            "name": "reason:",
                            "value": reason
                        }
                    ]
                }
            }))
        } else {
            user.roles.add(role).then(user => message.channel.send({
                embed: {
                    "description": `${message.member} muted ${user}`,
                    "color": 5855587,
                    "author": {
                        "name": `${user.user.username}`,
                        "icon_url": `${user.user.avatarURL()}`
                    },
                    "fields": [
                        {
                            "name": "reason:",
                            "value": reason
                        }
                    ]
                }
            }))
        }
        return message.delete()
    } else {
        return message.channel.send({ embed: { color: "RED", description: "This user is already muted!" } });
    }
};

exports.tempmute = (message, args) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) {
        return message.channel.send("you can't use this command!");
    }

    if (!message.guild.roles.cache.find(role => role.name == "Muted")) {
        let guild = message.guild;
        constructMute.creaMuted(guild);
        setTimeout(() => { return this.mute(message) }, 2000)
    }

    let user = message.mentions.members.first();
    if (!user) return message.channel.send("You need to mention the user!");

    var tempMuteTime = args[1];

    if (ms(tempMuteTime)) {
        if (!user.roles.cache.find(role => role.name == "Muted")) {

            let role = user.guild.roles.cache.find(role => role.name == "Muted");

            if (user.user.avatarURL() == null) {
                user.roles.add(role).then(user => message.channel.send({
                    embed: {
                        "description": `${message.member} tempmuted ${user}`,
                        "color": 5855587,
                        "author": {
                            "name": `${user.user.username}`,
                            "icon_url": `https://cdn.discordapp.com/embed/avatars/0.png`
                        },
                        "fields": [
                            {
                                "name": "time:",
                                "value": tempMuteTime
                            }
                        ]
                    }
                }))
            } else {
                user.roles.add(role).then(user => message.channel.send({
                    embed: {
                        "description": `${message.member} tempmuted ${user}`,
                        "color": 5855587,
                        "author": {
                            "name": `${user.user.username}`,
                            "icon_url": `${user.user.avatarURL()}`
                        },
                        "fields": [
                            {
                                "name": "time:",
                                "value": tempMuteTime
                            }
                        ]
                    }
                }))
            }
            setTimeout(() => {
                user.roles.remove(role).then(() => {
                    message.channel.send(`${user} has been unmuted!`)
                }).catch(err => console.log(err))
            }, ms(tempMuteTime))

            return message.delete()
        } else {
            return message.channel.send({ embed: { color: "RED", description: "This user is already muted!" } });
        }
    } else {
        return message.channel.send("Specify and valid time.");
    }


};

exports.unmute = async (message) => {
    if (!message.member.hasPermission('MUTE_MEMBERS')) {
        return message.channel.send({ embed: { color: "RED", description: "you can't use this command!" } });
    }

    if (!message.guild.roles.cache.find(role => role.name == "Muted")) {
        let guild = message.guild;
        constructMute.creaMuted(guild);
        setTimeout(() => { return this.unmute(message) }, 2000)
    }

    let user = message.mentions.members.first();
    if (!user) return message.channel.send({ embed: { color: "RED", description: "You need to mention the user!" } });

    if (!user.roles.cache.find(role => role.name == "Muted")) return message.channel.send({ embed: { color: "RED", description: "This user isn't muted!" } });

    let role = user.guild.roles.cache.find(role => role.name == "Muted");
    user.roles.remove(role).then(user => {
        message.channel.send({ embed: { color: "GREEN", description: `successfully unmuted ${user}` } })
    })
};