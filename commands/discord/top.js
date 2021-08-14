const Discord = require("discord.js");

const embed = new Discord.MessageEmbed();

let top_page_no = 0;

module.exports = {
    name : 'top',
    description : 'List of top wall/buffer checks, deposits and playtime',
    execute(client, message, args, db, fetch_data, options){

        const checkedEmbed = new Discord.MessageEmbed()
        .setTitle("🥇 Top Buffers/Walls Checked")
        .setImage("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        const depositEmbed = new Discord.MessageEmbed()
        .setTitle("🥇 Top Bank Deposits")
        .setImage("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        const playtimeEmbed = new Discord.MessageEmbed()
        .setTitle("🥇 Top Playtime")
        .setDescription("Work In Progress")
        .setImage("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);

        let checksArray = Object.values(options.checks.members).sort((a, b)=> b-a)
        let sortedChecks = []
        let top_checked_player;
        let iteration_count1 = 0;
        let searchChecks = Object.keys(options.checks.members)
        checksArray.forEach(e => {
            let key_from_value = searchChecks.find(key => options.checks.members[key] === e)
            searchChecks = arrayRemove(searchChecks, key_from_value);
            sortedChecks.push(`${key_from_value}: ${parseInt(e).toLocaleString()}`)
            if(iteration_count1 ==0){
                iteration_count1++;
                top_checked_player = key_from_value;
            }
        });
        checkedEmbed.setDescription(`\`\`\`elixir\n${sortedChecks.join("\n")}\`\`\``)
        .setThumbnail("https://mc-heads.net/avatar/" + top_checked_player + "/100/nohelm.png");

        let bankArray = Object.values(options.bank.members).sort((a, b)=> b-a)
        let sortedBank = []
        let top_deposited_player;
        let iteration_count2 = 0;
        let searchDeposits = Object.keys(options.bank.members)
        bankArray.forEach(e => {
            let key_from_value = searchDeposits.find(key => options.bank.members[key] === e);
            searchDeposits = arrayRemove(searchDeposits, key_from_value)
            sortedBank.push(`${key_from_value}: $${parseInt(e).toLocaleString()}`)
            if(iteration_count2 ==0){
                iteration_count2++;
                top_deposited_player = key_from_value;
            }
        });
        depositEmbed.setDescription(`\`\`\`elixir\n${sortedBank.join("\n")}\`\`\``)
        .setThumbnail("https://mc-heads.net/avatar/" +top_deposited_player+ "/100/nohelm.png");

        let playtimeArray = Object.values(options.playtime).sort((a, b)=> b-a)
        let sortedPlaytime = []
        let top_playtime_player;
        let iteration_count3 = 0;
        let searchPlaytime = Object.keys(options.playtime)
        playtimeArray.forEach(e => {
            let key_from_value = searchPlaytime.find(key => options.playtime[key] === e)
            searchPlaytime = arrayRemove(searchPlaytime, key_from_value)
            sortedPlaytime.push(`${key_from_value}: ${timeConvert(parseInt(e).toLocaleString())}`)
            if(iteration_count3 ==0){
                iteration_count3++;
                top_playtime_player = key_from_value;
            }
        });
        playtimeEmbed.setDescription(`\`\`\`elixir\n${sortedPlaytime.join("\n")}\`\`\``)
        .setThumbnail("https://mc-heads.net/avatar/" +top_playtime_player+ "/100/nohelm.png");

        if (args[0] == "checks"){
            return message.channel.send(checkedEmbed)
        }else if (args[0] ==  "deposits"){
            return message.channel.send(depositEmbed)
        }else if (args[0] ==  "playtime"){
            return message.channel.send(playtimeEmbed)
        }

        let pages = {1: embed, 2: checkedEmbed, 3: depositEmbed, 4: playtimeEmbed}
        
        top_page_no = 0;
        embed.setTitle("🏅 Top Leaderboard")
        .setDescription('This is the leaderboard of top  wall/buffer checks, bank deposits, and playtime\n\n*You need to link your discord to minecraft for your name to show up in checked and playtime scoreboard\*')
        .setThumbnail("https://i.imgur.com/fgd9Dzk.png")
        .setImage("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
        .setColor(options.color)
        .setFooter(`Glowstone Bot | ${message.guild.name}`);
        message.channel.send(embed).then(async embed => {
            await embed.react('⬅️');
            await embed.react('➡️');
    
            const filter = (reaction, user) => ['➡️', '⬅️'].includes(reaction.emoji.name) && (message.author.id === user.id);
            const collector = embed.createReactionCollector(filter);
    
            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.name === '➡️'){
                    reaction.users.remove(user.id);
                    if (top_page_no < Object.keys(pages).length -1){
                        top_page_no++;
                        embed.edit(pages[top_page_no+1]);
                    }
                } else if (reaction.emoji.name === '⬅️'){
                    reaction.users.remove(user.id);
                    if (top_page_no > 0){
                        top_page_no--;
                        embed.edit(pages[top_page_no+1]);
                    }
                } 
            })
        });
    }
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " h(s) " + rminutes + " min(s)";
}