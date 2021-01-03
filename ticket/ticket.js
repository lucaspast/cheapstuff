const Discord = require('discord.js');
const fs = require('fs').promises;
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;

module.exports = {
    name: "ticket",
    description: "Create a ticket",
    usage: ".ticket, .close",
    category: "index",
    run: async (client, message, args) => {
        if (!message.member.roles.cache.some(role => role.id === '786307090796904508') &&
            !message.member.roles.cache.some(role => role.id === '785875072669188126')) {
            ticketntagg(client, message, args);
        } else {
            ticketatagg(client, message, args);
        }
    }
}


async function ticketntagg(client, message, args) {
    const categoryId = "787375240141078568";

    var userName = message.author.username;
    var userDiscriminator = message.author.discriminator;

    var bool = false;

    await message.guild.channels.cache.forEach((channel) => {
        if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {
            message.channel.send("you already got a ticket!");
            bool = true;
        }
    });

    if (bool == true) return;
    message.delete();

    message.guild.channels.create(userName + "-" + userDiscriminator, "text").then(async (createdChan) => {
        createdChan.setParent(categoryId).then(async (settedParent) => {
            await settedParent.updateOverwrite(message.guild.roles.everyone, { VIEW_CHANNEL: false });
            await settedParent.updateOverwrite(message.author, {
                "READ_MESSAGES": true,
                "SEND_MESSAGES": true,
                "ATTACH_FILES": true,
                "CREATE_INSTANT_INVITE": false,
                "ADD_REACTIONS": true,
                "VIEW_CHANNEL": true

            });

            var embedParent = new Discord.MessageEmbed()
                .setDescription("Support will be with you shortly!")
                .setColor("GREEN")

            settedParent.send(`${message.member} welcome!`)
            settedParent.send(embedParent);
        }).catch(err => {
            message.channel.send("something went wrong.");
            console.error(err);
        });

    }).catch(err => {
        message.channel.send("something went wrong.");
        console.error(err);
    });
}

async function ticketatagg(client, message, args) {
    const categoryId = "787375240141078568";

    var userName = message.author.username;
    var userDiscriminator = message.author.discriminator;

    var bool = false;

    await message.guild.channels.cache.forEach((channel) => {
        if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {
            message.channel.send("you already got a ticket!");
            bool = true;
        }
    });

    if (bool == true) return;
    message.delete();

    message.guild.channels.create(userName + "-" + userDiscriminator, "text").then(async (createdChan) => {
        createdChan.setParent(categoryId).then(async (settedParent) => {
            await settedParent.updateOverwrite(message.guild.roles.everyone, { VIEW_CHANNEL: false });
            await settedParent.updateOverwrite(message.author, {
                "READ_MESSAGES": true,
                "SEND_MESSAGES": true,
                "ATTACH_FILES": true,
                "CREATE_INSTANT_INVITE": false,
                "ADD_REACTIONS": true,
                "VIEW_CHANNEL": true

            });

            var embedParent = new Discord.MessageEmbed()
                .setDescription("Support will be with you shortly!")
                .setColor("GREEN")

            let staff = message.guild.roles.cache.get('785870025546268742')
            settedParent.send(`${message.member} welcome,\n${staff} will help you out!`)
            settedParent.send(embedParent);
        }).catch(err => {
            message.channel.send("something went wrong.");
            console.error(err);
        });

    }).catch(err => {
        message.channel.send("something went wrong.");
        console.error(err);
    });
}

module.exports.close = async (client, message, args) => {
    let goAhead = false;

    const categoryId = "787375240141078568";

    // Als bericht in ticket kanaal is dan verwijder kanaal ander zend bericht
    if (message.channel.parentID == categoryId) {
        if (message.author.id == "548834388100775946") {
            await transcript(client, message, args).then(res => goAhead = res);
            if (goAhead == true) {
                message.channel.delete();
            }
        } else return
    } else return

    if (goAhead == true) {
        var embedCloseTicket = new Discord.MessageEmbed()
            .setDescription(`ticket ${message.channel.name} has been closed!`)

        var logChannel = message.guild.channels.cache.get("785917180834349097");
        return logChannel.send(`ticket ${message.channel.name} has been closed!`, { files: ["./ticket/index.html"] });
    }
}


async function transcript(client, message, args) {
    await message.delete();
    let messageCollection = new Discord.Collection();
    let channelMessages = await message.channel.messages.fetch({
        limit: 100
    }).catch(err => console.log(err));

    messageCollection = messageCollection.concat(channelMessages);

    while (channelMessages.size === 100) {
        let lastMessageId = channelMessages.lastKey();
        channelMessages = await message.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
        if (channelMessages) {
            messageCollection = messageCollection.concat(channelMessages);
        }
    }

    let msgs = messageCollection.array().reverse();
    let data = await fs.readFile('./ticket/template.html', 'utf8').catch(err => console.log(err));
    if (data) {
        await fs.writeFile('./ticket/index.html', data).catch(err => console.log(err));
        let guildElement = document.createElement('div');
        let guildText = document.createTextNode(message.guild.name);
        let guildImg = document.createElement('img');
        guildImg.setAttribute('src', message.guild.iconURL());
        guildImg.setAttribute('width', '150');
        guildElement.appendChild(guildImg);
        guildElement.appendChild(guildText);
        await fs.appendFile('./ticket/index.html', guildElement.outerHTML).catch(err => console.log(err));

        await msgs.forEach(async msg => {
            let parentContainer = document.createElement('div');
            parentContainer.className = "parent-container";

            let avatarDiv = document.createElement('div');
            avatarDiv.className = "avatar-container";
            let img = document.createElement('img');
            img.setAttribute('src', msg.author.displayAvatarURL());
            img.className = "avatar";
            avatarDiv.appendChild(img);

            parentContainer.appendChild(avatarDiv);

            let messageContainer = document.createElement('div');
            messageContainer.className = "message-container";

            let nameElement = document.createElement('span');
            let name = document.createTextNode(msg.author.tag + " " + msg.createdAt.toDateString() + " " + msg.createdAt.toLocaleTimeString());
            nameElement.appendChild(name);
            messageContainer.appendChild(nameElement);

            if (msg.content.startsWith("```")) {
                let m = msg.content.replace(/```/g, "");
                let codeNode = document.createElement('code');
                let textNode = document.createTextNode(m);
                codeNode.appendChild(textNode);
                messageContainer.appendChild(codeNode);
            }
            else {
                let msgNode = document.createElement('span');
                let textNode = document.createTextNode(msg.content);
                msgNode.appendChild(textNode);
                messageContainer.appendChild(msgNode);
            }

            parentContainer.appendChild(messageContainer);
            await fs.appendFile('./ticket/index.html', parentContainer.outerHTML).catch(err => console.log(err));
        });

        await console.log("transcript saved!");
        return true
    }
};