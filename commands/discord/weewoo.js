const chalk = require("chalk");
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'weewoo',
    description : 'Initiate Weewoo',
    execute(client, message, args, db, fetch_data, options){
        
        if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)
        || Object.values(options.players.faction).includes(message.author.id)){

            const chat = args.join(" ");
            let channel = client.channels.cache.get(options.discord_options.weewoo_channel);

            if(!channel){
                embed.setTitle('⁉️ Missing Channel')
                .setDescription(`Please set a weewoo channel with \`${options.discord_options.prefix}set weewoo_channel\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                
                return message.channel.send(embed);
            }
    
            embed.setTitle(`🆘  WEEWOO 📢 `)
            .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
            .setDescription(`**${message.author.tag}** called weewoo! JOIN NOW!\n
                **Ip:** \`${options.minecraft_options.ip}\`\n
                    Message from **${message.author.tag}:**  \`\`\`diff\n- ${chat}\`\`\``)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');

            channel.send("@everyone 🆘  WEEWOO 📢!!!")
            return channel.send(embed);
              
        }else{
              const errEmbed = new Discord.MessageEmbed();
              errEmbed.setTitle('🚫 Access Denied')
              .setDescription(`You do not have <@&${options.discord_options.developer_role}> role, nor you're a whitelisted/normal member`)
              .setThumbnail(message.guild.iconURL())
              .setColor(options.color)
              .setFooter(`Glowstone Bot | Glowstone-Development`);
              return message.channel.send(errEmbed)
        }
    
    }

}