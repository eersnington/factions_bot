const Discord = require("discord.js");

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'marry',
    description : 'Marry a player',
    async execute(client, message, args, db, fetch_data, options){
        const member = message.mentions.members.first();
        if (!member) return message.reply('Mention a user! (or the user isn\'t in the guild)');
        if (member.id == message.author.id) return message.reply("You can't marry yourself :/")

        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'married')
        if(!role) {
            try {
                let muterole = await message.guild.roles.create({
                    data : {
                        name : 'Married',
                        color: '#FF40EB'
                    }
                });
            } catch (error) {
                return console.log(error)
            }
        }

        role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'married')

        if (role) {
            message.member.roles.add(role)
            member.roles.add(role)
        }

        let embed  = new Discord.MessageEmbed()
        embed.setColor(options.color)
        .setTitle(`🎊 Marriage 👯‍♂️`)
        .setDescription(`<@${message.author.id}> and <@${member.id}>\n have married\n\n*Note: Consent will be added in the next update, so for now L dance*`)
        .setImage("https://static.reuters.com/resources/r/?m=02&d=20190524&t=2&i=1390410346&r=LYNXNPEF4N0CH&w=640")
        .setTimestamp()
        .setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));

        message.channel.send(embed)
    }
}