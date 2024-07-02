import { EmbedBuilder } from 'discord.js'; // сюда еще мб административных ролей засунуть, чтоб все они были в одном файле 

export default async function clear(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Удалено ${amount} сообщений`)

        await interaction.channel.bulkDelete(amount);
        await interaction.reply({ embeds: [embed] });
    }
    catch (e) {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Ошибка удаления сообщений`)
            
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}