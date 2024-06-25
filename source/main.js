import { REST, Routes } from 'discord.js';
import fs from 'node:fs';

let data;
let s;
let id;
let token;
let serverId;

/*
    TASKS:
    1. Каждую функцию бота писать в новом файле.
    2. Вместо использования txt файла для получения token, id, serverId, использовать пакет dotenv
    3. Написать слэш команду для выдачи роли после нажатия кнопки.
    4. Создать файл после запуска которого, бот пишет сообщение в канале (например: Ограниченный по времени конкурс. 
                                                                            После конкурса вывести имя победителя в новом сообщении)
    5. Добавить комментарии в коде, чтобы хоть что-то понятно было, ну камон.
*/

try {
    data = fs.readFileSync('secret.txt', 'utf8');
    s = data.split('\n');
    id = s[0];
    serverId = s[1];
    token = s[2].trim();
} catch (err) {
    console.error(err);
}

const commands = [
    {
        name: 'greeting',
        description: 'greets you',
    },
    {
        name: 'rand',
        description: 'gives you a random number from 1 to 10',
    },
    /*
    {
        name: 'role',
        description: 'testing role giveaway',
    },
    */
];

const rest = new REST({ version: '10' }).setToken(token);

import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(id, serverId),
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

function randNum() {
    return Math.floor(Math.random() * 10);
}

import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

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

/*
        const button1 = new ButtonBuilder()
            .setCustomId('button1')
            .setLabel('button1')
            .setStyle(ButtonStyle.Primary);

        const button2 = new ButtonBuilder()
            .setCustomId('button2')
            .setLabel('button2')
            .setStyle(ButtonStyle.Primary);

        const button3 = new ButtonBuilder()
            .setCustomId('button3')
            .setLabel('button3')
            .setStyle(ButtonStyle.Primary);
*/

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'greeting') {
        await interaction.reply('huli nado');
    }
    if (interaction.commandName === 'rand') {
        await interaction.reply(`${randNum()}`);
    }
    /*
    if (interaction.commandName === 'role') {
        const row = new ActionRowBuilder();
        roles.forEach((role) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Primary)
            )
        });

        await interaction.reply({
            content: `choose the role`,
            components: [row],
        });

        if (!interaction.isButton()) return;
        await interaction.editReply('button is pressed');

        /*
        if (interaction.isButton()) {
            try {
                await interaction.deferReply({ ephermal: true });

                const role = interaction.guild.roles.cache.get(interaction.customId);
                //const role = interaction.options.getRole(role.id)

                if (!role) {
                    interaction.editReply({
                        content: "I couldn't find that role",
                    })
                    return;
                }

                const hasRole = interaction.member.roles.cache.has(role.id);

                if (hasRole) {
                    await interaction.member.roles.remove(role);
                    await interaction.editReply(`The role ${role} has been removed.`);
                    return;
                }

                await interaction.member.roles.add(role);
                await interaction.editReply(`The role ${role} has been added.`);
            } catch (error) {
                console.log(error);
            }
        }
    }
    */
});

//token as string
client.login(token);
