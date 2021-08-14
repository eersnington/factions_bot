const Discord = require("discord.js");

const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'flist',
    description : 'Sends you f-ptop information',
    execute(client, message, args, db, fetch_data, options){
        if (options.minecraft_options.bot != null){
            const chat = args.join(" ")
            options.flist.data = []
            options.minecraft_options.bot.chat(`/f list ${chat}`)
            setTimeout(()=> {
                let flist_data = options.flist.data
                let reply = (flist_data.length >2) ? embed.setDescription(`\`\`\`yaml\n${flist_data.join('\n')}\`\`\``) : embed.setDescription(`There was an error in trying to retrieve the data.`)
                options.flist.data = []
                embed.setColor(options.color)
                .setTitle(`👥 F-List \`\`${options.minecraft_options.ip}\`\``)
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
    }
}