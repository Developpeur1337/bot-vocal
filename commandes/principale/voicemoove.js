const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  name: 'voicemoove',
  description: 'Déplace tous les utilisateurs de ton salon vocal actuel vers un autre salon vocal.',
  wlOnly: true,
  async executeSlash(client, interaction) {
    const targetChannel = interaction.options.getChannel('destination');

    if (!interaction.member.voice?.channel) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Vous devez être dans un salon vocal pour utiliser cette commande.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!targetChannel || (targetChannel.type !== ChannelType.GuildVoice && targetChannel.type !== ChannelType.GuildStageVoice)) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Le salon spécifié n'est pas un salon vocal valide.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Je n'ai pas la permission de déplacer des membres.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const members = interaction.member.voice.channel.members;

    if (!members.size) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Il n'y a aucun membre dans votre salon vocal à déplacer.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await interaction.deferReply();

      const promises = members.map(member => {
        if (member.voice.channelId !== targetChannel.id) {
          return member.voice.setChannel(targetChannel)
            .catch(err => console.error(`Erreur lors du déplacement de ${member.user.tag} :`, err));
        }
      });

      await Promise.all(promises);

      const embed = new EmbedBuilder()
        .setTitle('\`🛫\` ▸ Voicemoove')
        .setColor('#313338')
        .setDescription(`\`✔️\`・Tous les membres ont été déplacés vers ${targetChannel}.`);

      interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("Erreur lors du déplacement des membres :", error);

      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Une erreur est survenue lors du déplacement des membres.");
      interaction.editReply({ embeds: [embed] });
    }
  },

  data: new SlashCommandBuilder()
    .setName('voicemoove')
    .setDescription("Déplace tous les membres de ton salon vocal vers un autre.")
    .addChannelOption(option =>
      option.setName('destination')
        .setDescription('Salon vocal de destination')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
    )
};
