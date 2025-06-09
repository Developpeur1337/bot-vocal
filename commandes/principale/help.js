const { SlashCommandBuilder, EmbedBuilder, chatInputApplicationCommandMention } = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche la page d'aide du bot",
    wlOnly: true,
    async executeSlash(client, interaction) {
        const commande = await client.application.commands.fetch();

        const set = [
            { name: "find", desc: "Trouver un utilisateur en vocal" },
            { name: "join", desc: "Rejoindre un salon vocal ou un utilisateur" },
            { name: "vc", desc: "Afficher les statistiques vocales du serveur" },
            { name: "wakeup", desc: "Réveille une personne endormie" },
            { name: "move", desc: "Déplace un utilisateur dans votre salon vocal" },
            { name: "voicemoove", desc: "Déplacer tous les membres d'un salon vers un autre" },
        ];

        const help = set
            .map(cmd => {
                const command = commande.find(c => c.name === cmd.name);
                return command
                    ? `* ${chatInputApplicationCommandMention(cmd.name, command.id)} \`-\` ${cmd.desc}`
                    : `* \`/${cmd.name}\` \`-\` ${cmd.desc} *(non trouvée)*`;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setDescription([
                "**__Page d'aide__**",
                "",
                "<a:Fleche:1289675112559280140> **Commande slash :**",
                help
            ].join("\n"))
            .setImage("https://cdn.discordapp.com/attachments/1051238708734611506/1051238771045187665/barre.jpg");

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la page d'aide du bot")
};
