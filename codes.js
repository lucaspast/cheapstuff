const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "codes",
    run: async (client, message, args) => {
        console.log(args, message.content)
        if (!message.member.roles.cache.some(role => role.id === '785869454603976724') && !message.member.roles.cache.some(role => role.id === '787444381861806120')) {
            return message.channel.send('you dont have the perms to do that!');
        }
        if (args[0]) args[0] = args[0].toLowerCase();
        if (!fs.existsSync(`./codes/${args[0]}`)) {
            return message.channel.send('.codes <type> <number>\n`<type>` we dont have that type of codes!');
        } else {
            if (isNaN(args[1])) {
                return message.channel.send('the command was wrong!\n.codes <type> <number>');
            } else {
                let amount = fs.readdirSync(`./codes/${args[0]}`)
                if (args[1] > amount.length) return message.channel.send(`We only got ${amount.length} ${args[0]} code files!`);
                return message.channel.send({ files: [`./codes/${args[0]}/${args[0]} ${args[1]}.txt`] })
                    .catch(err => {
                        message.channel.send('oops something went wrong, try again later.');
                        console.error(err);
                    })
            }
        }
    }
}