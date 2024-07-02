import { ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import fs from 'node:fs';

export async function roles(interaction, client) {

    const row = new ActionRowBuilder();
    const guild = client.guilds.cache.get(process.env.SERVER_ID);
    const roles = fs.readFileSync('roles.txt', 'utf8').split('\n');
    let loopRole;
    
    roles.forEach((role) => {
        try {
            loopRole = guild.roles.cache.find(role2 => role2.name === role.trim()).toString(); 
        }                                                                                      
        catch (e) { return; }

        row.addComponents(
            new ButtonBuilder()
                .setCustomId(loopRole.slice(3, loopRole.length - 1))
                .setLabel(role.trim())
                .setStyle(ButtonStyle.Secondary)
        )
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const response = await interaction.reply({
            content: `Выберите роль, которую хотите получить или удалить повторным нажатием`,
            components: [row],
        });  

        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });       
        const role = await interaction.guild.roles.cache.get(confirmation.customId);

        if (!interaction.member.roles.cache.has(confirmation.customId)) {
            await interaction.member.roles.add(role);
            await confirmation.update({ content: `Роль была добавлена`, components: [] });
        }
        else {
            await interaction.member.roles.remove(role);
            await confirmation.update({ content: `Роль была удалена`, components: [] });
        }

    } catch(e) { 
        await interaction.editReply({ content: `Время выбора вышло`, components: [] }); 
    }
}

export async function changeRoles(interaction) {
    const modal = new ModalBuilder()
		.setCustomId('Modal')
		.setTitle('Окно ввода ролей');

    const inputText = new TextInputBuilder()
		.setCustomId('Input')
		.setLabel("Введите названия ролей через enter")
		.setStyle(TextInputStyle.Paragraph);

    modal.addComponents(new ActionRowBuilder().addComponents(inputText));
    interaction.showModal(modal); 

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const sumbitted = await interaction.awaitModalSubmit({ filter: collectorFilter, time: 600_000 });

        if (sumbitted) {
            await sumbitted.reply('Роли успешно перезаписаны');
            const text = sumbitted.fields.getTextInputValue('Input');
            fs.writeFileSync('roles.txt', text);
        }
    } catch(e) {
        return;
    }
}
