const Discord = require('discord.js');
exports.run = async (message) => {
    let i = 0;
    let SMember = false;
    let SCount = false;
    let args = message.content.split(" ");
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        return message.channel.send("you can't use this command!");
    }

    let member = message.mentions.members.first();
    let count = args[2];
    if (count) SCount = true;
    if (!count && isNaN(args[1]) || count > 100) count = 100;
    if (isNaN(count)) SCount = false, count = 100;
    if (!isNaN(args[1])) count = args[1], SCount = true;
    await message.delete();

    let messageCollection = new Discord.Collection();
    let finalCut;
    await message.channel.messages.fetch({
        limit: 100
    }).then(messages => {
        if (member) {
            finalCut = messages.filter(msg => msg.author.id == member.id);
            SMember = true
        } else {
            finalCut = messages;
        }
    }).catch(err => console.log(err));

    messageCollection = messageCollection.concat(finalCut);

    messageCollection.forEach(message => {
        if (i < count) {
            message.delete();
            i++;
        }
    });

    let MESSAGE = "messages";
    if (i == 1) {
        MESSAGE = "message"
    }
    if (SMember == true && SCount == false) {
        message.channel.send(`nuked **${member.user.username}'s** messages!(max. 100)`).then(msg => {
            setTimeout(() => {
                msg.delete().catch(err => console.log(err));
            }, 5000)
        })
    } else if (SMember == false && SCount == true) {
        message.channel.send(`nuked ${i} ${MESSAGE}!(max. 100)`).then(msg => {
            setTimeout(() => {
                msg.delete().catch(err => console.log(err));
            }, 5000)
        })
    } else if (SMember == true && SCount == true) {
        message.channel.send(`nuked ${i} ${MESSAGE} of **${member.user.username}**!(max. 100)`).then(msg => {
            setTimeout(() => {
                msg.delete().catch(err => console.log(err));
            }, 5000)
        })
    } else if (SMember == false && SCount == false) {
        message.channel.send(`nuked all messages!(max. 100)`).then(msg => {
            setTimeout(() => {
                msg.delete().catch(err => console.log(err));
            }, 5000)
        })
    }
};