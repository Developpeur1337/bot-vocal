const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "find",
  description: "Permet de chercher un membre en vocal.",
  wlOnly: true,
  async executeSlash(client, interaction) {
    const member = interaction.options.getMember("membre");

    if (!member) {
      return interaction.reply({ content: "Membre introuvable ou invalide.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('\`🔎\` ▸ Recherche vocal')
      .setColor('#313338')
      .setDescription(member.voice.channel
        ? `\`✔️\`・${member} (\`${member.id}\`) *est dans le vocal* \`${member.voice.channel.name}\` | <#${member.voice.channel.id}>`
        : `${member} (\`${member.id}\`) n'est pas en vocal.`
      );

    await interaction.reply({ embeds: [embed] });
  },

  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Permet de chercher un membre en vocal.")
    .addUserOption(option =>
      option.setName("membre")
        .setDescription("Le membre à rechercher.")
        .setRequired(true)
    )
};
