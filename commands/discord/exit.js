const Discord = require("discord.js");
const chalk = require('chalk');

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'exit',
    description : 'Exit the application',
    execute(client, message, args, db, fetch_data, options){
        if (!message.member.roles.cache.has(options.discord_options.developer_role)){
            embed.setTitle('🚫 Access Denied')
            .setDescription(`You do not have <@&${options.discord_options.developer_role}> Role`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
		    .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(embed)
        }
        embed.setTitle(`👋 Bot shutting down`)
        .setAuthor(message.author.tag)
        .setThumbnail(message.guild.iconURL())
        .setDescription(`Goodbye!`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
        console.log(chalk.green.bold(`[Glowstone] Bot shutting from ${message.author.tag} initiating the command`))
        message.channel.send(embed).then(() => {
            if (options.minecraft_options.bot != null){
                options.minecraft_options.bot.quit()
                options.minecraft_options.bot.end()
            }
            process.exit(0);
        })

    }
}