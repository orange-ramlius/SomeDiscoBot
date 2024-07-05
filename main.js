import { REST, Routes, Client, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
import testmenu from './menu.js';
import { clear, ban, unban, kick } from './administrative.js';
import { roles, changeRoles } from './roles.js'

dotenv.config();

const commands = [
    new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Получение ролей по кнопке')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    new SlashCommandBuilder()
        .setName('lottery')
        .setDescription('Розыгрыш призов')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    new SlashCommandBuilder()
        .setName('changeroles')
        .setDescription('Перезапись ролей в файле')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Заполнение заявки в стафф')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Удаление сообщений')
        .addIntegerOption(option => option.setName('amount').setDescription('Количество сообщений для удаления').setMinValue(1).setMaxValue(100).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Бан участника')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName('user').setDescription('Пользователь, который будет забанен').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Причина бана').setRequired(true)),

    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Разбан участника')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option.setName('userid').setDescription('Айди пользователя, который будет разбанен').setRequired(true)),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Кик участника')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => option.setName('user').setDescription('Пользователь, который будет кикнут').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Причина кика').setRequired(true)), 
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
        await testmenu(interaction, client);
    }

    if (interaction.commandName === 'clear') {
        await clear(interaction);
    }

    if (interaction.commandName === 'ban') {
        await ban(interaction);
    }

    if (interaction.commandName === 'unban') {
        await unban(interaction);
    }

    if (interaction.commandName === 'kick') {
        await kick(interaction);
    }
})

client.login(process.env.TOKEN);
