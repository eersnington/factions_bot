const Discord = require("discord.js");

const clearEmbed = new Discord.MessageEmbed();

module.exports = {
    name : 'linkclear',
    description : 'Clear any minecraft links associated to a discord account',
    execute(client, message, args, db, fetch_data, options){
        if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){
            
            const discID = args.join(" ").match(/\d+/)[0]
            let whitelistCleared = []
            let memberCleared = []

            db.ref().child(options.config.glowstone_token).child('whitelist').get().then((snapshot) => {
                if (snapshot.exists()) {
                    let snapshot_json = snapshot.toJSON()
                    for (let user in snapshot_json){
                        if (snapshot_json[user] == discID){
                            whitelistCleared.push(user)
                            delete snapshot_json[user]
                            delete options.players.whitelist[user]
                        }
                    }

                    if (whitelistCleared.length >= 1) db.ref().child(options.config.glowstone_token).child('whitelist').set(snapshot_json);

                    db.ref().child(options.config.glowstone_token).child('members').get().then((snapshot) => {
                        if (snapshot.exists()) {
                            let snapshot_json = snapshot.toJSON()
            
                            for (let user in snapshot_json){
                                if (snapshot_json[user] == discID){
                                    memberCleared.push(user)
                                    delete snapshot_json[user]
                                    delete options.players.faction[user]
                                }
                            }

                            if (memberCleared.length >= 1) db.ref().child(options.config.glowstone_token).child('members').set(snapshot_json);

                            let cleared_whitelist_accounts = (whitelistCleared.length >= 1) ? whitelistCleared.join(", "): "None";
                            let cleared_member_accounts = (memberCleared.length >= 1) ? memberCleared.join(", "): "None";

                            clearEmbed.setTitle(`🔗  Link clear`)
                            .setThumbnail(client.users.cache.get(discID).displayAvatarURL())
                            .setDescription(`Here are the list of accounts associated with <@${discID}> that has been cleared\n **Whitelisted Accounts:** \`${cleared_whitelist_accounts}\`\n **Member Accounts:** \`${cleared_member_accounts}\``)
                            .setColor(options.color)
                            .setFooter('Glowstone Bot | Glowstone-Development');
                            return message.channel.send(clearEmbed);
        
                        } else {
                            return console.log(`[Glowstone] Linkclear error. Please Initialize with ${options.discord_options.prefix}db initialize`)
                        }
                    }).catch((error) => {
                    if (error == "ReferenceError: message is not defined") return console.log(`[Glowstone] Linkclear error. Please Initialize with ${options.discord_options.prefix}db initialize`)
                    console.log(error)});

                } else {
                    return console.log(`[Glowstone] Linkclear error. Please Initialize with ${options.discord_options.prefix}db initialize`)
                }
            }).catch((error) => {
            if (error == "ReferenceError: message is not defined") return console.log(`[Glowstone] Linkclear error. Please Initialize with ${options.discord_options.prefix}db initialize`)
            console.log(error)});
            
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