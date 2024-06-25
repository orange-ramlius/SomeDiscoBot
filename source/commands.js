import { REST, Routes } from 'discord.js';

let data;
let s;
let id;
let token;
let serverId;

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
];

const rest = new REST({ version: '10' }).setToken(token);

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