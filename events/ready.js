const commands = [];
const fs = require('node:fs');
const path = require('node:path');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

function readFilesRecursively(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(readFilesRecursively(fullPath));
        } else if (entry.isFile() && fullPath.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await client.guilds.fetch();
        console.clear();
        console.log(`
                                                ██╗   ██╗ ██████╗  ██████╗ █████╗ ██╗         ██████╗  ██████╗ ████████╗
                                                ██║   ██║██╔═══██╗██╔════╝██╔══██╗██║         ██╔══██╗██╔═══██╗╚══██╔══╝
                                                ██║   ██║██║   ██║██║     ███████║██║         ██████╔╝██║   ██║   ██║   
                                                ╚██╗ ██╔╝██║   ██║██║     ██╔══██║██║         ██╔══██╗██║   ██║   ██║   
                                                 ╚████╔╝ ╚██████╔╝╚██████╗██║  ██║███████╗    ██████╔╝╚██████╔╝   ██║   
                                                  ╚═══╝   ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝    ╚═════╝  ╚═════╝    ╚═╝   
        `.magenta);

        console.log('                               ══════════════════════════════════════════════════════════════════════════════════════'.magenta);
        console.log(`                                                         Bot: ${client.user.username}#${client.user.discriminator}`.magenta);
        console.log(`                                                         ID: ${client.user.id}`.magenta);
        console.log(`                                                         Serveurs: ${client.guilds.cache.size}`.magenta);
        console.log('                               ══════════════════════════════════════════════════════════════════════════════════════'.magenta);

        const commandFiles = readFilesRecursively('./commandes');

        for (const file of commandFiles) {
            const command = require(path.resolve(file));
            if (command.data) commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(client.config.token);

        rest.put(
            Routes.applicationCommands(client.user.id), { body: commands }
        )
        .then((data) => console.log(`[SLASH] ${data.length} slashs enregistrés.`))
        .catch(console.error);
    }
}
