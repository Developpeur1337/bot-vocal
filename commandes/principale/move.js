const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'move',
  description: 'Déplace un membre dans votre salon vocal.',
  wlOnly: true,
  async executeSlash(client, interaction) {
    const member = interaction.options.getMember('membre');

    if (!interaction.member.voice.channel) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription('Vous devez être dans un salon vocal pour utiliser cette commande.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member || !member.voice.channel) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription('Le membre spécifié n\'est pas en vocal.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription('Je n\'ai pas la permission de déplacer des membres.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await member.voice.setChannel(interaction.member.voice.channel);

      const embed = new EmbedBuilder()
        .setTitle('`🔰` ▸ Déplacé avec succès')
        .setColor('#313338')
        .setDescription(`\`✔️\`・${member} (\`${member.id}\`) a été déplacé dans votre salon vocal (${interaction.member.voice.channel}).`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors du déplacement :', error);

      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription('Une erreur est survenue lors du déplacement du membre.');

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },

  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Déplace un membre dans votre salon vocal.')
    .addUserOption(option =>
      option
        .setName('membre')
        .setDescription('Le membre à déplacer')
        .setRequired(true)
    ),
};
