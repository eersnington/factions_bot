const chalk = require("chalk");
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'checked',
    description : 'Notifies the bot when you check a side',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        
        if (Object.keys(options.players.whitelist).includes(player) || Object.keys(options.players.faction).includes(player)){
            let buffer_chat = client.channels.cache.get(options.discord_options.buffer_channel);
            if(!buffer_chat){
                options.minecraft_options.bot.chat('buffer_channel not set!')
                return console.log(chalk.red.bold(`[Glowstone] ${player} checked walls/buffers! You haven't set a buffer_channel!!`));
            }

            embed.setFooter(`Glowstone Bot | ${message.guild.name}`);

            if (chat.length < 1){
                return options.minecraft_options.bot.chat("Please specify a direction <N/S/E/W>")
            }
            let amount_checked = options.checks.members[player];

            if (!amount_checked){
                options.checks.members[player] = 1
            }else{
                options.checks.members[player]++;
            }
            options.checks.buffer_check_count++;

            db.ref(options.config.glowstone_token).child("checks").get().then((snapshot) => {
                if (snapshot.exists()) {
                    let json = options.checks.members
                    db.ref().child(options.config.glowstone_token).child('checks').update(json).then(()=>{
                        embed.setTitle(`BUFFER CHECKED`)
                        .setDescription(`${player} just completed a wall/buffer check\n**Total Checks:** ${options.checks.members[player]}\n**Direction:** ${chat}`)
                        .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
                        .setImage("https://mc-heads.net/avatar/" + player + "/100/nohelm.png")
                        .setColor(options.color)
                        buffer_chat.send(embed)
                        options.minecraft_options.bot.chat(`Your contribution has beed noted ${player}`)
                    })
                } else {
                    console.log(chalk.red.bold("[Glowstone] Please initialize database"))
                }
            }).catch((error) => console.error(error));
            
        }
    
    }
}