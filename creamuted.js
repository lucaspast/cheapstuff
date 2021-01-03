exports.creaMuted = function (guild) {
  guild.roles.create({
    data: {
      name: 'Muted',
      color: 'GRAY'
    }
  })
    .then(guild => Mutedpermissions())
    .catch(console.error);

  function Mutedpermissions() {
    const Muted = guild.roles.cache.find(role => role.name == "Muted");
    Muted.setPermissions(0)
      .then(updated => console.log(`Updated permissions to ${updated.permissions.bitfield}`))
      .catch(error => console.error(error));

    guild.channels.cache.forEach(channel => {
      if (channel.type == "text")
        channel.updateOverwrite(Muted, { SEND_MESSAGES: false });
    })
  }
}