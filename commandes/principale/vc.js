const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType
} = require('discord.js');

module.exports = {
  name: 'vc',
  description: 'Affiche les statistiques vocales du serveur.',
  wlOnly: true,
  async executeSlash(client, interaction) {
    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply();

    const members = await guild.members.fetch();
    const voiceChannels = guild.channels.cache.filter(channel =>
      channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice
    );

    let totalMembers = members.size;
    let membersOnline = guild.presences.cache.filter(p =>
      ["online", "dnd", "idle"].includes(p.status)
    ).size;
    let membersInVoice = 0;
    let membersWithCam = 0;
    let membersStreaming = 0;

    voiceChannels.forEach(channel => {
      channel.members.forEach(member => {
        membersInVoice++;
        if (member.voice.streaming) membersStreaming++;
        if (member.voice.selfVideo) membersWithCam++;
      });
    });

    const embed = new EmbedBuilder()
      .setTitle(`\`📊\`・Statistiques ${guild.name} !`)
      .setColor('#313338')
      .setDescription(
        `*Membres :* **${totalMembers}**\n` +
        `*En ligne :* **${membersOnline}**\n` +
        `*En Vocal :* **${membersInVoice}**\n` +
        `*En Cam :* **${membersWithCam}**\n` +
        `*En stream :* **${membersStreaming}**`
      );

    interaction.editReply({ embeds: [embed] });
  },

  data: new SlashCommandBuilder()
    .setName('vc')
    .setDescription('Affiche les statistiques vocales du serveur.')
};
