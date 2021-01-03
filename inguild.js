const ticket = require('./ticket/ticket.js');
const codes = require('./codes.js');
const ban = require('./ban.js');
const mute = require('./mute.js');
const kick = require('./kick.js');
const nuke = require('./nuke.js');
const autoreact = require('./autoreact.js');
const giveaway = require('./giveaway.js');
const reactionroles = require('./reactionroles.js');


/**
 * 
 * @param {*} message 
 * @param {*} client 
 * @param {*} prefix 
 * @param {*} args
 */
exports.start = async function (message, client, prefix, args) {
    if (message.content.toLowerCase().startsWith(prefix + "ticket")) {
        ticket.run(client, message, args);
    }

    if (message.content.toLowerCase().startsWith(prefix + "close")) {
        ticket.close(client, message, args);
    }

    if (message.content.toLowerCase().startsWith(prefix + "codes")) {
        codes.run(client, message, args);
    }

    if (message.content.toLowerCase().startsWith(prefix + "ban ")) {
        ban.ban(message);
    }

    if (message.content.toLowerCase().startsWith(prefix + "tempban")) {
        ban.tempban(client, message, args);
    }

    if (message.content.toLowerCase().startsWith(prefix + "unban ")) {
        ban.unban(message);
    }

    if (message.content.toLowerCase().startsWith(prefix + "bans ")) {
        ban.bans(message);
    }

    if (message.content.toLowerCase().startsWith(prefix + "mute")) {

        mute.mute(message);
    }

    if (message.content.toLowerCase().startsWith(prefix + "tempmute")) {
        mute.tempmute(message, args);
    }

    if (message.content.toLowerCase().startsWith(prefix + "unmute")) {
        mute.unmute(message);
    }

    if (message.content.toLowerCase().startsWith(prefix + "kick")) {
        kick.run(message);
    }

    if (message.content.toLowerCase().startsWith(prefix + "nuke")) {
        nuke.run(message);
    }

    if (message.content.toLowerCase().startsWith(prefix + "giveaway")) {
        giveaway.run(message, args);
    }

    if (message.content.toLowerCase().startsWith(prefix + "reactionroles") ||
        message.content.toLowerCase().startsWith(prefix + "rs")) {
        reactionroles.run(client, message, args);
    }


    if (message.channel.id == "785908144941039656") {
        autoreact.proof(message)
    }

    if (message.channel.id == "785908248065867846") {
        autoreact.vouch(message);
    }
};

