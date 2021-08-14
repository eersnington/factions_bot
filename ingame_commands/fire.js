const chalk = require("chalk");
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'fire',
    description : 'Press a button once or spam for a given timeperiod in seconds',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        if (Object.keys(options.players.whitelist).includes(player) || Object.keys(options.players.faction).includes(player)){
            button_click(chat, options)
        }
    }
}

function button_click(args, options) {
    const mcData = require('minecraft-data')(options.minecraft_options.bot.version);
    const block = options.minecraft_options.bot.findBlock({
        matching: mcData.blocksByName["stone_button"].id,
        maxDistance: 4,
        count: 1
    });
    if (!block) {
        return options.minecraft_options.bot.chat("Button is too far (max reach is 3 blocks)");
    }
    if (args == ""){
        options.minecraft_options.bot.activateBlock(block);
        options.minecraft_options.bot.chat(`Fired!`);
    }else{
        let time = parseFloat(args);
        let button_spam;
        options.minecraft_options.bot.chat(`Button spamming for ${time} seconds!`);
        setTimeout(()=> clearInterval(button_spam), (time*1000))
        button_spam = setInterval(()=> options.minecraft_options.bot.activateBlock(block), 100);
        
    }
}
    