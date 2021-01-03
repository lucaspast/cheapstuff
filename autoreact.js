const Discord = require('discord.js');

module.exports = {
    name: "autoreact",
    proof: async (message) => {
        const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === '771697754220265472');
        message.react(reactionEmoji);
    },
    vouch: async (message) => {
        const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === '767388605684514847');
        message.react(reactionEmoji);
    }

}