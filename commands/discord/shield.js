const Discord = require("discord.js");
const chalk = require("chalk");
const shieldEmbed = new Discord.MessageEmbed();

module.exports = {
    name : 'shield',
    description : 'Turn on/off shield alerts',
    execute(client, message, args, db, fetch_data, options){

      if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){

        if (options.minecraft_options.bot != null){
            const chat = args.join(" ")

            let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);
            if(!buffer_chat){
                shieldEmbed.setTitle('⁉️ Missing Channel')
                .setDescription(`Please set a buffer channel with \`${options.discord_options.prefix}set buffer_channel\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                message.channel.send(shieldEmbed);

                return console.log(chalk.red.bold(`[Glowstone] ${player} called buffer/wall alerts command! You haven't set a buffer_channel!!`));
            }

            buffer_logic(chat, options, buffer_chat, message)
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


function buffer_logic(status, options, buffer_chat, message) {

    console.log(status)

    if (status == "off"){
        shieldEmbed.setTitle(`Shield is now OFF`)
        .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setDescription('☢️ **You will now get regular wall/buffer check alerts**\n**Priority:** DO NOT FOLD ☠️')
        .setColor(options.color);
      
        options.minecraft_options.bot.chat(`!!! Wall/Buffer Check Alert !!! Check walls/buffers right now and do ${options.discord_options.prefix}checked N/S/E/W`)
        options.checks.buffer_interval = setInterval(()=>{
            if(options.minecraft_options.bot == null) {
                shieldEmbed.setTitle(`⚠️ Warning`)
                .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
                .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\`
                \n Wall/Buffer Alerts Cancelled`)
                .setColor(options.color);
                clearInterval(options.checks.buffer_interval);
                return buffer_chat.send(shieldEmbed); 
            }
            if (options.checks.buffer_check_count == 0){
                options.minecraft_options.bot.chat(`${options.checks.buffer_check_count} checks since the last ${options.discord_options.interval} minutes!! Do not slack!!`)
            } else if (options.checks.buffer_check_count == 1){
                options.minecraft_options.bot.chat(`There has only been ${options.checks.buffer_check_count} check since the last ${options.discord_options.interval} minutes!`)
            }else {
                options.minecraft_options.bot.chat(`There have been ${options.checks.buffer_check_count} checks since the last ${options.discord_options.interval} minutes!`)
            }
            options.checks.buffer_check_count = 0
            setTimeout(()=>options.minecraft_options.bot.chat(`!!! Wall/Buffer Check Alert !!! Check walls/buffers right now and do ${options.discord_options.prefix}checked N/S/E/W`), 2000);
            
        }, parseInt(options.discord_options.interval)*60000)
        buffer_chat.send(shieldEmbed);
    } else if (status == "on") {
        clearInterval(options.checks.buffer_interval)
        shieldEmbed.setTitle(`Shield is now ON`)
        .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setDescription(`🔕 **You will no longer get regular wall/buffer check alerts\n**Priority:** Grind 💪`)
        .setColor(options.color);
        buffer_chat.send(shieldEmbed);
        options.minecraft_options.bot.chat('Wall/Buffer Check Alerts are now Disabled')
    } else {
        shieldEmbed.setTitle(`🛡️ Shield Alerts`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(`Shield alerts reminds players in-game to buffer/wall check regularly and perform the \`${options.discord_options.prefix}checked\` command once they do so.\n
         It also tells you many checks have taken place every interval\n
         **Usage:**\`\`\`${options.discord_options.prefix}shield on\`\`\` \`\`\`${options.discord_options.prefix}shield off \`\`\``)
        .setColor(options.color);
        return message.channel.send(shieldEmbed);
    }
}