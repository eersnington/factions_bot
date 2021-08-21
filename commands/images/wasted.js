const Discord = require("discord.js");
const AME_API = "0f848807afe74eadea1921e0d046a359066a9da5831bed7bc07231a8dfb10b8e1a6c6271efba77aa42f9e953194394d07b4db63dc99f82d2f15621032f6e3b4a";
const AmeClient = require('amethyste-api');
const AmeAPI = new AmeClient(AME_API);

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'rip',
    description : 'Picture',
    async execute(client, message, args, db, fetch_data, options){

        let User = message.mentions.members.first()
        if (!User) return message.reply('Please mention a user');
        let m = await message.channel.send("**Please Wait...**");
        let buffer = await AmeAPI.generate("rip", {
        url: User.user.displayAvatarURL({
            format: "png",
            size: 2048,
        }),
        });
        let attachment = new Discord.MessageAttachment(buffer, "rip.png");
        m.delete({
        timeout: 5000, // i have the timeout here
        });
        
        embed.setTitle(`rip`)
        .setDescription(`**F to pay respects**`)
        .setColor(options.color)
        .setTimestamp()
        .attachFiles(attachment)
        .setImage('attachment://rip.png')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
        message.channel.send(embed)

    }
}