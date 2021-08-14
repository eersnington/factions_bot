const chalk = require("chalk");
const Discord = require("discord.js");

let sneaking = false


module.exports = {
    name : 'sneak',
    description : 'Toggle between shifting and unshifting',
    execute(message, client, player, args, options, db){
        
        if (!Object.keys(options.players.whitelist).includes(player)){
            return
        }
        sneaking = !sneaking
        options.minecraft_options.bot.setControlState('sneak', sneaking);
        let sneaked = (sneaking ) ? options.minecraft_options.bot.chat(`Holding shift!`) : options.minecraft_options.bot.chat(`Unshifted!`)
    }
}