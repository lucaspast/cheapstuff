let fs = require('fs');

exports.RR = async (usedEmojiRoles, id, guild) => {
    let jsonobj = {
        messageID: id,
        reactionRoles: usedEmojiRoles
    }

    jsonData = JSON.stringify(jsonobj);
    fs.writeFileSync(`./rearoles/${guild.name} ${id}.json`, jsonData, function (err) {
        console.log(err);
    })
};