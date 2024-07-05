import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

// Работает только в одном канале, если закинуть еще в один, то любой awaitMessage будет ломаться модальным окном

export default async function testmenu(interaction, client) {
    const select = new StringSelectMenuBuilder()
        .setCustomId('starter')
        .setPlaceholder('Выберите заявку для подачи')
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
    
    const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setTitle('Меню с заявками')
        .setDescription('Все ваши заявки поступят администрации / рассматривающим где они примут решение по поводу принятия или отклонения вашей просьбы.')
    
    const row = new ActionRowBuilder().addComponents(select);
    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const collector = await interaction.channel.createMessageComponentCollector({ filter: collectorFilter });
        
        collector.on('collect', async i => {
            const modal = new ModalBuilder()
		        .setCustomId('Modal')
		        .setTitle('Анкета');

            const inputText1 = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('Input1').setLabel("Как тебя зовут, сколько тебе лет?").setStyle(TextInputStyle.Short));
            const inputText2 = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('Input2').setLabel("Есть ли пк, оцени качество своего микрофона").setStyle(TextInputStyle.Short));
            const inputText3 = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('Input3').setLabel("Оцени знания правил Discord от 1 до 10").setStyle(TextInputStyle.Short));
            const inputText4 = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('Input4').setLabel("Сколько времени сможешь уделять серверу?").setStyle(TextInputStyle.Short));
            const inputText5 = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('Input5').setLabel("Расскажи немного о себе").setStyle(TextInputStyle.Short));

            const inputTexts = [inputText1, inputText2, inputText3, inputText4, inputText5];
            modal.addComponents(inputTexts);
            await i.showModal(modal);

            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                const sumbitted = await i.awaitModalSubmit({ filter: collectorFilter, time: 600_000 });
                let generalText = `Заявка от ${interaction.guild.members.cache.get(interaction.user.id)}\n\n`;
                
                try {
                    inputTexts.forEach (text => {
                        generalText += text.components[0].data.label + '\n' + sumbitted.fields.getTextInputValue(text.components[0].data.custom_id) + '\n\n'; 
                    });
                }
                catch (e) {
                    console.log('Ошибка в цикле, мб че-то не так с массивом');
                }

                if (sumbitted) {
                    const embed = new EmbedBuilder()
                        .setColor(0x000000)
                        .setDescription(generalText)

                    await client.channels.cache.get(process.env.CHANNEL_ID).send({ embeds: [embed] });

                    await sumbitted.update({
                        components: [row],
                    });
                }
            } catch(e) {
                console.log('Вероятно, вышло время выбора в menu.js');
            }
        })
    }
    catch(e) {
        console.log('Первый трай в menu.js, если он отлетит, то, определенно, нужно будет много че перепроверить');
    }
}