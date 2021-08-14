const chalk = require("chalk");
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'lever',
    description : 'Flick a nearby lever',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        if (Object.keys(options.players.whitelist).includes(player) || Object.keys(options.players.faction).includes(player)){
            lever_flick(chat, options)
        }
    }
}

function lever_flick(args, options) {
    const mcData = require('minecraft-data')(options.minecraft_options.bot.version)
    const block = options.minecraft_options.bot.findBlock({
      matching: mcData.blocksByName["lever"].id,
      maxDistance: 4,
      count: 1
    });
    if (!block) {
        return options.minecraft_options.bot.chat("No lever near me");
    }
    const parameters = args.split(" ") 
    
    if (parameters[0] == ""){
        options.minecraft_options.bot.activateBlock(block);
        return options.minecraft_options.bot.chat(`Levered!`)
    }
    
    if (parameters.length != 3){
        return options.minecraft_options.bot.chat(`Incorrect Usage. Please check for command usage in discord with ${options.discord_options.prefix}help`);
        
    }else {
        const cannon_speed = parseFloat(parameters[0])
        const tnt_amount = parseInt(parameters[1])
        const pulsed = parseInt(parameters[2])

        options.minecraft_options.bot.chat(`Safe Clocked! Cannon-speed: ${cannon_speed}, Tnt-filled: ${tnt_amount}, Pulsed: ${pulsed}`);
        options.minecraft_options.bot.activateBlock(block);
        setTimeout(()=> {
            options.minecraft_options.bot.activateBlock(block)
            options.minecraft_options.bot.chat(`Deactivated Cannon! Out of tnt!!`);
        }, ((tnt_amount-pulsed)/pulsed)*cannon_speed*1000)
    }
    
}