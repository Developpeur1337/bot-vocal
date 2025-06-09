const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dbPath = path.join(__dirname, "../../db/db.json");

module.exports = {
    name: "viewdb",
    description: "Afficher le contenu brut de la base de données.",
    botOwnerOnly: true,
    async executeSlash(client, interaction) {
        let rawData;
        try {
            rawData = fs.readFileSync(dbPath, "utf8");
        } catch (err) {
            console.error("Erreur de lecture DB:", err);
            return interaction.reply({ content: "❌ Impossible de lire la base de données.", ephemeral: true });
        }

        if (rawData.length > 4000) {
            rawData = rawData.slice(0, 3997) + "...";
        }

        const embed = new EmbedBuilder()
            .setTitle("Contenu brut de la base de données")
            .setColor(0x0099FF)
            .setDescription("```json\n" + rawData + "\n```")
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
    }
};
