const Discord = require("discord.js");

let disc_page_no = 0
let ingame_page_no = 0

module.exports = {
    name : 'help',
    description : 'Help page for the bot',
    execute(client, message, args, db, fetch_data, options){
        
        const help = new Discord.MessageEmbed()
		.setTitle(`Help`)
        .setDescription('Factions bot by Beastmasterrr')
        .addFields(
            {name: 'Set', value: `Do \`${options.discord_options.prefix}set\` to assign various options for the bot`},
            {name: 'Database', value: `Do \`${options.discord_options.prefix}db\` to check database related commands`},
            { name: 'Discord Commands', value: 'Press 🖥️ for list of Discord Commands' },
            { name: 'In-game Commands', value: 'Press 🏛️ for list of In-Game Commands' },
            { name: 'Cannoning Commands', value: 'Press 💥 for list of Cannoning Commands' }
        )
        .setColor(options.color)
		.setThumbnail(message.guild.iconURL())
		.setFooter(`Glowstone Bot | ${message.guild.name}`);
        message.channel.send(help).then(async embed => {
            await embed.react('🖥️');
            await embed.react('🏛️');
            await embed.react('💥');

            const filter = (reaction, user) => ['🖥️', '🏛️', '💥'].includes(reaction.emoji.name) && (message.author.id === user.id);
            const collector = embed.createReactionCollector(filter);

            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '🖥️'){
                    reaction.users.remove(user.id);
                    discord_embed(message, options.discord_options.prefix, options.color);
                } else if (reaction.emoji.name === '🏛️'){
                    reaction.users.remove(user.id);
                    ingame_embed(message, options.discord_options.prefix, options.color);
                }else if (reaction.emoji.name === '💥'){
                    reaction.users.remove(user.id);
                    cannon_embed(message, options.discord_options.prefix, options.color);
                } 
            })
        });
    }
}

function discord_embed(message, prefix, color){
    disc_page_no = 0
        
    const help1 = new Discord.MessageEmbed()
	.setTitle(`🖥️  Discord Commands`)
    .setDescription('\u200B')
    .addFields(
        { name: 'join', value: `Usage: \`${prefix}join \`\nDescription: *Starts the minecraft bot*` },
        { name: 'disconnect', value: `Usage: \`${prefix}disconnect \`\nDescription: *Disconnect the bot from the minecraft server*` },
        { name: 'sudo', value: `Usage: \`${prefix}sudo <message>\`\nDescription: *Get the bot say what you want*` },
        { name: 'status', value: `Usage: \`${prefix}status \`\nDescription: *Status of the bot and the server*` },
        { name: 'tpa', value: `Usage: \`${prefix}tpa <player_ign> \`\nDescription: *Sends a tpa request to the player*` },
        { name: 'tpyes', value: `Usage: \`${prefix}tpyes \`\nDescription: *Accepts any pending tpa requests*` },
        { name: '\u200B', value: `*Parameters in square brackets [] are optional whereas parameters in angle brackets <> necessary*` },
    )
    .setColor(color)
	.setThumbnail(message.guild.iconURL());

    const help2 = new Discord.MessageEmbed()
    .setTitle(`🖥️  Discord Commands`)
    .setDescription('\u200B')
    .addFields(
        { name: 'fwho', value: `Usage: \`${prefix}fwho [faction_name]\`\nDescription: *Sends you f-who information*` },
        { name: 'ftop', value: `Usage: \`${prefix}ftop [page_no]\`\nDescription: *Sends you f-top information*` },
        { name: 'fptop', value: `Usage: \`${prefix}fptop [page_no}\`\nDescription: *Sends you f-ptop information*` },
        { name: 'flist', value: `Usage: \`${prefix}flist [page_no]\`\nDescription: *Sends you f-list information*` },
        { name: 'toggle', value: `Usage: \`${prefix}toggle\`\nDescription: *See various events to toggle*` },
        { name: '\u200B', value: `*Parameters in square brackets [] are optional whereas parameters in angle brackets <> necessary*` },
    )
    .setColor(color)
	.setThumbnail(message.guild.iconURL())

    const help3 = new Discord.MessageEmbed()
    .setTitle(`🖥️  Discord Commands`)
    .setDescription('\u200B')
    .addFields(
        { name: 'shield', value: `Usage: \`${prefix}shield <on/off>\`\nDescription: *Start regular wall/buffer check alerts*` },
        { name: 'weewoo', value: `Usage: \`${prefix}weewoo <message>\`\nDescription: *WEEEEEWOOOO*` },
        { name: 'top', value: `Usage: \`${prefix}top \`\nDescription: *List of top wall/buffer checks, deposits and playtime*` },
        { name: 'vanish', value: `Usage: \`${prefix}vanish \`\nDescription: *Sends you a list of vanished staff members (might be patched)*` },
        { name: 'macros', value: `Usage: \`${prefix}macros\`\nDescription: *Start a macro that sends a message in a given interval in seconds*` },
        { name: '\u200B', value: `*Parameters in square brackets [] are optional whereas parameters in angle brackets <> necessary*` },
    )
    .setColor(color)
	.setThumbnail(message.guild.iconURL());

    const help4 = new Discord.MessageEmbed()
    .setTitle(`🖥️  Discord Commands`)
    .setDescription('\u200B')
    .addFields(
        { name: 'whitelistlink', value: `Usage: \`${prefix}whitelistlink\`\nDescription: *Link your minecraft account to discord(whitelist)*` },
        { name: 'memberlink', value: `Usage: \`${prefix}memberlink\`\nDescription: *Link your minecraft account to discord*` },
        { name: 'tokenclear', value: `Usage: \`${prefix}tokenclear <user>\`\nDescription: *Clear any existing temporary token*` },
        { name: 'linkclear', value: `Usage: \`${prefix}linkclear <user>\`\nDescription: *Unlinks a discord account*` },
        { name: 'exit', value: `Usage: \`${prefix}exit\`\nDescription: *Close the application*` },
        { name: '\u200B', value: `*Parameters in square brackets [] are optional whereas parameters in angle brackets <> necessary*` },
    )
    .setColor(color)
	.setThumbnail(message.guild.iconURL());

    let pages = {1: help1, 2: help2, 3: help3, 4:help4};
    help1.setFooter(`Page 1/${Object.keys(pages).length} | ${message.guild.name}`);
    help2.setFooter(`Page 2/${Object.keys(pages).length} | ${message.guild.name}`);
    help3.setFooter(`Page 3/${Object.keys(pages).length} | ${message.guild.name}`);
    help4.setFooter(`Page 4/${Object.keys(pages).length} | ${message.guild.name}`);
    message.channel.send(help1).then(async embed => {
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
    });
}

function ingame_embed(message, prefix, color){
    ingame_page_no = 0
    
    const help1 = new Discord.MessageEmbed()
	.setTitle(`🏛️ In-game Commands`)
    .setDescription('\u200B')
    .addFields(
        { name: 'sudo', value: `Usage: \`${prefix}sudo <message>\`\nDescription: *Get the bot say what you want (only whitelisted)*` },
        { name: 'link', value: `Usage: \`${prefix}link <code>\`\nDescription: *Link your discord account to a minecraft account*` },
        { name: 'shield', value: `Usage: \`${prefix}shield <on/off>\`\nDescription: *Regular wall and buffer check alerts (only whitelisted)*` },
        { name: 'weewoo', value: `Usage: \`${prefix}weewoo <message>\`\nDescription: *WEEEEEWOOOO*` },
        { name: 'checked', value: `Usage: \`${prefix}checked <N/S/E/W>\`\nDescription: *Notifies that you\'ve checked buffers*` },
    )
    .setColor(color)
	.setThumbnail(message.guild.iconURL());

    const help2 = new Discord.MessageEmbed()
	.setTitle(`🏛️ In-game Commands`)
    .setDescription('\u200B')
    .addFields(
        { name: 'follow', value: `Usage: \`${prefix}follow <player_ign>\`\nDescription: *Walks to the player's location*` },
        { name: 'sneak', value: `Usage: \`${prefix}sneak \`\nDescription: *Toggles sneaking*` },
        { name: 'tpa', value: `Usage: \`${prefix}tpa <player_ign>\`\nDescription: *Tpa to a player*` },
        { name: 'tpyes', value: `Usage: \`${prefix}tpyes\`\nDescription: *Accept any incoming tp requests*` },
    )
    .setColor(color)
	.setThumbnail(message.guild.iconURL());

    let pages = {1: help1, 2: help2};
    help1.setFooter(`Page 1/${Object.keys(pages).length} | ${message.guild.name}`);
    help2.setFooter(`Page 2/${Object.keys(pages).length} | ${message.guild.name}`);

    message.channel.send(help1).then(async embed => {
        await embed.react('⬅️');
        await embed.react('➡️');

        const filter = (reaction, user) => ['➡️', '⬅️'].includes(reaction.emoji.name) && (message.author.id === user.id);
        const collector = embed.createReactionCollector(filter);

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === '➡️'){
                reaction.users.remove(user.id);
                if (ingame_page_no < Object.keys(pages).length -1){
                    ingame_page_no++;
                    embed.edit(pages[ingame_page_no+1]);
                }
            } else if (reaction.emoji.name === '⬅️'){
                reaction.users.remove(user.id);
                if (ingame_page_no > 0){
                    ingame_page_no--;
                    embed.edit(pages[ingame_page_no+1]);
                }
            } 
        })
    });;
}

function cannon_embed(message, prefix, color){
    const help1 = new Discord.MessageEmbed()
	.setTitle(`💥 Cannon Commands`)
    .setDescription('\u200B')
    .addFields(
        { name: 'fire', value: `Usage: \`${prefix}fire [time_period]\`\nDescription: *Press a button once or spam for a given timeperiod in seconds (only whitelisted)*` },
        { name: 'lever', value: `Usage: \`${prefix}lever [cannon_speed] [tnt_amount] [pulsed]\`\nDescription: *Flick a nearby lever (only whitelisted)*
        \n**tnt_amount** : *tnt filled in dispeners* | **pulsed** : *double/triple pulsed*
        \nExample: \`${prefix}lever 3 40 2\`` },
        { name: '\u200B', value: `*Parameters in square brackets [] are optional whereas parameters in angle brackets <> necessary*` },
    )
    .setColor(color)
	.setThumbnail(message.guild.iconURL())
	.setFooter(`Page 1/1 | ${message.guild.name}`);

    message.channel.send(help1);
}