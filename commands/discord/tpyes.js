const Discord = require("discord.js");

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'tpyes',
    description : 'Accepts any pending tpa requests',
    execute(client, message, args, db, fetch_data, options){
        if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){

            if (options.minecraft_options.bot != null){
            
                options.minecraft_options.bot.chat(`/tpyes`)
                setTimeout(()=> {
                    let tpa = options.server_chat.data
                    let reply = (options.server_chat.toggle) ? embed.setDescription(`:white_check_mark: ${message.author.tag}\`\n\`\`\`yaml\n${tpa.join("\n")}\`\`\``) : embed.setDescription(`:white_check_mark: ${message.author.tag}`)
    
                    embed.setColor(options.color)
                    .setFooter(`Glowstone Bot | ${message.guild.name}`);
                    message.channel.send(embed);
                }, 500)
                
            } else {
                embed.setTitle(`⚠️ Warning`)
                .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
                .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');
                return message.channel.send(embed);
            }
          
        }else{
          errEmbed.setTitle('🚫 Access Denied')
            .setDescription(`You do not have <@&${options.discord_options.developer_role}> role, nor you're a whitelisted player`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(errEmbed)
        }
    }
}