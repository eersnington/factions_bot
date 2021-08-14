const Discord = require("discord.js");

let ftop_interval;
let fptop_interval;
let flist_interval;

const cooldown = new Set();

module.exports = {
    name : 'toggle',
    description : 'Toggle various events',
    execute(client, message, args, db, fetch_data, options){
        if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){
        
            if (args[0] == null){
                const toggleEmbed = new Discord.MessageEmbed()
                .setTitle(`⏹️ Toggle Events`)
                .setDescription('Here are the events you can toggle')
                .addFields(
                    { name: 'server chat', value: `Usage: \`${options.discord_options.prefix}toggle chat\`\nDescription: *Toggle server chat*` },
                    { name: 'ftop', value: `Usage: \`${options.discord_options.prefix}toggle ftop\`\nDescription: *Toggle sending ftop info in an interval*` },
                    { name: 'fptop', value: `Usage: \`${options.discord_options.prefix}toggle fptop\`\nDescription: *Toggle sending fptop info in an interval*` },
                    { name: 'flist', value: `Usage: \`${options.discord_options.prefix}toggle flist\`\nDescription: *Toggle sending flist info in an interval*` },
                    { name: 'cegg', value: `Usage: \`${options.discord_options.prefix}toggle cegg\`\nDescription: *Toggle checking for cegg*` },
                    { name: 'tnt', value: `Usage: \`${options.discord_options.prefix}toggle tnt\`\nDescription: *Toggle checking for tnt shots*` },
                )
                .setColor(options.color)
                .setThumbnail(message.guild.iconURL())
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                return message.channel.send(toggleEmbed);
            }
            
            if (options.minecraft_options.bot == null){
                const warningEmbed = new Discord.MessageEmbed()
                .setTitle(`⚠️ Warning`)
                .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
                .setDescription(`There is no bot online in the server \`${options.minecraft_options.ip}\`\n To join the server, simply issue the command \`${options.discord_options.prefix}join\``)
                .setColor(options.color)
                .setFooter('Glowstone Bot | Glowstone-Development');
                return message.channel.send(warningEmbed);
            }
    
            if (args[0] == "chat"){
                
                chat_toggle(client, message, options)
    
            }else if (args[0] == "ftop"){
                
                ftop_toggle(client, message, options)
    
            }else if (args[0] == "fptop"){
                
                fptop_toggle(client, message, options)
    
            }else if (args[0] == "flist"){
                
                flist_toggle(client, message, options)
    
            }else if (args[0] == "cegg"){
                
                cegg_toggle(client, message, options)

            }else if (args[0] == "tnt"){
                
                tnt_toggle(client, message, options)

            }else {
                const toggleEmbed = new Discord.MessageEmbed()
                .setTitle(`⏹️ Toggle Events`)
                .setDescription('Here are the events you can toggle')
                .addFields(
                    { name: 'server chat', value: `Usage: \`${options.discord_options.prefix}toggle chat\`\nDescription: *Toggle server chat*` },
                    { name: 'ftop', value: `Usage: \`${options.discord_options.prefix}toggle ftop\`\nDescription: *Toggle sending ftop info in an interval*` },
                    { name: 'fptop', value: `Usage: \`${options.discord_options.prefix}toggle fptop\`\nDescription: *Toggle sending fptop info in an interval*` },
                    { name: 'flist', value: `Usage: \`${options.discord_options.prefix}toggle flist\`\nDescription: *Toggle sending flist info in an interval*` },
                    { name: 'cegg', value: `Usage: \`${options.discord_options.prefix}toggle cegg\`\nDescription: *Toggle checking for cegg*` },
                    { name: 'tnt', value: `Usage: \`${options.discord_options.prefix}toggle tnt\`\nDescription: *Toggle checking for tnt shots*` },
                )
                .setColor(options.color)
                .setThumbnail(message.guild.iconURL())
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                return message.channel.send(toggleEmbed);
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

function chat_toggle(client, message, options){

    let server_chat = client.channels.cache.get(options.discord_options.server_chat_channel);
    const chatEmbed = new Discord.MessageEmbed();

    if (!server_chat){
        chatEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an server-chat channel with \`${options.discord_options.prefix}set server_chat_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send(chatEmbed);
    }

    options.server_chat.toggle = !options.server_chat.toggle;
    
    let toggle_msg  = (options.server_chat.toggle) ? chatEmbed.setDescription("**Server chat enabled**") : chatEmbed.setDescription("**Server chat disabled**")
    chatEmbed.setTitle(`✅ Toggle Events`)
    .setColor(options.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    return message.channel.send(chatEmbed); 
}

function ftop_toggle(client, message, options){

    let ftop_chat = client.channels.cache.get(options.discord_options.ftop_channel);
    const ftopEmbed = new Discord.MessageEmbed();

    if (!ftop_chat){
        ftopEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an ftop channel with \`${options.discord_options.prefix}set ftop_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send(ftopEmbed);
    }

    options.ftop.toggle = !options.ftop.toggle

    let toggle_msg  = (options.ftop.toggle) ? ftopEmbed.setDescription("**Regular F-top updates enabled**") : ftopEmbed.setDescription("**Regular F-top updates disabled**")
    ftopEmbed.setTitle(`✅ Toggle Events`)
    .setColor(options.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send(ftopEmbed);

    if (options.ftop.toggle){
        ftop_interval = setInterval(() => {
            if(!options.online) {
                const error = new Discord.MessageEmbed()
                .setColor(options.color)
                .setTitle(":warning: Bot Error")
                .setDescription(`F-top updates cancelled \n**Factions Bot is offline**`);
                return ftop_chat.send(error); 
            }

            options.ftop.data = []
            options.minecraft_options.bot.chat(`/f top`)
            setTimeout(()=> {
                let ftop_data = options.ftop.data
                let reply = (ftop_data.length >2) ? ftopEmbed.setDescription(`\`\`\`fix\n${ftop_data.join('\n')}\`\`\``) : ftopEmbed.setDescription(`There was an error in trying to retrieve the data.`)
                options.ftop.data = []
                ftopEmbed.setColor(options.color)
                .setTitle(`🏆 F-top Value \`\`${options.minecraft_options.ip}\`\``)
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                ftop_chat.send(ftopEmbed);
            }, 500)
        }, parseInt(options.discord_options.interval)*60000)
    } else {
        clearInterval(ftop_interval)
    }

}

function fptop_toggle(client, message, options){

    let fptop_chat = client.channels.cache.get(options.discord_options.fptop_channel);
    const fptopEmbed = new Discord.MessageEmbed();

    if (!fptop_chat){
        fptopEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an fptop channel with \`${options.discord_options.prefix}set fptop_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send(fptopEmbed);
    }

    options.fptop.toggle = !options.fptop.toggle

    let toggle_msg  = (options.fptop.toggle) ? fptopEmbed.setDescription("**Regular F-ptop updates enabled**") : fptopEmbed.setDescription("**Regular F-ptop updates disabled**")
    fptopEmbed.setTitle(`✅ Toggle Events`)
    .setColor(options.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send(fptopEmbed); 

    if (options.fptop.toggle){
        fptop_interval = setInterval(() => {
            if(!options.online) {
                const error = new Discord.MessageEmbed()
                .setColor(options.color)
                .setTitle(":warning: Bot Error")
                .setDescription(`F-ptop updates cancelled \n**Factions Bot is offline**`);
                return fptop_chat.send(error); 
            }

            options.fptop.data = []
            options.minecraft_options.bot.chat(`/f ptop`)
            setTimeout(()=> {
                let fptop_data = options.fptop.data
                let reply = (fptop_data.length >2) ? fptopEmbed.setDescription(`\`\`\`fix\n${fptop_data.join('\n')}\`\`\``) : fptopEmbed.setDescription(`There was an error in trying to retrieve the data.`)
                options.fptop.data = []
                fptopEmbed.setColor(options.color)
                .setTitle(`🏆 F-ptop Value \`\`${options.minecraft_options.ip}\`\``)
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                fptop_chat.send(fptopEmbed);
            }, 500)
        }, parseInt(options.discord_options.interval)*60000)
    } else {
        clearInterval(fptop_interval)
    }
}

function flist_toggle(client, message, options){

    let flist_chat = client.channels.cache.get(options.discord_options.flist_channel);
    const flistEmbed = new Discord.MessageEmbed();

    if (!flist_chat){
        flistEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an flist channel with \`${options.discord_options.prefix}set flist_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send(flistEmbed);
    }

    options.flist.toggle =  !options.flist.toggle

    let toggle_msg  = (options.flist.toggle) ? flistEmbed.setDescription("**Regular F-list updates enabled**") : flistEmbed.setDescription("**Regular F-list updates disabled**")
    flistEmbed.setTitle(`✅ Toggle Events`)
    .setColor(options.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send(flistEmbed); 

    if (options.flist.toggle){
        flist_interval = setInterval(() => {
            if(!options.online) {
                const error = new Discord.MessageEmbed()
                .setColor(options.color)
                .setTitle(":warning: Bot Error")
                .setDescription(`F-list updates cancelled \n**Factions Bot is offline**`);
                return flist_chat.send(error); 
            }

            options.flist.data = []
            options.minecraft_options.bot.chat(`/f list`)
            setTimeout(()=> {
                let flist_data = options.flist.data
                let reply = (flist_data.length >2) ? flistEmbed.setDescription(`\`\`\`yaml\n${flist_data.join('\n')}\`\`\``) : flistEmbed.setDescription(`There was an error in trying to retrieve the data.`)
                options.flist.data = []
                flistEmbed.setColor(options.color)
                .setTitle(`👥 F-List \`\`${options.minecraft_options.ip}\`\``)
                .setFooter(`Glowstone Bot | ${message.guild.name}`);
                flist_chat.send(flistEmbed);
            }, 500)
        }, parseInt(options.discord_options.interval)*60000)
    } else {
        clearInterval(flist_interval)
    }
}

function cegg_toggle(client, message, options){

    let alerts_chat = client.channels.cache.get(options.discord_options.alerts_channel);
    const ceggEmbed = new Discord.MessageEmbed();

    if (!alerts_chat){
        ceggEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an alerts channel with \`${options.discord_options.prefix}set alerts_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send(ceggEmbed);
    }

    options.cegg_alert =  !options.cegg_alert

    let toggle_msg  = (options.cegg_alert) ? ceggEmbed.setDescription("**Cegg alert enabled**") : ceggEmbed.setDescription("**Cegg alert disabled**")
    ceggEmbed.setTitle(`✅ Toggle Events`)
    .setColor(options.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send(ceggEmbed); 

}

function tnt_toggle(client, message, options){

    let alerts_chat = client.channels.cache.get(options.discord_options.alerts_channel);
    const tntEmbed = new Discord.MessageEmbed();

    if (!alerts_chat){
        tntEmbed.setTitle('⁉️ Invalid Channel')
        .setDescription(`Please set an alerts channel with \`${options.discord_options.prefix}set alerts_channel\``)
        .setThumbnail(message.guild.iconURL())
        .setColor(options.color)
        .setFooter(`Glowstone Bot | Glowstone-Development`);
        return message.channel.send(tntEmbed);
    }

    options.tnt_alert =  !options.tnt_alert

    let toggle_msg  = (options.tnt_alert) ? tntEmbed.setDescription("**Tnt alert enabled**") : tntEmbed.setDescription("**Tnt alert disabled**")
    tntEmbed.setTitle(`✅ Toggle Events`)
    .setColor(options.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(`Glowstone Bot | ${message.guild.name}`);
    message.channel.send(tntEmbed); 
}
