const Discord = require("discord.js");
let set_page_no = 0;
const command_cooldown = new Set();

module.exports = {
    name : 'setup',
    description : 'Setup channels',
    execute(client, message, args, db, fetch_data, options){

        const errEmbed = new Discord.MessageEmbed();
        if (!message.member.roles.cache.has(options.discord_options.developer_role)){
            errEmbed.setTitle('🚫 Access Denied')
            .setDescription(`You do not have <@&${options.discord_options.developer_role}> Role`)
            .setThumbnail(message.guild.iconURL())
            .setColor(options.color)
            .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(errEmbed)
        }

        if (command_cooldown.has("cooldown")){
            const cooldown = new Discord.MessageEmbed()
            .setTitle(`Setup cooldown: 5 seconds`)
            .setDescription('There is a 5 second cooldown to prevent spam.')
            .setColor(options.color)
            .setThumbnail(message.guild.iconURL())
            .setFooter('Glowstone Bot | Glowstone-Development')
            return message.channel.send(cooldown);
        }else{
            command_cooldown.add("cooldown");
            setTimeout(()=> command_cooldown.delete("cooldown"), 5000)
        }

        let required_channels = {
            'alerts_channel': 'alerts',
            'server_chat_channel': 'server-chat',
            'weewoo_channel': 'weewoo',
            'buffer_channel': 'checks',
            'flist_channel': 'flist',
            'fptop_channel': 'fptop',
            'ftop_channel': 'ftop',
            'logs_channel': 'logs',
            'whitelist_channel': 'verify'
        }

        let category = client.channels.cache.find(c => c.name.toLowerCase() == "factions bot" && c.type == "category");
    
        if (!category){
            const embed = new Discord.MessageEmbed();
            embed.setTitle('⁉️ Missing Category')
                .setDescription(`Please create a category called \`Factions bot\`, then retype the same command.`)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(embed)
        }
        
        for(c in required_channels){    
            let exists = category.children.some((channel) => channel.name === required_channels[c])
                if (!exists){
                    message.guild.channels.create(required_channels[c], { type: 'text' }).then( m => {
                        m.setParent(category.id);
                        if (m.name == required_channels[c]){
                            db.ref(options.config.glowstone_token).child('discordInfo').child(c).set(m.id).then(()=>{
                                fetch_data.discord_data();
                            }).catch((error) => console.error(error));
                        }
                    });
                }else {
                    let channel = message.guild.channels.cache.find(channel => channel.name === required_channels[c]);
                    if (channel.name == required_channels[c]){
                        db.ref(options.config.glowstone_token).child('discordInfo').child(c).set(channel.id).then(()=>{
                            fetch_data.discord_data();
                        }).catch((error) => console.error(error));
                    }
                }
        }

        const embed = new Discord.MessageEmbed();
            embed.setTitle('Setup complete')
                .setDescription(`Completed setup! Data is now synced. Set the IP and Join-command to the server you desire with \`${options.discord_options.prefix}set\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
            return message.channel.send(embed)
    }
}