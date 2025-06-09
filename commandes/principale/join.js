const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: "join",
  description: "Déplace l'utilisateur dans un salon vocal.",
  wlOnly: true,
  async executeSlash(client, interaction) {
    const member = interaction.member;
    const target = interaction.options.getUser("utilisateur");
    const channel = interaction.options.getChannel("salon");

    if (!member.voice.channel) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Vous devez être dans un salon vocal pour utiliser cette commande.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Je n'ai pas la permission de déplacer des membres.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    let voiceChannel = null;
    let targetUser = null;

    if (target) {
      const fetchedMember = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (fetchedMember?.voice?.channel) {
        voiceChannel = fetchedMember.voice.channel;
        targetUser = fetchedMember;
      } else {
        const embed = new EmbedBuilder()
          .setColor('#313338')
          .setDescription(`${target} (\`${target.id}\`) n'est pas en vocal.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (channel && channel.type === ChannelType.GuildVoice) {
      voiceChannel = channel;
    } else {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("L'ID fourni n'est ni un salon vocal valide, ni un membre en vocal.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await member.voice.setChannel(voiceChannel);

      const embed = new EmbedBuilder()
        .setTitle('\`💎\` ▸ Déplacement vocal')
        .setColor('#313338')
        .setDescription(targetUser
          ? `\`✔️\`・Vous avez rejoint le vocal de ${targetUser} (\`${targetUser.id}\`).`
          : `\`✔️\`・Vous avez bien été déplacé dans ${voiceChannel}.`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erreur lors du déplacement :", error);

      const embed = new EmbedBuilder()
        .setTitle('❌ Erreur')
        .setColor('#313338')
        .setDescription("Une erreur est survenue lors de votre déplacement.");

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },

  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Déplace l'utilisateur dans un salon vocal.")
    .addUserOption(option =>
      option.setName("utilisateur")
        .setDescription("Membre dont vous voulez rejoindre le vocal.")
        .setRequired(false))
    .addChannelOption(option =>
      option.setName("salon")
        .setDescription("Salon vocal dans lequel se déplacer.")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(false))
};
