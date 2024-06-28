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

export default async function getRoles(interaction) {
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
