const Discord = require("discord.js");
const uuid = require("uuid");

module.exports = {
    name : 'tokenclear',
    description : 'cleartokens of',
    execute(client, message, args, db, fetch_data, options){
        const tokenclearEmbed = new Discord.MessageEmbed();
        let id
        if (!message.member.roles.cache.has(options.discord_options.developer_role)){
            tokenclearEmbed.setTitle('🚫 Access Denied')
            .setDescription(`You do not have <@&${options.discord_options.developer_role}> Role`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(tokenclearEmbed)
        }
        try {
            id = (args[0].match(/(\d+)/))[0]
        } catch(err){
            tokenclearEmbed.setTitle(`⁉️ Invalid Argument`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`Tokenclear requires you to tag a user. \n**Command Usage:** \`${options.discord_options.prefix}tokenclear @user\``)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send(tokenclearEmbed)
        }
        
        for (let user in options.temp_uuid) {
            if (options.temp_uuid[user] == id){
                delete options.temp_uuid[user]
                tokenclearEmbed.setTitle('✅ Cleared Token')
                .setDescription(`You have successfully removed any existing token of <@${id}>`)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send(tokenclearEmbed);
            }
        }
        tokenclearEmbed.setTitle('👎 Couldn\'t Find Token')
        .setDescription(`Couldn't find any tokens for <@${id}>`)
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send(tokenclearEmbed);
    }
}