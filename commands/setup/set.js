const Discord = require("discord.js");
let set_page_no = 0;
const command_cooldown = new Set();

module.exports = {
    name : 'set',
    description : 'Set Bot settings and channel settings',
    execute(client, message, args, db, fetch_data, options){
        set_page_no = 0;
        db.ref(options.config.glowstone_token).child('botInfo')
        let prefix = options.discord_options.prefix;
        let minecraft_options = Object.keys(options.minecraft_options);
        let discord_options = Object.keys(options.discord_options);

        const errEmbed = new Discord.MessageEmbed();
        if (!message.member.roles.cache.has(options.discord_options.developer_role)){
            errEmbed.setTitle('🚫 Access Denied')
            .setDescription(`You do not have <@&${options.discord_options.developer_role}> Role`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(errEmbed)
        }

        if (args[0] != null){
            
            const successEmbed = new Discord.MessageEmbed()
            if (minecraft_options.includes(args[0])){
                if (args[1] == null){
                    errEmbed.setTitle(`⁉️ Invalid Argument`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`Option \`${args[0]}\` **requires an ip address, version no. or a joincommand.**\n If you're unsure, please do \`${options.discord_options.prefix}set\` for an example.`)
                    .setColor(options.color)
                    .setFooter('Glowstone Bot | Glowstone-Development');
                    return message.channel.send(errEmbed)
                }
                if (command_cooldown.has("cooldown")){
                    const cooldown = new Discord.MessageEmbed()
                    .setTitle(`Set cooldown: 3 seconds`)
                    .setDescription('There is a 3 second cooldown to prevent spam.')
                    .setColor(options.color)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter('Glowstone Bot | Glowstone-Development')
                    return message.channel.send(cooldown);
                }else{
                    command_cooldown.add("cooldown");
                    setTimeout(()=> command_cooldown.delete("cooldown"), 3000)
                }
                let opt = args[0];
                let value
                if (opt == 'join_command'){
                    args.shift()
                    value = args.join(" ")
                }else{
                    value = args[1];
                }
                
                db.ref(options.config.glowstone_token).child('botInfo').child(opt).set(value).then(()=>{
                    fetch_data.mineflayer_data();
                    successEmbed.setTitle(`✅ Option set`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`You have successfully set **${opt}** in Minecraft Options`)
                    .setColor(options.color)
                    .setFooter('Glowstone Bot | Glowstone-Development');
                    setTimeout(()=> client.user.setActivity(
                        `${options.minecraft_options.ip} Servers Chat | For Help Do  ${options.discord_options.prefix}help `, {
                            type: "WATCHING"
                        }),1000 )
                    
                    return message.channel.send(successEmbed);
                  }).catch((error) => console.error(error));
                
            }else if (discord_options.includes(args[0])){
                if (args[1] == null){
                    errEmbed.setTitle(`⁉️ Invalid Argument`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`Option \`${args[0]}\` **requires a role, channel or prefix.**\n If you're unsure, please do \`${options.discord_options.prefix}set\` for an example.`)
                    .setColor(options.color)
                    .setFooter('Glowstone Bot | Glowstone-Development');
                    return message.channel.send(errEmbed)
                }
                if (command_cooldown.has("cooldown")){
                    const cooldown = new Discord.MessageEmbed()
                    .setTitle(`Set cooldown: 3 seconds`)
                    .setDescription('There is a 3 second cooldown to prevent spam.')
                    .setColor(options.color)
                    .setThumbnail(message.guild.iconURL())
                    .setFooter('Glowstone Bot | Glowstone-Development')
                    return message.channel.send(cooldown);
                }else{
                    command_cooldown.add("cooldown");
                    setTimeout(()=> command_cooldown.delete("cooldown"), 3000)
                }
                let opt = args[0];
                let value;
                if (opt != 'prefix'){
                    value = (args[1].match(/(\d+)/))[0];
                }else{
                    value = args[1];
                    if (options.minecraft_options.bot !=null){
                        options.minecraft_options.bot.removeChatPattern("facChat1")
                        let chatRegex = new RegExp(`^(\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-|@)(\\w+): \\${value}(\\w+)(.*)`);
                        let mapleCraftRegex = new RegExp(`^FACTION: (\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-)(\\w+): \\${value}(\\w+)(.*)`);
                        options.minecraft_options.bot.addChatPattern("facChat1", chatRegex , { parse: true});
                        options.minecraft_options.bot.addChatPattern("facChat1", mapleCraftRegex , { parse: true});
                    }
                }
                db.ref(options.config.glowstone_token).child('discordInfo').child(opt).set(value).then(()=>{
                    fetch_data.discord_data();
                    successEmbed.setTitle(`✅ Option set`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`You have successfully set **${opt}** in Discord Options`)
                    .setColor(options.color)
                    .setFooter('Glowstone Bot | Glowstone-Development');
                    setTimeout(()=> client.user.setActivity(
                        `${options.minecraft_options.ip} Servers Chat | For Help Do  ${options.discord_options.prefix}help `, {
                            type: "WATCHING"
                        }),1000 )
                    
                    return message.channel.send(successEmbed);
                  }).catch((error) => console.error(error));
                
            }else {
                errEmbed.setTitle(`⁉️ Invalid Option`)
                .setThumbnail(message.guild.iconURL())
                .setDescription(`${args[0]} is an Invalid Option. \nPlease make sure the option is listed in \`${options.discord_options.prefix}set\` pages`)
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');
                return message.channel.send(errEmbed)
            }
        } else {
            const setup1 = new Discord.MessageEmbed()
            .setTitle(`Setup`)
            .setDescription('**Note:** Please make sure to set every option in order to take full advantage of this bot.')
            .addFields(
                { name: 'Syntax:', value: `\`\`\`${prefix}set <option> <argument>\`\`\`` },
                { name: 'Example:', value: `\`\`\`${prefix}set version 1.8.9\`\`\`\n\`\`\`${prefix}set developer_role @dev\`\`\`\n\`\`\`${prefix}set ftop_channel #ftop\`\`\`` }
            )
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL());

            const setup2 = new Discord.MessageEmbed()
            .setTitle(`Minecraft Setup`)
            .setDescription('**Note:** Please make sure to set every option in order to take full advantage of this bot.')
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL());

            db.ref().child(options.config.glowstone_token).child('botInfo').get().then((snapshot) => {
                if (snapshot.exists()) {
                let snapshot_json = snapshot.toJSON()
                setup2.addFields(
                    { name: 'ip ', value:  `\`\`${snapshot_json["ip"]}\`\``},
                    { name: 'version ', value:  `\`\`${snapshot_json["version"]}\`\` *note: supports 1.8.x to 1.16*`},
                    { name: 'join_command ', value:  `\`\`${snapshot_json["join_command"]}\`\` *note: do not specify / in the begining*`}
                )
                } else {
                return console.log("You haven't initialized a database. Please do", `${options.discord_options.prefix}db initialize, in discord`)
                }
            }).catch((error) => {
            if (error == "ReferenceError: message is not defined") return console.log(`Minecraft bot data missing. Please Initialize with ${prefix}db initialize`)
            console.log(error)});

            const setup3 = new Discord.MessageEmbed()
            .setTitle(`Discord Setup`)
            .setDescription('**Note:** Please make sure to set every option in order to take full advantage of this bot.')
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL());

            db.ref().child(options.config.glowstone_token).child('discordInfo').get().then((snapshot) => {
                if (snapshot.exists()) {
                let snapshot_json = snapshot.toJSON()
                discord_options = Object.keys(snapshot_json);
                    setup3.addField('prefix ',`\`\`${snapshot_json["prefix"]}\`\``);
                    delete snapshot_json["prefix"];
                    
                    setup3.addField('interval ',  `\`\` ${snapshot_json["interval"]} \`\` *note: this is the interval for in-game check alerts, ftop, fptop, and flist in minutes*`);
                    delete snapshot_json["interval"];

                    if (/\d/.test(snapshot_json["developer_role"])){
                        setup3.addField('developer_role ',  `<@&${snapshot_json["developer_role"]}> *note: access for all discord bot commands*`);
                        delete snapshot_json["developer_role"];
                    } else {
                        setup3.addField('developer_role ',  `\`\`${snapshot_json["developer_role"]}\`\` *note: access for discord bot commands*`);
                        delete snapshot_json["developer_role"];
                    }

                    for (let option in snapshot_json){
                        if (/\d/.test(snapshot_json[option])){
                            setup3.addField(`${option}`, `<#${snapshot_json[option]}>`)
                        }else{
                            setup3.addField(`${option}`, `\`${snapshot_json[option]}\``)
                        }
                    }
                } else {
                    return console.log("You haven't initialized a database. Please do", `${options.discord_options.prefix}db initialize, in discord`);
                }
            }).catch((error) => {
            if (error == "ReferenceError: message is not defined") return console.log(`Minecraft bot data missing. Please Initialize with ${prefix}db initialize`);
            console.log(error)});

            let pages = {1: setup1, 2: setup2, 3:setup3};
            setup1.setFooter(`Page 1/${Object.keys(pages).length} | ${message.guild.name}`);
            setup2.setFooter(`Page 2/${Object.keys(pages).length} | ${message.guild.name}`);
            setup3.setFooter(`Page 3/${Object.keys(pages).length} | ${message.guild.name}`);

            message.channel.send(setup1).then(async embed => {
                await embed.react('⬅️');
                await embed.react('➡️');
        
                const filter = (reaction, user) => ['➡️', '⬅️'].includes(reaction.emoji.name) && (message.author.id === user.id);
                const collector = embed.createReactionCollector(filter);
        
                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name === '➡️'){
                        reaction.users.remove(user.id);
                        if (set_page_no < Object.keys(pages).length -1){
                            set_page_no++;
                            embed.edit(pages[set_page_no+1]);
                        }
                    } else if (reaction.emoji.name === '⬅️'){
                        reaction.users.remove(user.id);
                        if (set_page_no > 0){
                            set_page_no--;
                            embed.edit(pages[set_page_no+1]);
                        }
                    } 
                })
            });

        }
           
    }
}