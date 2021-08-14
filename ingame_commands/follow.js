const chalk = require("chalk");
const Discord = require("discord.js");
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'follow',
    description : 'Follow a player in view distance',
    execute(message, client, player, args, options, db){
        const chat = args.substring(1);
        
        if (!Object.keys(options.players.whitelist).includes(player)){
            return
        }

        options.minecraft_options.bot.loadPlugin(pathfinder)

        const mcData = require('minecraft-data')(options.minecraft_options.bot.version)

        const defaultMove = new Movements(options.minecraft_options.bot, mcData)

        if (player === options.minecraft_options.bot.username) return

        let target
        let target_chosen

        if (chat != ""){
            target = options.minecraft_options.bot.players[chat] ? options.minecraft_options.bot.players[chat].entity : null
            target_chosen = chat
        }else {
            target = options.minecraft_options.bot.players[player] ? options.minecraft_options.bot.players[player].entity : null
            target_chosen = player
        }

        if (!target) return options.minecraft_options.bot.chat(`${target_chosen} might be an invalid player or is out of my render distance`)

        const p = target.position

        options.minecraft_options.bot.pathfinder.setMovements(defaultMove);
        options.minecraft_options.bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));
        options.minecraft_options.bot.chat(`Following ${target_chosen}!`)
    }
}