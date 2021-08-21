const Discord = require("discord.js");
const mineflayer = require("mineflayer");
const chalk = require('chalk');

const botEmbed = new Discord.MessageEmbed();

module.exports = {
    name : 'disconnect',
    description : 'Disconnect the mineflayer bot to the server.',
    execute(client, message, args, db, fetch_data, options){
      const errEmbed = new Discord.MessageEmbed();
      if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){

        if (options.minecraft_options.bot != null){

          options.vanish.track = false
          botEmbed.setTitle(`✅ Disconnected`)
          .setAuthor(`${message.member.user.tag}`)
          .setThumbnail(message.guild.iconURL())
          .setDescription(`You have disconnected the bot \`${options.minecraft_options.bot.username}\` from \`${options.minecraft_options.ip}\`\n 
          To reconnect, simply issue the command \`${options.discord_options.prefix}join\``)
          .setColor(options.color)
          .setFooter('Glowstone Bot | Glowstone-Development');
          options.minecraft_options.bot.end()
          options.minecraft_options.bot = null;
          options.online = false;
          console.log(chalk.red(`[Glowstone] Minecraft bot has disconnected from ${options.minecraft_options.ip}!`));
          return message.channel.send(botEmbed);

        } else {

          botEmbed.setTitle(`⁉️ Error`)
          .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
          .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
          .setColor(options.color)
          .setFooter('Glowstone Bot | Glowstone-Development');
          return message.channel.send(botEmbed);
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