import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import greeting from './greeting.js';
import getRoles from './roles.js'
dotenv.config();

const commands = [
    {
        name: 'greeting',
        description: 'greets you',
    },
    {
        name: 'roles',
        description: 'roles',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.token);

import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.id, process.env.serverid),
            { body: commands }
        )

        console.log('Done.');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'greeting') {
        await greeting(interaction);
    }

    if (interaction.commandName === 'roles') {
        await getRoles(interaction);
    }
})

client.login(process.env.token);
