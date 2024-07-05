import { EmbedBuilder } from 'discord.js'; 

export async function clear(interaction) {
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

export async function ban(interaction) { 
    const user = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    try {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Пользователь ${user} был забанен по причине: ${reason}`)

        await interaction.guild.members.ban(user);
        await interaction.reply({embeds: [embed] });
    }
    catch (e) {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Пользователь не был забанен`)

        await interaction.reply({ embeds: [embed], ephermal: true });
    }
}

export async function unban(interaction) {
    const userId = interaction.options.getString('userid');

    try {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Пользователь <@${userId}> был разбанен`)
        
        const banList = await interaction.guild.bans.fetch();
        if (banList.length == 0) return;
        
        let banned = await banList.get(userId).user
        if (!banned) return;

        await interaction.guild.members.unban(banned)
        await interaction.reply({embeds: [embed] });
    }
    catch (e) {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Пользователь не был разбанен`)

        await interaction.reply({ embeds: [embed], ephermal: true });
    }
}

export async function kick(interaction) { 
    const user = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    try {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Пользователь ${user} был кикнут по причине: ${reason}`)

        await interaction.guild.members.kick(user);
        await interaction.reply({embeds: [embed] });
    }
    catch (e) {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(`Пользователь не был кикнут`)

        await interaction.reply({ embeds: [embed], ephermal: true });
    }
}

