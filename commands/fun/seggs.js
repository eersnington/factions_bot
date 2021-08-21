const Discord = require("discord.js");

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'seggs',
    description : 'Seggs...',
    async execute(client, message, args, db, fetch_data, options){
        const member = message.mentions.members.first();
        if (!member) return message.reply('Mention a user! (or the user isn\'t in the guild)');

        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'sussy baka')
        if(!role) {
            try {
                let muterole = await message.guild.roles.create({
                    data : {
                        name : 'Sussy baka',
                        color: '#FF40EB'
                    }
                });
            } catch (error) {
                return console.log(error)
            }
        }

        role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'sussy baka')

        if (role) message.member.roles.add(role)

        let embed  = new Discord.MessageEmbed()
        embed.setColor(options.color)
        .setTitle(`Sussy Baka`)
        .setDescription(`<@${message.author.id}> and <@${member.id}>\n *committed sussy baka* **(⁄˘⁄ ⁄ ω⁄ ⁄ ˘⁄)** `)
        .setImage("https://c.tenor.com/tDplRm0HDyYAAAAM/sussy-among-us.gif")
        .setTimestamp()
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send(embed)
    }
}