const Discord = require("discord.js");
const mc = require('minecraft-protocol');
const mineflayer = require('mineflayer')
const tpsPlugin = require('mineflayer-tps')(mineflayer)

module.exports = {
    name : 'status',
    description : 'Status of the bot and the server',
    execute(client, message, args, db, fetch_data, options){
        
        let botStatus = (options.minecraft_options.bot) ? "🟩": "🟥" 
        let botUsername = (options.minecraft_options.bot) ? options.minecraft_options.bot.username : "None"
        let botPing = (options.minecraft_options.bot) ? `${options.minecraft_options.bot.player.ping} ms` : "None"
        let botTps = (options.minecraft_options.bot) ? `${options.minecraft_options.bot.getTps()}/20` : "None"
        mc.ping({
            host: options.minecraft_options.ip,
            port: 25565
        }, (err, serv) =>
        {
            if (err) return '';
            const statusEmbed = new Discord.MessageEmbed()
            .setTitle(`📊 Status`)
            .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
            .setDescription('\u200B')
            .addFields(
                { name: 'Bot Status', value: `**Username: ** \`${botUsername}\`\n **Status:** ${botStatus}\n **Latency:** \`${botPing}\``,  },
                { name: 'Server Status', value: `**IP:** \`${options.minecraft_options.ip}\`\n**Version:** \`${serv.version.name}\`\n **Online:** \`${serv.players.online}/${serv.players.max} players\`\n **Latency:** \`${serv.latency} ms\`\n **TPS:** \`${botTps}\`` },
            )
            .setColor(options.color)
            .setFooter('Glowstone Bot | Glowstone-Development');
            return message.channel.send(statusEmbed);
        });
        
    }
}