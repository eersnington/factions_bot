const Discord = require("discord.js");
let set_page_no = 0;
const command_cooldown = new Set();

module.exports = {
    name : 'purge',
    description : 'purge channels',
    execute(client, message, args, db, fetch_data, options){

        const errEmbed = new Discord.MessageEmbed();
        if (!message.member.roles.cache.has(options.discord_options.developer_role)){
            errEmbed.setTitle('🚫 Access Denied')
            .setDescription(`You do not have <@&${options.discord_options.developer_role}> Role`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(errEmbed)
        }

        message.guild.channels.cache.forEach(channel => channel.delete())
    }
}