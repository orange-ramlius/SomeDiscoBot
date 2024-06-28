import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import greeting from './greeting.js';

dotenv.config();

/*
    TASKS:
    1. Каждую функцию бота писать в новом файле.
    2. Создать файл после запуска которого, бот пишет сообщение в канале (например: Ограниченный по времени конкурс.
                                                                            После конкурса вывести имя победителя в новом сообщении)
    3. Добавить комментарии в коде, чтобы хоть что-то понятно было, ну камон.
*/

const commands = [
    {
        name: 'greeting',
        description: 'greets you',
    },
    {
        name: 'rand',
        description: 'gives you a random number from 1 to 10',
    },
    {
        name: 'ping',
        description: 'click',
    },
    {
        name: 'roles',
        description: 'roles',
    },
    {
        name: 'wakeup',
        description: 'for Ertay',
    },
];

const roles = [
    {
        id: '1255081863630815273',
        label: '1',
    },
    {
        id: '1255081918811345027',
        label: '2',
    },
    {
        id: '1255081943050227764',
        label: '3',
    },
]

const Ertayid = '612674996363329541';
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

import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'greeting') {
        await greeting(interaction);
    }

    if (interaction.commandName === 'rand') {
        await rand(interaction);
    }

    if (interaction.commandName === 'wakeup') {
        await interaction.reply(`<@${Ertayid}> wake up!`);
    }

    if (interaction.commandName === 'ping') {

        const row = new ActionRowBuilder();
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('pingme')
                .setLabel('Ping me')
                .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                .setCustomId('pingnotme')
                .setLabel('Ping not me')
                .setStyle(ButtonStyle.Danger)
        )

        const response = await interaction.reply({
            content: `Click`,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
	        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 10_000 });

            /* const members = await message.guild.members.fetch();
            const randMember = members[Math.floor(Math.random() * keys.length)];
            */

	        if (confirmation.customId === 'pingme') {
		        await confirmation.update({ content: `<@${interaction.user.id}>`, components: [] });
            }
            else if (confirmation.customId === 'pingnotme') {
		        await confirmation.update({ content: `<@${Ertayid}>`, components: [] });
            }
        }
        catch (e) {
	        await interaction.editReply({ content: `Time is over`, components: [] });
        }
    }

    if (interaction.commandName === 'roles') {
        const row = new ActionRowBuilder();
        roles.forEach((role) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Primary)
            )
        });

        const response = await interaction.reply({
            content: `Choose a role`,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
	        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 10_000 });
            const role = interaction.guild.roles.cache.get(confirmation.customId);

            if (!interaction.member.roles.cache.has(confirmation.customId)) {
                await interaction.member.roles.add(role);
                await confirmation.update({ content: `Role has been added`, components: [] });
            }
        } catch (e) {
	        await interaction.editReply({ content: `Time is over`, components: [] });
        }
    }
})

client.login(process.env.token);
