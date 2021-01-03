exports.ban = async function (message) {
    let guild = message.guild;
    let member = message.mentions.members.first();
    if (!member) return message.channel.send({ embed: { color: "RED", description: "You need to input a user!" } });

    let reason = message.content.slice(28);
    if (!reason) reason = "undefined";

    member.send(`You where band from **${guild}** by ${message.author} reason:** ${reason}**`)
        .then(() => {
            member.ban().then(member => {
                message.channel.send(":wave: " + member.displayName + " has been banned geband!").catch(() => {
                    message.channel.send({ embed: { color: "RED", description: "error uhg!" } });
                })

            })
                .catch(err => {
                    console.error(err);
                    message.channel.send({ embed: { color: "RED", description: "error uhg!" } });
                })
        })
        .catch(err => console.error(err))
}

exports.unban = async function (message) {
    let userinfo = message.content.slice(7);
    if (!userinfo) return message.channel.send(`Please provide a ID or username!`);
    let found = false;

    message.guild.members.unban(userinfo)
        .catch(error => {
            console.error(error)
            message.guild.fetchBans().then(banned => {
                banned.forEach(user => {
                    if (userinfo == user.user.username) {
                        message.guild.members.unban(user.user.id)
                            .catch(error => console.error(error));
                        found = true;
                    }
                })
            })
                .then(x => {
                    if (found == false) {
                        message.channel.send('please provide a valid ID or username from a user thats band!');
                    }
                })
        })
};

exports.bans = async function (message) {
    message.guild.fetchBans()
        .then(banned => {
            let list = banned.map(ban => `${ban.user.tag} : ${ban.user.id}`).join('\n');

            if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;

            message.channel.send(`**${banned.size} users are banned:**\n${list}`);
        })
        .catch(console.error);
};



const ms = require("ms");

module.exports.tempban = async (bot, message, args) => {


    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Sorry you do not have permission to use this command.");

    var user = message.guild.member(message.mentions.users.first());

    if (!user) return message.channel.send("You use the command: .tempban user time reason.");

    if (user.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You can't tempban this user.");

    var reason = args.join(" ").slice(22);

    if (!reason) reason = "undefined";

    var tempBanTime = args[1];

    if (ms(tempBanTime)) {

        user.ban({ reason: `${reason}` })

        message.channel.send(`${user} has been banned for ${tempBanTime}`);

        setTimeout(function () {
            message.guild.members.unban(user.id).catch(err => console.error(err));

            message.channel.send(`${user} is no longer banned.`);

        }, ms(tempBanTime));

    } else {
        return message.channel.send("Specify and valid time.");
    }

}