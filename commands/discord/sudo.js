const Discord = require("discord.js");

const sudoEmbed = new Discord.MessageEmbed();

module.exports = {
    name : 'sudo',
    description : 'Get the bot say what you want',
    execute(client, message, args, db, fetch_data, options){

      if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){

        if (options.minecraft_options.bot != null){
            if (args.length == 0)return;
            const chat = args.join(" ")
            
            options.minecraft_options.bot.chat(chat)
            setTimeout(()=> {
                let server_chat = options.server_chat.data
                let reply = (options.server_chat.toggle) ? sudoEmbed.setDescription(`:white_check_mark: ${message.author.tag} sent \`${chat}\`\n\`\`\`${server_chat.join("\n")}\`\`\``) : sudoEmbed.setDescription(`:white_check_mark: ${message.author.tag} sent \`${chat}\``)

                sudoEmbed.setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');
                message.channel.send(sudoEmbed);
            }, 500)
            
        } else {
            const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`⚠️ Warning`)
            .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
            .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send(errorEmbed);
        }
          
      }else{
          const errEmbed = new Discord.MessageEmbed();
          errEmbed.setTitle('🚫 Access Denied')
          .setDescription(`You do not have <@&${options.discord_options.developer_role}> role, nor you're a whitelisted player`)
          .setThumbnail(message.guild.iconURL())
          .setColor(options.color)
          .setFooter(`Glowstone Bot | Glowstone-Development`);
          return message.channel.send(errEmbed)
      }
    }
}