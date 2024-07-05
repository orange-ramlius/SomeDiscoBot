import { ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import fs from 'node:fs';

export async function roles(interaction) {

    const row = new ActionRowBuilder();
    const roles = fs.readFileSync('roles.txt', 'utf8').split('\n');
    let loopRole;
    
    roles.forEach((role) => {
        try {
            loopRole = interaction.guild.roles.cache.find(role2 => role2.name === role.trim()).toString();
        }                                                                                      
        catch (e) { console.log('че-то не так с loopRole в roles.js') }

        row.addComponents(
            new ButtonBuilder()
                .setCustomId(loopRole.slice(3, loopRole.length - 1))
                .setLabel(role.trim())
                .setStyle(ButtonStyle.Secondary)
        )
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Выберите роль, которую хотите получить или удалить повторным нажатием`)

        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
        });  

        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });   
        const role = await interaction.guild.roles.cache.get(confirmation.customId);

        if (!interaction.member.roles.cache.has(confirmation.customId)) {
            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription(`Роль была добавлена`)

            await interaction.member.roles.add(role);
            await confirmation.update({ embeds: [embed], components: [] });
        }
        else {
            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription(`Роль была удалена`)

            await interaction.member.roles.remove(role);
            await confirmation.update({ embeds: [embed], components: [] });
        }

    } catch(e) { 
        const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription(`Время выбора вышло`)

        await interaction.editReply({ embeds: [embed], components: [] }); 
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
    await interaction.showModal(modal); 

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const sumbitted = await interaction.awaitModalSubmit({ filter: collectorFilter, time: 600_000 });

        if (sumbitted) {
            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription('Роли успешно перезаписаны')

            await sumbitted.reply({ embeds: [embed] });
            const text = sumbitted.fields.getTextInputValue('Input');
            fs.writeFileSync('roles.txt', text);
        }
    } catch(e) {
        return;
    }
}
