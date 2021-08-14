const Discord = require("discord.js");
const command_cooldown = new Set();

module.exports = {
    name : 'db',
    description : 'Database Command',
    execute(client, message, args, db, fetch_data, options){
            const dbEmbed = new Discord.MessageEmbed();
            if (!message.member.roles.cache.has(options.discord_options.developer_role)){
                dbEmbed.setTitle('🚫 Access Denied')
                .setDescription(`You do not have <@&${options.discord_options.developer_role}> Role`)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
		        .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send(dbEmbed)
            } 
            const chat = args.join(" ")
            if (args[0] == 'initialize'){
                if (command_cooldown.has("cooldown")){
                    const cooldown = new Discord.MessageEmbed()
                    .setTitle(`💾  Database cooldown: 3 seconds`)
                    .setDescription('There is a 3 second cooldown to prevent spam.')
                    .setColor(options.color)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter('Glowstone Bot | Glowstone-Development')
                    return message.channel.send(cooldown);
                }else{
                    command_cooldown.add("cooldown");
                    setTimeout(()=> command_cooldown.delete("cooldown"), 3000);
                }
                message.channel.send('Initializing');
                db.ref(options.config.glowstone_token).set({
                    'A)guildName' : message.guild.name,
                    'botInfo' : {"ip": "pvp.TheArchon.net", "version" : "1.8.9", "join_command" : "onyx"},
                    'discordInfo' : {"prefix": '*', "developer_role" : options.discord_options.developer_role,
                                "server_chat_channel" : "Channel not set", "weewoo_channel" : "Channel not set", "buffer_channel" : "Channel not set",
                                    "ftop_channel" : "Channel not set", "fptop_channel" : "Channel not set", "flist_channel" : "Channel not set", 
                                    "alerts_channel": "Channel not set", "logs_channel": "Channel not set", "whitelist_channel": "Channel not set", "interval": "5"},
                    'whitelist' : {"PlaceholderPlayer" : '270904126974590976'},
                    'macros' : {"Macros1" : {"content": "/ff DON'T SLACK CANE", "interval" : "1"}},
                    'checks': {'PlaceholderPlayer': 0},
                    'banks': {'PlaceholderPlayer': 0},
                    'members' : {"PlaceholderPlayer" : '270904126974590976'},
                    'playtime': {'PlaceholderPlayer': 0}
                }, function(error) {
                    if (error) {
                    message.channel.send('Error: ' + error)
                    } else {
                        fetch_data.mineflayer_data();
                        fetch_data.discord_data();
                        fetch_data.whitelist_data();
                        fetch_data.facmembers_data();
                        fetch_data.checks_data();
                        fetch_data.banks_data();
                        fetch_data.macros_data();
                        fetch_data.playtime_data();
                        dbEmbed.setTitle('✅ Data Initialized')
                        .setDescription(`A fresh database was generated for this discord server!\n Note: The prefix is now *`)
                        .setThumbnail(message.guild.iconURL())
                        .setColor(options.color)
                        .setFooter(`Glowstone Bot | Glowstone-Development`);
                        return message.channel.send(dbEmbed)
                    }
                    });
            } else if (args[0] == 'reset'){
                let parameter = args[1];

                if (command_cooldown.has("cooldown")){
                    const cooldown = new Discord.MessageEmbed()
                    .setTitle(`💾  Database cooldown: 3 seconds`)
                    .setDescription('There is a 3 second cooldown to prevent spam.')
                    .setColor(options.color)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter('Glowstone Bot | Glowstone-Development')
                    return message.channel.send(cooldown);
                }else{
                    command_cooldown.add("cooldown");
                    setTimeout(()=> command_cooldown.delete("cooldown"), 3000);
                }

                let available_options = {"checks": "checks", "deposits": "banks", "macros": "macros", "members": "members", "playtime": "playtime", "whitelist": "whitelist"}

                if (!Object.keys(available_options).includes(parameter)){
                    const error = new Discord.MessageEmbed()
                    .setTitle(`💾  Reset error`)
                    .setDescription(`⚠️ The option \`${parameter}\` is invalid`)
                    .setColor(options.color)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter('Glowstone Bot | Glowstone-Development')
                    return message.channel.send(error);
                }
                
                db.ref().child(options.config.glowstone_token).child(available_options[parameter]).get().then((snapshot) => {
                    if (snapshot.exists()) {
                        let newJson = {}
                        if(parameter == "checks"){
                            newJson["PlaceholderPlayer"] = 0
                        }else if (parameter == "deposits"){
                            newJson["PlaceholderPlayer"] = 0
                        }else if (parameter == "macros"){
                            newJson["Macros1"] = {"content": "/ff DON'T SLACK CANE", "interval" : "1"}
                        }else if (parameter == "members"){
                            newJson["PlaceholderPlayer"] ='270904126974590976'
                        }else if (parameter == "playtime"){
                            newJson["PlaceholderPlayer"] = 0
                        }else if (parameter == "whitelist"){
                            newJson["PlaceholderPlayer"] ='270904126974590976'
                        }

                        db.ref().child(options.config.glowstone_token).child(available_options[parameter]).set(newJson);

                        const completed = new Discord.MessageEmbed()
                        .setTitle(`💾  Reset successfull`)
                        .setDescription(`✅ You have successfully reset the option \`${parameter}\``)
                        .setColor(options.color)
                        .setThumbnail(message.guild.iconURL())
                        .setFooter('Glowstone Bot | Glowstone-Development')
                        return message.channel.send(completed);

                    } else {
                    message.channel.send("No minecraft bot data available")
                    }
                }).catch((error) => {
                if (error == "ReferenceError: message is not defined") return console.log(`Minecraft bot data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
                console.log(error)});
            }else{
                dbEmbed.setTitle('💾 Database')
                .setDescription(`**Database commands**`)
                .addFields(
                    {name: `initialize`, value: `Generate a new database for ${message.guild.name} server\n **Note: This will wipe out your entire data if you have already edited the settings in** \`${options.discord_options.prefix}set\`
                                         \`\`\`${options.discord_options.prefix}db initialize\`\`\``},
                    {name: `reset`, value: `Reset specific data like checks, deposits, or playtime for a new map\n
                    Available options: \`checks\`, \`deposits\`, \`macros\`, \`members\`, \`playtime\`, \`whitelist\`
                    \`\`\`${options.discord_options.prefix}db reset <option>\`\`\``},
                )
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
		        .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send(dbEmbed)
            }
           
    }
}