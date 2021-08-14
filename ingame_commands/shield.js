const chalk = require("chalk");
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'shield',
    description : 'Turn on/off shield alerts',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        
        if (!Object.keys(options.players.whitelist).includes(player)){
            return
        }
        let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);
        if(!buffer_chat){
            options.minecraft_options.bot.chat('buffer_channel not set!')
            return console.log(chalk.red.bold(`[Glowstone] ${player} called buffer/wall alerts command! You haven't set a buffer_channel!!`));
        }
        embed.setFooter(`Glowstone Bot | ${message.guild.name}`);
        buffer_logic(chat, options, buffer_chat)
    }
}

function buffer_logic(status, options, buffer_chat) {

    if (status == "off"){
        embed.setTitle(`Shield is now OFF`)
        .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setDescription('☢️ **You will now get regular wall/buffer check alerts**\n**Priority:** DO NOT FOLD ☠️')
        .setColor(options.color);
      
        options.minecraft_options.bot.chat(`!!! Wall/Buffer Check Alert !!! Check walls/buffers right now and do ${options.discord_options.prefix}checked N/S/E/W`)
        options.checks.buffer_interval = setInterval(()=>{
            if(options.minecraft_options.bot == null) {
                embed.setTitle(`⚠️ Warning`)
                .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
                .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\`
                \n Wall/Buffer Alerts Cancelled`)
                .setColor(options.color);
                clearInterval(options.checks.buffer_interval);
                return buffer_chat.send(embed); 
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
        buffer_chat.send(embed);
    } else if (status == "on") {
        clearInterval(options.checks.buffer_interval)
        embed.setTitle(`Shield is now ON`)
        .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setDescription(`🔕 **You will no longer get regular wall/buffer check alerts\n**Priority:** Grind 💪`)
        .setColor(options.color);
        buffer_chat.send(embed);
        options.minecraft_options.bot.chat('Wall/Buffer Check Alerts are now Disabled')
    }
}