const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'types',
    description : 'Tpyes command',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        if (!Object.keys(options.players.whitelist).includes(player)){
            return
        }
        options.minecraft_options.bot.chat(`/tpyes`)
    }
}