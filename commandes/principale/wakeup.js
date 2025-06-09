const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  name: 'wakeup',
  description: 'Déplace un membre X fois de manière aléatoire entre les salons vocaux, puis le remet dans son salon initial.',
  wlOnly: true,
  async executeSlash(client, interaction) {
    const member = interaction.options.getMember('membre');
    const moves = interaction.options.getInteger('nombre');

    if (!member || !member.voice?.channel) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription(member
          ? "Le membre spécifié n'est pas en vocal."
          : "Veuillez spécifier un membre valide.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Je n'ai pas la permission de déplacer des membres.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (moves <= 0 || moves > 20) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Veuillez spécifier un nombre valide de déplacements (entre `1` et `20`).");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const maison = member.voice.channel;
    const vocaux = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
    const possible = vocaux.filter(c => c.id !== maison.id);

    if (possible.size === 0) {
      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Il n'y a pas d'autres salons vocaux disponibles.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await interaction.deferReply();

      for (let i = 0; i < moves; i++) {
        const randomChannel = possible.random();
        await member.voice.setChannel(randomChannel);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      await member.voice.setChannel(maison);

      const embed = new EmbedBuilder()
        .setTitle('\`🚨\` ▸ Wake Up terminé')
        .setColor('#313338')
        .setDescription(`\`✔️\`・${member} (\`${member.id}\`) a été déplacé \`${moves}\` fois de manière aléatoire, et a été ramené dans son salon initial (${maison}).`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Erreur lors du déplacement :", error);

      const embed = new EmbedBuilder()
        .setColor('#313338')
        .setDescription("Une erreur est survenue lors des déplacements.");
      interaction.editReply({ embeds: [embed] });
    }
  },

  data: new SlashCommandBuilder()
    .setName('wakeup')
    .setDescription("Déplace un membre X fois entre des vocaux aléatoires puis le ramène.")
    .addUserOption(option =>
      option.setName('membre')
        .setDescription("Membre à déplacer")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('nombre')
        .setDescription("Nombre de déplacements (1 à 20)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(20))
};
