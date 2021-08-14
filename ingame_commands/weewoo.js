const chalk = require("chalk");
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'weewoo',
    description : 'Initiate Weewoo',
    execute(message, client, player, args, options, db){
        
        if (Object.keys(options.players.whitelist).includes(player) || Object.keys(options.players.faction).includes(player)){

            const chat = args.substring(1);
            let channel = client.channels.cache.get(options.discord_options.weewoo_channel);

            embed.setTitle(`🆘  WEEWOO 📢 `)
            .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
            .setDescription(`**${player}** called weewoo! JOIN NOW!\n
            **Ip:** \`${options.minecraft_options.ip}\`\n
                Message from **${player}:**  \`\`\`diff\n- ${chat}\`\`\``)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');

            if(channel){
                channel.send("@everyone 🆘  WEEWOO 📢!!!")
                channel.send(embed);
            }else{
                options.minecraft_options.bot.chat(`A weewoo_channel hasn't been set!`)
                console.log(chalk.red.bold(`[Glowstone] **${player}** called weewoo! You haven't set a weewoo_channel!!`));
            }

        }
    
    }
}