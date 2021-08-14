const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'link',
    description : 'Link discord account to minecraft',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        if (!Object.keys(options.temp_uuid).includes(chat)) return options.minecraft_options.bot.chat("Invalid Key!");

        const authority = chat.substring(0,2);
        
        if (authority == 'wl'){
            const url = `https://mc-heads.net/body/${player}/right`
            db.ref(options.config.glowstone_token).child('whitelist').child(player).set(options.temp_uuid[chat]).then(()=>{
                options.players.whitelist[player] = options.temp_uuid[chat];
                
                embed.setTitle(`✅ Successfully whitelisted!`)
                .setImage(url)
                .setThumbnail(client.users.cache.get(options.temp_uuid[chat]).displayAvatarURL())
                .setDescription(`**${client.users.cache.get(options.temp_uuid[chat]).tag}** has succesfully linked his/her account to the player **${player}**\n
                    If you wish to change the linked ign, simply restart the linking process with \`${options.discord_options.prefix}whitelistlink\``)
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');

                delete options.temp_uuid[chat];
                options.minecraft_options.bot.chat(`You are now whitelisted ${player}!`);
                
                return message.channel.send(embed);
              }).catch((error) => console.error(error));
            
        }else {
            const url = `https://mc-heads.net/body/${player}/right`
            db.ref(options.config.glowstone_token).child('members').child(player).set(options.temp_uuid[chat]).then(()=>{
                options.players.faction[player] = options.temp_uuid[chat];

                embed.setTitle(`✅ Successfully registered as a member!`)
                .setImage(url)
                .setThumbnail(client.users.cache.get(options.temp_uuid[chat]).displayAvatarURL())
                .setDescription(`**${client.users.cache.get(options.temp_uuid[chat]).tag}** has succesfully linked his/her account to the player **${player}**\n
                    If you wish to change the linked ign, simply restart the linking process with \`${options.discord_options.prefix}memberlink\``)
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');

                delete options.temp_uuid[chat];
                options.minecraft_options.bot.chat(`You are now registered as a member ${player}!`);
                
                return message.channel.send(embed);
              }).catch((error) => console.error(error));
        }
    }
}