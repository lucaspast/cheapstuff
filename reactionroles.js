const jsonSaver = require('./jsonsaver.js');
const fs = require('fs');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_ROLES'))
        return message.reply('you do not have the perms to use that command!⛔');

    let controler = message.author;
    let usedContent = null;
    let usedEmbed = null;
    let usedColorEmbed = null;
    let usedEmojiRoles = [];
    let usedChannel = null;
    let MESSAGES = 0;

    message.channel.send("You can always cancel the set-up process by typing `cancel` in this channel!");
    await message.channel.send({ embed: { color: "BLUE", description: "What do you want the message to say?" } })
        .then(msg => {
            client.on('message', async message => {
                if (message.content.toLowerCase().startsWith("cancel")) return message.reply("canceld the set-up process!"), MESSAGES = 7;
                if (MESSAGES == 0) {
                    if (msg.channel == message.channel) {
                        if (message.author == controler) {
                            usedContent = message.content;
                            msg.channel.send(
                                { embed: { color: "BLUE", description: "Do you wanne use a embed?(yes/no)" } }
                            )
                                .then(() => {
                                    MESSAGES++
                                })

                        }
                    }
                }
                else if (MESSAGES == 1) {
                    if (msg.channel == message.channel) {
                        if (message.author == controler) {
                            if (message.content.toLowerCase().startsWith("yes")) {
                                usedEmbed = true;
                                msg.channel.send(
                                    { embed: { color: "BLUE", description: "Wich color do you want the embed to have?" } }
                                )
                                    .then(() => {
                                        MESSAGES++;
                                    })
                            } else if (message.content.toLowerCase().startsWith("no")) {
                                usedEmbed = false;
                                await messageVizulaizer(usedContent, usedEmbed, usedColorEmbed, msg)
                                    .then(() => {
                                        MESSAGES++;
                                        MESSAGES++;
                                    })
                            } else {
                                message.reply('pls use yes or no!');
                            }
                        }
                    }
                }
                else if (MESSAGES == 2) {
                    if (msg.channel == message.channel) {
                        if (message.author == controler) {
                            if (message.content.toUpperCase() == 'GREEN' ||
                                message.content.toUpperCase() == 'BLUE' ||
                                message.content.toUpperCase() == 'RED' ||
                                message.content.toUpperCase() == 'BLACK' ||
                                message.content.toUpperCase() == 'PURPLE' ||
                                message.content.toUpperCase() == 'ORANGE' ||
                                message.content.toUpperCase() == 'YELLOW'
                            ) {
                                usedColorEmbed = message.content.toUpperCase();
                                await messageVizulaizer(usedContent, usedEmbed, usedColorEmbed, msg)
                                    .then(() => {
                                        MESSAGES++;
                                    })
                            } else {
                                message.channel.send(
                                    'Invalid color!\n[GREEN, BLUE, RED, BLACK, PURPLE, ORANGE, YELLOW]'
                                )
                            }
                        }
                    }
                }
                else if (MESSAGES == 3) {
                    if (msg.channel == message.channel) {
                        if (message.author == controler) {
                            if (message.content.toLowerCase().startsWith("yes")) {
                                message.channel.send(
                                    {
                                        embed: {
                                            color: "BLUE",
                                            description: "Wich reactions for what roles do you wanne use? Do it like this:\n `<emoji>` `<role mention>`"
                                        }
                                    }
                                )
                                    .then(() => {
                                        MESSAGES++;
                                    })
                            } else if (message.content.toLowerCase().startsWith("no")) {
                                MESSAGES = undefined;
                                return this.run(client, message, args);
                            } else {
                                message.reply('pls use yes or no!');
                            }
                        }
                    }
                }
                else if (MESSAGES == 4) {
                    if (msg.channel == message.channel) {
                        if (message.author == controler) {
                            let emoji = message.content.slice(0, 2);
                            let role = message.mentions.roles.first();
                            let validEmoji = false;

                            try {
                                await message.react(`${emoji}`).then(() => validEmoji = true)
                                    .catch(err => validEmoji = false)
                            } catch (err) {
                                validEmoji = false
                            }

                            if (validEmoji == true) {
                                if (role) {
                                    let reaRoleObj = {
                                        emoji: emoji,
                                        role: role.id
                                    }

                                    usedEmojiRoles.push(reaRoleObj);
                                    msg.channel.send('do you want to add more reaction roles to this message?(yes/no)')
                                        .then(() => {
                                            MESSAGES++;
                                        })
                                } else {
                                    message.reply('pls mention a role!')
                                }
                            } else {
                                message.reply('pls use a valid emoji!')
                            }
                        }
                    }
                }
                else if (MESSAGES == 5) {
                    if (msg.channel == message.channel) {
                        if (message.author == controler) {
                            if (message.content.toLowerCase().startsWith("yes")) {
                                msg.channel.send(
                                    {
                                        embed: {
                                            color: "BLUE",
                                            description: "Wich reactions for what roles do you wanne use? Do it like this:\n `<emoji>` `<role mention>`"
                                        }
                                    }
                                ).then(() => {
                                    MESSAGES--;
                                })
                            } else if (message.content.toLowerCase().startsWith("no")) {
                                msg.channel.send('Wich channel you want the message to be in?').then(() => {
                                    MESSAGES++;
                                })
                            } else {
                                message.reply('pls use yes or no!')
                            }
                        }
                    }
                }
                else if (MESSAGES == 6) {
                    if (msg.channel == message.channel) {
                        if (message.author == controler) {
                            usedChannel = message.mentions.channels.first();
                            if (usedChannel) {
                                reaRoleConstructer(usedChannel, usedEmbed, usedContent, usedEmojiRoles, usedColorEmbed).then(async res => {
                                    await jsonSaver.RR(usedEmojiRoles, res.id, msg.channel.guild)
                                    msg.channel.send({ embed: { color: "GREEN", description: "created the reaction role message!✅" } })

                                    runCol(res, res.id);
                                    return MESSAGES++;
                                })
                            } else {
                                message.reply('pls mention a channel!');
                            }
                        }
                    }
                }
            })
        })
};
exports.collecters = async client => {
    let msgFiles = fs.readdirSync("./rearoles");
    msgFiles.forEach(async msgFile => {
        let file = require(`./rearoles/${msgFile}`)
        client.guilds.cache.forEach(async guild => {
            guild.channels.cache.forEach(async channel => {
                if (channel.type == 'text') {

                    let message = await channel.messages.fetch(file.messageID).catch(err => { });

                    if (message) {
                        const filter = (reaction, user) => {
                            return user.id !== message.author.id;
                        };
                        const collector = message.createReactionCollector(filter);

                        await collector.on('collect', (reaction, user) => {
                            for (let i = 0; file.reactionRoles.length > i; i++) {
                                if (reaction.emoji.name == file.reactionRoles[i].emoji) {
                                    let member = guild.members.cache.get(user.id);

                                    if (!member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                                        try {
                                            let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                                            member.roles.add(role);
                                            reaction.users.remove(member.id);
                                        } catch (err) {
                                            console.log(err)
                                        };
                                    }
                                    else if (member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                                        try {
                                            let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                                            member.roles.remove(role);
                                            reaction.users.remove(member.id);
                                        } catch (err) {
                                            console.log(err)
                                        };
                                    };
                                };
                            };
                        });
                    };
                };
            });
        });
    });
};


async function messageVizulaizer(usedContent, usedEmbed, usedColorEmbed, msg) {
    if (usedEmbed == true) {
        msg.channel.send("you're message will look like this:")
        msg.channel.send({ embed: { color: usedColorEmbed, description: usedContent } })
        return msg.channel.send("Do you wanne keep it?(yes/no)")

    } else if (usedEmbed == false) {
        msg.channel.send("you're message will look like this:")
        msg.channel.send(usedContent);
        return msg.channel.send("Do you wanne keep it?(yes/no)");

    }
}

async function reaRoleConstructer(channel, usedEmbed, content, usedEmojiRoles, color) {
    let msg;
    if (usedEmbed == true) {
        await channel.send({ embed: { color: color, description: content } }).then(x => {
            msg = x;
        })

        await usedEmojiRoles.forEach(x => {
            msg.react(x.emoji)
        });

    } else {
        await channel.send(content).then(x => {
            msg = x;
        });

        await usedEmojiRoles.forEach(x => {
            msg.react(x.emoji)
        });

    }

    return msg
}

async function runCol(msg, id) {
    let guild = msg.guild;
    let file = require(`./rearoles/${guild.name} ${id}.json`)
    const filter = (reaction, user) => {
        return user.id !== msg.author.id;

    };

    const collector = msg.createReactionCollector(filter);
    collector.on('collect', (reaction, user) => {
        for (let i = 0; file.reactionRoles.length > i; i++) {
            if (reaction.emoji.name == file.reactionRoles[i].emoji) {
                let member = guild.members.cache.get(user.id);

                if (!member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                    try {
                        let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                        member.roles.add(role);
                        reaction.users.remove(member.id);
                    } catch (err) {
                        console.log(err)
                    };
                }
                else if (member.roles.cache.find(role => role.id == file.reactionRoles[i].role)) {
                    try {
                        let role = reaction.message.guild.roles.cache.get(file.reactionRoles[i].role);
                        member.roles.remove(role);
                        reaction.users.remove(member.id);
                    } catch (err) {
                        console.log(err)
                    };
                };
            };
        };
    });
}


exports.delrs = async (client, message, args) => {
    if (!args[0]) return message.channel.send('pls provide a reaction role message ID!');
    const guild = message.guild;
    if (fs.existsSync(`./rearoles/${guild.name} ${args[0]}.json`)) {
        guild.channels.cache.forEach(async channel => {
            if (channel.type == 'text') {
                let msg = await channel.messages.fetch(args[0]).catch(err => { });
                if (!msg) return;
                fs.unlinkSync(`./rearoles/${guild.name} ${msg.id}.json`);
                msg.delete();
                return message.channel.send("Successfuly removed the reaction role message!");
            }
        })
    } else {
        return message.channel.send('The given message id is not recognized as a reaction role message id!');
    }
};