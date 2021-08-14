const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'tpa',
    description : 'Tpa command',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        if (!Object.keys(options.players.whitelist).includes(player)){
            return
        }
        options.minecraft_options.bot.chat(`/tpa ${chat}`)
    }
}