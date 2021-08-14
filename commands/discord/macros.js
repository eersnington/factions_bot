const Discord = require("discord.js");
const chalk = require('chalk');

let disc_page_no = 0
let active_macros = {}

const errEmbed = new Discord.MessageEmbed();

module.exports = {
    name : 'macros',
    description : 'Timed messages',
    execute(client, message, args, db, fetch_data, options){
        disc_page_no = 0
        
        if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){
            if (args[0] == null){

                const macrosEmbed1 = new Discord.MessageEmbed();
                macrosEmbed1.setTitle("⏱️💬 Macros")
                .setDescription(`You can add a custom macros that will make the minecraft bot send a message in a specified interval(in minutes)\n\n
                **Syntax: **\`\`\`${options.discord_options.prefix}macros add <name>, <chat>, <interval>\`\`\`
                \`\`\`${options.discord_options.prefix}macros remove <name>\`\`\`
                **Example: **\`\`\`${options.discord_options.prefix}macros add Cane1, No cane no gain, 30\`\`\`
                \`\`\`${options.discord_options.prefix}macros add Macros1, /ff DON'T SLACK CANE, 1\`\`\`
                \`\`\`${options.discord_options.prefix}macros remove Cane1\`\`\``)
                macrosEmbed1.addField('\u200B', '*Note: The parameters in angular brackets <> are required*')
                .setColor(options.color)
                .setThumbnail(message.guild.iconURL())
                .setFooter(`Glowstone Bot | Glowstone Development`);

                const macrosEmbed2 = new Discord.MessageEmbed();
                macrosEmbed2.setTitle("⏱️💬 Macros")
                .setDescription(`List of active macros`)
                .setColor(options.color)
                .setThumbnail(message.guild.iconURL())
                .setFooter(`Glowstone Bot | Glowstone Development`);

                db.ref(options.config.glowstone_token).child('macros').get().then((snapshot) => {
                    if (snapshot.exists()) {
                        let snapshot_json = snapshot.toJSON()
                        let macros_id = Object.keys(snapshot_json);
    
                        macros_id.forEach( (macros) => {
                            macrosEmbed2.addField(`🔸 ${macros}`, `**Text: ** \`${snapshot_json[macros].content}\`\n**Time-period: ** \`${snapshot_json[macros].interval} mins\``)
                        });
                        macrosEmbed2.addField('\u200B', '*Note: The time period is in minutes*')
                    } else {
                        macrosEmbed2.addField('Database missing', 'You haven\'t initialzied a database')
                        return console.log("You haven't initialized a database. Please do", `${options.discord_options.prefix}db initialize, in discord`)
                    }
                }).catch((error) => {
                if (error == "ReferenceError: message is not defined") return console.log(`Macros data is missing. Please Initialize with ${prefix}db initialize`)
                console.log(error)});

                let pages = {1: macrosEmbed1, 2:macrosEmbed2};
                return message.channel.send(macrosEmbed1).then(async embed => {
                    await embed.react('⬅️');
                    await embed.react('➡️');
            
                    const filter = (reaction, user) => ['➡️', '⬅️'].includes(reaction.emoji.name) && (message.author.id === user.id);
                    const collector = embed.createReactionCollector(filter);
            
                    collector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '➡️'){
                            reaction.users.remove(user.id);
                            if (disc_page_no < Object.keys(pages).length -1){
                                disc_page_no++;
                                embed.edit(pages[disc_page_no+1]);
                            }
                        } else if (reaction.emoji.name === '⬅️'){
                            reaction.users.remove(user.id);
                            if (disc_page_no > 0){
                                disc_page_no--;
                                embed.edit(pages[disc_page_no+1]);
                            }
                        } 
                    })
                });;

            }else if(args[0] == "add"){
                args.shift();
                const parameters =  args.join(" ").split(",");

                if (parameters.length != 3){
                    errEmbed.setTitle('⁉️ Parameters missing')
                    .setDescription(`You have to specify all the parameters in angular brackets <> mentioned in \`${options.discord_options.prefix}macros\``)
                    .setThumbnail(message.guild.iconURL())
                    .setColor(options.color)
                    .setFooter(`Glowstone Bot | Glowstone-Development`);
                    return message.channel.send(errEmbed);
                }else{
                    const macro_name = parameters[0];
                    const macro_content = parameters[1].substring(1);
                    const macro_interval = parseInt(parameters[2].substring(1));
                    
                    if (isNaN(macro_interval)){
                        errEmbed.setTitle('⁉️ Invalid parameter')
                        .setDescription(`The interval should be a number. Please check the syntax for the command in \`${options.discord_options.prefix}macros\``)
                        .setThumbnail(message.guild.iconURL())
                        .setColor(options.color)
                        .setFooter(`Glowstone Bot | Glowstone-Development`);
                        return message.channel.send(errEmbed);
                    }

                    db.ref(options.config.glowstone_token).child('macros').get().then((snapshot) => {
                        if (snapshot.exists()) {
                            let snapshot_json = snapshot.toJSON()
                            snapshot_json[macro_name] = {"content": macro_content, "interval": macro_interval}
            
                            db.ref(options.config.glowstone_token).child("macros").update(snapshot_json).then(()=>{
                                fetch_data.macros_data();

                                const macrosEmbed = new Discord.MessageEmbed();
                                macrosEmbed.setTitle("⏱️💬 Macros")
                                .setDescription(`Added **${macro_name}** to the macros list\n Toggle the macros with \`${options.discord_options.prefix}macros toggle ${macro_name}\``)
                                .setColor(options.color)
                                .setThumbnail(message.guild.iconURL())
                                .setFooter(`Glowstone Bot | Glowstone Development`);
                                return message.channel.send(macrosEmbed);
                              })
                        } else {
                            return console.log("You haven't initialized a database. Please do", `${options.discord_options.prefix}db initialize, in discord`)
                        }
                    }).catch((error) => {
                    if (error == "ReferenceError: message is not defined") return console.log(`Macros data is missing. Please Initialize with ${prefix}db initialize`)
                    console.log(error)});

                }
            }else if (args[0] == "remove"){
                const macro_name = args[1];

                db.ref(options.config.glowstone_token).child('macros').get().then((snapshot) => {
                    if (snapshot.exists()) {
                        let snapshot_json = snapshot.toJSON()
                        let clearEmbed = new Discord.MessageEmbed();

                        let macroCleared = []

                        if (Object.keys(options.macros).length == 1){
                            clearEmbed.setTitle(`⏱️💬  Clear macro aborted`)
                            .setThumbnail(message.guild.iconURL())
                            .setDescription(`⚠️ Your request is denied because there should at least be 1 macro in the list`)
                            .setColor(options.color)
                            .setFooter('Glowstone Bot | Glowstone-Development');
                            return message.channel.send(clearEmbed);
                        }

                        Object.keys(snapshot_json).forEach(macro => {
                            if (macro == macro_name && Object.keys(options.macros).length > 1){
                                macroCleared.push(macro_name)
                                delete snapshot_json[macro]
                                delete options.macros[macro]

                            }
                        });

                        if (macroCleared.length >= 1){
                            db.ref().child(options.config.glowstone_token).child('macros').set(snapshot_json)
                        }else {
                            clearEmbed.setTitle(`⏱️💬  Invalid macro`)
                            .setThumbnail(message.guild.iconURL())
                            .setDescription(`⁉️ There is no macro with the name \`${macro_name}\``)
                            .setColor(options.color)
                            .setFooter('Glowstone Bot | Glowstone-Development');
                            return message.channel.send(clearEmbed);
                        }

                        clearEmbed.setTitle(`⏱️💬  Macro cleared`)
                        .setThumbnail(message.guild.iconURL())
                        .setDescription(`You have successfully cleared the macro \`${macroCleared}\``)
                        .setColor(options.color)
                        .setFooter('Glowstone Bot | Glowstone-Development');
                        return message.channel.send(clearEmbed);
    
                    } else {
                        return console.log(`[Glowstone] Error while  clearing macros. Please Initialize with ${options.discord_options.prefix}db initialize`)
                    }
                }).catch((error) => {
                if (error == "ReferenceError: message is not defined") return console.log(`[Glowstone] Error while  clearing macros. Please Initialize with ${options.discord_options.prefix}db initialize`)
                console.log(error)});


            }else if (args[0] == "toggle"){
                const macro_name = args[1];
                if (!Object.keys(options.macros).includes(macro_name)){
                    
                    errEmbed.setTitle('⁉️ Nonexistant Macro')
                        .setDescription(`The macro with the name ${macro_name} doesn't exist. Please check the list of macros \`${options.discord_options.prefix}macros\` page 2`)
                        .setThumbnail(message.guild.iconURL())
                        .setColor(options.color)
                        .setFooter(`Glowstone Bot | Glowstone-Development`);
                    return message.channel.send(errEmbed);
                }
                if (Object.keys(active_macros).includes(macro_name)){
                    clearInterval(active_macros[macro_name])
                    delete active_macros[macro_name]
                    const macrosEmbed = new Discord.MessageEmbed();
                    macrosEmbed.setTitle("⏱️💬 Macros")
                    .setDescription(`Toggled macro **${macro_name}** 🟥`)
                    .setColor(options.color)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter(`Glowstone Bot | Glowstone Development`);
                    return message.channel.send(macrosEmbed);
                }else{
                    const macrosEmbed = new Discord.MessageEmbed();
                    macrosEmbed.setTitle("⏱️💬 Macros")
                    .setDescription(`Toggled macro **${macro_name}** 🟩`)
                    .setColor(options.color)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter(`Glowstone Bot | Glowstone Development`);
                    message.channel.send(macrosEmbed);

                    active_macros[macro_name] = setInterval(()=> {
                        if (options.minecraft_options.bot != null){

                            options.minecraft_options.bot.chat(options.macros[macro_name].content)
                        } else {
                            let channel = client.channels.cache.get(options.discord_options.alerts_channel)

                            errEmbed.setTitle(`⚠️ Warning`)
                            .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
                            .setDescription(`Macro cancelled cause the bot is offline. To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
                            .setColor(options.color)
                            .setFooter('Glowstone Bot | Glowstone-Development');
                            if (!channel) return console.log(chalk.red.bold(`[Glowstone] Please set an alerts_channel! The macro ${macro_name} failed due to the bot being offline`));
                            return channel.send(errEmbed);
                        }
                    },options.macros[macro_name].interval*60000);
                }
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