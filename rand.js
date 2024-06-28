function randNum() {
    return Math.floor(Math.random() * 10);
}

export default function rand() {
    interaction.reply(`${randNum()}`);
}
