const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

const inguild = require('./inguild.js');
const outguild = require('./outguild.js');
const reactionroles = require('./reactionroles');

client.login(token);

var http = require('http');

http.createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);



client.on('ready', () => {
    console.log('Your Bot is now Online.')
    let activities = [`cheapstuff`, `cheapstuff`, `cheapstuff`], i = 0;

    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: "STREAMING", url: "https://www.youtube.com/watch?v=DWcJFNfaw9c" }), 5000)
    reactionroles.collecters(client);
});


client.on('message', async (message) => {
    if (message.author.bot) return;
    let newPrefix = prefix;
    const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (message.guild) {
        inguild.start(message, client, prefix, args);
    } else {
        outguild.start(message, client, prefix, args);
    }
});


client.on("guildMemberAdd", async member => {
    try {
        var role = member.guild.roles.cache.find(role => role.id == "785904085526249484")
        member.roles.add(role);
    } catch (err) {
        console.error(err);
    }
});


client.on("channelCreate", channel => {
    if (channel.type == "text") {
        const Muted = channel.guild.roles.cache.find(role => role.name == "Muted");
        channel.updateOverwrite(Muted, { SEND_MESSAGES: false });
    }
})


setInterval(async () => {
    let guild = client.guilds.cache.get('785866514087542785');
    let allMemberC = guild.memberCount;
    let userC = guild.members.cache.filter(member => !member.user.bot).size;
    let botC = guild.members.cache.filter(member => member.user.bot).size;

    let allMemberCChannel = guild.channels.cache.get("785916160486670367");
    let userCChannel = guild.channels.cache.get("785916163745906720");
    let botCChannel = guild.channels.cache.get("785916166749028382");

    await allMemberCChannel.setName(`All Members: ${allMemberC}`);
    await userCChannel.setName(`Users: ${userC}`);
    await botCChannel.setName(`Bots: ${botC}`);
}, 300000)