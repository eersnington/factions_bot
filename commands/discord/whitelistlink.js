const Discord = require("discord.js");
const uuid = require("uuid");

module.exports = {
    name : 'whitelistlink',
    description : 'Link your minecraft account to discord(whitelist)',
    execute(client, message, args, db, fetch_data, options){

        const whitelistEmbed = new Discord.MessageEmbed();
        if (message.guild.channels.cache.get(options.discord_options.whitelist_channel) === undefined){
            whitelistEmbed.setTitle('⁉️ Invalid Channel')
            .setDescription(`Please set a whitelist channel with \`${options.discord_options.prefix}set whitelist_channel\``)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(whitelistEmbed);
        }else if(message.channel.id !=options.discord_options.whitelist_channel){
            whitelistEmbed.setTitle('🚫 Access Denied')
            .setDescription(`You did not issue this command in <#${options.discord_options.whitelist_channel}>`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(whitelistEmbed);
        }  

        let tempUUID = "wl"+uuid.v4().substring(8,36);
        for (let user in options.temp_uuid) {
            if (options.temp_uuid[user] == message.author){
                whitelistEmbed.setTitle('⁉️ Temporary Token Exists')
                .setDescription(`There is already a token generated for <@${message.author.id}>\nCheck this Bot's DM, or get a <@&${options.discord_options.developer_role}> to do 
                \`${options.discord_options.prefix}tokenclear @user\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send(whitelistEmbed);
            }
          }
        options.temp_uuid[tempUUID] = message.author.id;
        
        whitelistEmbed.setTitle(`💬 Almost Whitelisted`)
        .setAuthor(message.member.user.tag)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`Final step: In-order to link the account <@${message.author.id}> to your minecraft account, issue the command sent in your DM's.`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
        message.channel.send(whitelistEmbed);
        whitelistEmbed.setTitle(`💬 Almost Whitelisted`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`Final step: Please issue the following command in-game\`\`\`${options.discord_options.prefix}link ${tempUUID}\`\`\`\nNote: **Do not share** this command to anyone else as it will
        link their minecraft account to your discord in ${message.guild.name}`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
        message.author.send(whitelistEmbed);
    }
}