import { REST, Routes } from 'discord.js';
import fs from 'node:fs';

let data;
let s;
let id;
let token;

try {
  data = fs.readFileSync('secret.txt', 'utf8');
  s = data.split(':');
  id = s[0];
  token = s[1].trim();
} catch (err) {
  console.error(err);
}

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];
//token as string
const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('Started refreshing application (/) commands.');
//client id as string
  await rest.put(Routes.applicationCommands(id), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}

import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});
//token as string
client.login(token);
