const Discord = require("discord.js");

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'vanish',
    description : 'Sends you a list of vanished staff members (might be patched)',
    execute(client, message, args, db, fetch_data, options){
        if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){

            if (options.minecraft_options.bot != null){
                let vanished = [];
                let count = 0;
                options.minecraft_options.bot.tabComplete(`/minecraft:tell `, (data, players) => {
                    for (eachPlayer of players) {
                        if (options.minecraft_options.bot.players[eachPlayer] == undefined) {
                            if (eachPlayer != "*" && eachPlayer != "**") {
                            vanished.push(`\`${String(eachPlayer)}\``);
                            count++;
                            }
                        }
                    }
                    if (vanished.length != 0) {
                    embed.setTitle(`Total: ${count} vanished staffs in \`\`${options.minecraft_options.ip}\`\``)
                    .setDescription(`${vanished.join(", ")}\n*Note: If you get a huge list of [object Object], that means the server has patched the exploit*`)
                    .setColor(options.color)
                    .setAuthor(`👀 Vanish`)
                    .setFooter('Glowstone Bot | Glowstone-Development');
                    message.channel.send(embed)
                    } else {
                    embed.setTitle(`Total: ${count} vanished staffs in \`\`${options.minecraft_options.ip}\`\``)
                    .setDescription("No vanished players\n*Note: If you get a huge list of [object Object], that means the server has patched the exploit. If you see 0 online, it might mean the server has patched it.*")
                    .setColor(options.color)
                    .setAuthor(`👀 Vanish`)
                    .setFooter('Glowstone Bot | Glowstone-Development');
                    message.channel.send(embed)
                    }
                });
                        
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