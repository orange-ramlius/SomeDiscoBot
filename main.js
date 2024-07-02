import { REST, Routes, Client, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
import greeting from './greeting.js';
import testmenu from './menu.js';
import clear from './clear.js';
import {roles, changeRoles} from './roles.js'

dotenv.config();

const commands = [
    new SlashCommandBuilder()
        .setName('greeting')
        .setDescription('Приветствие'),

    new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Получение ролей по кнопке'),

    new SlashCommandBuilder()
        .setName('lottery')
        .setDescription('Розыгрыш призов'),

    new SlashCommandBuilder()
        .setName('changeroles')
        .setDescription('Перезапись ролей в файле'),

    new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Заполнение заявки в стафф'),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Удаление сообщений')
        .addIntegerOption(option => option.setName('amount').setDescription('Количество сообщений для удаления').setMinValue(1).setMaxValue(100).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
];

const rest = new REST().setToken(process.env.TOKEN);
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
        await changeRoles(interaction, client);
    }

    if (interaction.commandName === 'menu') {
        await testmenu(interaction);
    }

    if (interaction.commandName === 'clear') {
        await clear(interaction);
    }
})

client.login(process.env.TOKEN);
