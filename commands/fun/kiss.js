const Discord = require("discord.js");

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'kiss',
    description : 'kiss someone',
    execute(client, message, args, db, fetch_data, options){
        
        const member = message.mentions.members.first();
        if (!member) return message.reply('Mention a user! (or the user isn\'t in the guild)');
        if (member.id == message.author.id) return message.reply(`that's kinda sad tryna to kiss yourself buddy`)

        let embed  = new Discord.MessageEmbed()
        embed.setColor(options.color)
        .setTitle(`💕 Kiss`)
        .setDescription(`<@${message.author.id}> has sent a kiss to <@${member.id}>`)
        .setImage('https://c.tenor.com/cfR6UVu0WCAAAAAM/wave-blow-kiss.gif')
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send(embed)
    }
}