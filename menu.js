import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default async function testmenu(interaction) {
    const select = new StringSelectMenuBuilder()
        .setCustomId('starter')
        .setPlaceholder('Выбор роли')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Спикер')
                .setDescription('Много пиздит')
                .setValue('м'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Модератор')
                .setDescription('Много пиздит, но обычных людей')
                .setValue('мпа'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Администратор')
                .setDescription('Много пиздит, но людей на стаффе')
                .setValue('бпа')
        );

    const row = new ActionRowBuilder().addComponents(select);
    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        await interaction.reply({
            content: 'Выберите, на какую роль хотите подать заявку',
            components: [row],
        });

        const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter });
        
        collector.on('collect', async i => {
            const modal = new ModalBuilder()
		        .setCustomId('Modal')
		        .setTitle('Анкета');

            const inputText = new TextInputBuilder()
                .setCustomId('Input')
                .setLabel("Сколько вам лет?")
                .setStyle(TextInputStyle.Short);

            modal.addComponents(new ActionRowBuilder().addComponents(inputText));
            await i.showModal(modal);

            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                const sumbitted = await i.awaitModalSubmit({ filter: collectorFilter, time: 600_000 });

                if (sumbitted) {
                    // тут должна быть отправка полей из окошек в какой-то канал, позже надо добавить

                    await sumbitted.update({
                        components: [row],
                    });
                }
            } catch(e) {
                return;
            }
        })
    }
    catch(e) {
        return;
    }
}