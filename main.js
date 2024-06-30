import { REST, Routes, Client, GatewayIntentBits} from 'discord.js';
import dotenv from 'dotenv';
import greeting from './greeting.js';
import {roles, addRoles} from './roles.js'

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
    {
        name: 'lottery',
        description: 'raffle prizes',
    },
    {
        name: 'changeroles',
        description: 'rewriting roles in a file',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.BOT_ID, process.env.SERVER_ID),
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
        await roles(interaction, client);
    }

    if (interaction.commandName === 'lottery') {
        await lottery(interaction);
    }

    if (interaction.commandName === 'changeroles') {
        await addRoles(interaction, client);
    }
})

client.login(process.env.TOKEN);
