const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'sudo',
    description : 'Get the bot say what you want',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        if (!Object.keys(options.players.whitelist).includes(player)){
            return
        }
        options.minecraft_options.bot.chat(chat)
    }
}

/**
 * [
  '-',
  'Beastmasterrr',
  'shield',
  index: 0,
  input: '-Beastmasterrr: !shield',
  groups: undefined
]
 * 
 */