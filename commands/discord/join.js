const Discord = require("discord.js");
const mineflayer = require("mineflayer");
const chalk = require('chalk');
const fs = require('fs');
const performance = require('perf_hooks').performance;
const tpsPlugin = require('mineflayer-tps')(mineflayer);

let login_timeout;
let relog_interval;
let bot;

const botEmbed = new Discord.MessageEmbed();
const commandFiles = fs.readdirSync('./ingame_commands').filter(file => file.endsWith('.js'));

const command_cooldown = new Set();
const deposit_cooldown = new Set();
const tnt_cooldown = new Set();
const cegg_cooldown = new Set();
const playtime = new Set();
const tempTime = {}

module.exports = {
    name : 'join',
    description : 'Connect the mineflayer bot to the server.',
    execute(client, message, args, db, fetch_data, options){
      const errEmbed = new Discord.MessageEmbed();
      if (Object.values(options.players.whitelist).includes(message.author.id) || message.member.roles.cache.has(options.discord_options.developer_role)){

        if (options.minecraft_options.bot != null){
  
          botEmbed.setTitle(`‼️ Warning`)
          .setThumbnail(message.guild.iconURL())
          .setDescription(`There is already a bot instance with the ign \`${bot.username}\`. 
                            If you want to disconnect then please issue the command \`${options.discord_options.prefix}disconnect\``)
          .setColor(options.color)
          .setFooter('Glowstone Bot | Glowstone-Development');
          return message.channel.send(botEmbed);
        }
  
        for (const file of commandFiles) {
          const command = require(`../../ingame_commands/${file}`);
          const fileName = file.substring(0, file.length-3);
          options.commands[fileName] = command;
        }
        
        main(options, message, client, db);
          
      }else{
        errEmbed.setTitle('🚫 Access Denied')
          .setDescription(`You do not have <@&${options.discord_options.developer_role}> role, nor you're a whitelisted player`)
          .setThumbnail(message.guild.iconURL())
          .setColor(options.color)
          .setFooter(`Glowstone Bot | Glowstone-Development`);
          return message.channel.send(errEmbed)
      }
      
    }
}

/** 
 * Mineflayer Bot Main 
 */

function main(options, message, client, db) {
  
  login_timeout = setTimeout(()=> {
    let channel = client.channels.cache.get(options.discord_options.server_chat_channel);
    options.minecraft_options.bot = null
    if (!channel) {
      return console.log(chalk.red("[Glowstone] Failed to connect"));
    };
    botEmbed.setTitle(`‼️ Login Timeout`)
    .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
    .setDescription(`The minecraft bot took too long to connect to \`${options.minecraft_options.ip}\`\n 
                    There might be network issues in your end or the server end. Maybe try again in a couple of minutes.`)
    .setColor(options.color)
    .setFooter('Glowstone Bot | Glowstone-Development');
    channel.send(botEmbed);
  }, 15000);

  botEmbed.setTitle(`🟨 Standby`)
  .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
  .setDescription(`Please wait a couple of seconds for the bot to join the server.`)
  .setColor(options.color)
  .setFooter('Glowstone Bot | Glowstone-Development');
  message.channel.send(botEmbed);

  if (options.config.mc_password == "") {
      bot = mineflayer.createBot({
        host: options.minecraft_options.ip,
        username: options.config.mc_username,
        version: options.minecraft_options.version,
        viewDistance: "far"
      })
    } else {
      bot = mineflayer.createBot({
        host: options.minecraft_options.ip,
        username: options.config.mc_username,
        password: options.config.mc_password,
        auth: options.config.auth,
        version: options.minecraft_options.version,
        viewDistance: "far"
      })

    }

    // Binding Events

    bot.on("login", async ()=>{
      options.minecraft_options.bot = bot;
    
      if (options.online == false){
        
        options.online = true;
        bot.loadPlugin(tpsPlugin);

        let chatRegex = new RegExp(`^(\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-|@)(\\w+): \\${options.discord_options.prefix}(\\w+)(.*)`);
        let mapleCraftRegex = new RegExp(`^FACTION: (\\*|\\*\\*|\\*\\*\\*|\\+|\\+\\+|\\-|\\-\\-)(\\w+): \\${options.discord_options.prefix}(\\w+)(.*)`);

        bot.addChatPattern("facChat1", chatRegex , { parse: true});
        bot.addChatPattern("facChat1", mapleCraftRegex , { parse: true});
        bot.addChatPattern("deposit", /^(\*|\*\*|\*\*\*|\+|\+\+|\-|\-\-)(\w+) gave \$((?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?) to your faction\./, { parse: true});
        bot.addChatPattern("deposit", /^(\*|\*\*|\*\*\*|\+|\+\+|\-|\-\-)(\w+) gave ((?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?) to your faction\./, { parse: true});
        bot.addChatPattern("paydeposit", /\$((?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?) has been received from (\w+)\./, { parse: true});
      }
      botEmbed.setTitle(`✅ Successful Login`)
      .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
      .setDescription(`The bot \`${bot.username}\` has succesfully logged into \`${options.minecraft_options.ip}\`\n
                        To check the status, issue the command \`${options.discord_options.prefix}status\`\n
                        If you want to disconnect, then please issue the command \`${options.discord_options.prefix}disconnect\``)
      .setColor(options.color)
      .setFooter('Glowstone Bot | Glowstone-Development');

      message.channel.send(botEmbed);
      if (options.config.mc_password == "") {
        bot.chat(`/login ${options.config.cracked_password}`)
      }
      clearTimeout(login_timeout);
      clearTimeout(relog_interval);
      
      setTimeout(()=>{
        bot.chat(`/${options.minecraft_options.join_command}`)
        options.vanish.track = true
      }, 1000)
      console.log(chalk.green(`[Glowstone] Logged in as`, chalk.bold.underline(`${bot.username}`),`in`,chalk.bold.underline(`${options.minecraft_options.ip}`)));
    });
    bot.on("chat:facChat1", (matches) => {
      if (command_cooldown.has("cooldown")){
        return
      }else{
        command_cooldown.add("cooldown");
        setTimeout(()=> command_cooldown.delete("cooldown"), 50)
      }
      
      const main_match = matches[0]
      const player = main_match[1]
      const command = main_match[2]
      const args = main_match[3]
      
      if(!Object.keys(options.commands).includes(command)){
        console.log("[Glowstone] Non existant command")
        return
      }
      options.commands[command].execute(message, client, player, args, options, db)
    });
    bot.on("chat:deposit", (matches) => {
      if (deposit_cooldown.has("cooldown")){
        return
      }else{
        deposit_cooldown.add("cooldown");
        setTimeout(()=> deposit_cooldown.delete("cooldown"), 1)
      }
      
      const main_match = matches[0]
      const player = main_match[1]
      const amount = parseInt(main_match[2].replace(/\,/g,''))

      if (Object.keys(options.bank.members).includes(player)){
        const previous_amt = parseInt(options.bank.members[player])
        const new_amt = previous_amt+amount
        options.bank.members[player] = new_amt
      }else{
        options.bank.members[player] = amount
      }
      db.ref(options.config.glowstone_token).child("banks").get().then((snapshot) => {
        if (snapshot.exists()) {
            let json = options.bank.members
            db.ref().child(options.config.glowstone_token).child('banks').update(json).then(()=>{
                options.minecraft_options.bot.chat(`Your contribution has beed noted ${player}`)
            })
        } else {
            console.log(chalk.red.bold("[Glowstone] Please initialize database"))
        }
      }).catch((error) => console.error(error));
    });

    bot.on("chat:paydeposit", (matches) => {
      if (deposit_cooldown.has("cooldown")){
        return
      }else{
        deposit_cooldown.add("cooldown");
        setTimeout(()=> deposit_cooldown.delete("cooldown"), 1)
      }
      
      const main_match = matches[0]
      const player = main_match[4]
      const amount = parseInt(main_match[0].replace(/\,/g,''))

      if (Object.keys(options.bank.members).includes(player)){
        const previous_amt = parseInt(options.bank.members[player])
        const new_amt = previous_amt+amount
        options.bank.members[player] = new_amt
      }else{
        options.bank.members[player] = amount
      }
      db.ref(options.config.glowstone_token).child("banks").get().then((snapshot) => {
        if (snapshot.exists()) {
            let json = options.bank.members
            db.ref().child(options.config.glowstone_token).child('banks').update(json).then(()=>{
                options.minecraft_options.bot.chat(`Your contribution has beed noted ${player}`)
            })
        } else {
            console.log(chalk.red.bold("[Glowstone] Please initialize database"))
        }
      }).catch((error) => console.error(error));
    });

    bot.on("message", (message, position) =>{
      let channel = client.channels.cache.get(options.discord_options.server_chat_channel)
      if (!channel) return;
      if (position == 'game_info') return;
      let server_message = `${message}`

      if (server_message.includes('$')){
        options.ftop.data.push(server_message);
        options.fptop.data.push(server_message);
      }
      if (server_message.includes('/')){
        options.flist.data.push(server_message)
      }
      if (options.server_chat.toggle){
        options.server_chat.data.push(server_message)
        setTimeout(() => {
          if (options.server_chat.data.length >= 2){
            channel.send(`\`\`\`${options.server_chat.data.join('\n')}\`\`\``)
            options.server_chat.data = []
          } else if (options.server_chat.data.length == 1){
            channel.send(`\`\`\`${options.server_chat.data.shift()}\`\`\``)
          }
        }, 750); 
      }
    })
  
    bot.on("kicked", async (reason) => {
      let channel = client.channels.cache.get(options.discord_options.server_chat_channel)

      relog_interval = setTimeout(() => {
        main(options, message, client);
      }, 120000);
      options.vanish.track = false;
      if (!channel) {
        bot.end();
        options.minecraft_options.bot = null;
        options.online = false;
        console.log(chalk.red(`[Glowstone] Minecraft Bot kicked:`, reason));
        return console.log(chalk.yellow('[Glowstone] Reconnecting in 2 mins'));
      };

      botEmbed.setTitle(`⁉️ Bot Kicked`)
      .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
      .setDescription(`The bot \`${bot.username}\` was kicked from \`${options.minecraft_options.ip}\`\n
                        **Reason:** \`\`\`${reason}\`\`\`
                        The bot will attemp to reconnect in 2 minutes`)
      .setColor(options.color)
      .setFooter('Glowstone Bot | Glowstone-Development');

      channel.send(`<@&${options.discord_options.developer_role}>`);
      channel.send(botEmbed);
      console.log(chalk.red(`[Glowstone] Minecraft Bot kicked:`, reason));
      console.log(chalk.yellow('[Glowstone] Reconnecting in 2 mins'));
      bot.end();
      options.minecraft_options.bot = null;
      options.online = false;
    });
    
    bot.on('error', async (err) => {
      let channel = client.channels.cache.get(options.discord_options.server_chat_channel);
      if (!channel){
        console.log(chalk.red(`[Glowstone] Bot Error: ${err}`));
        return console.log(chalk.red(`[Glowstone] Minecraft Bot has shut down!`));
      }
      options.vanish.track = false;

      botEmbed.setTitle(`⁉️ Bot Error`)
      .setThumbnail("https://api.minetools.eu/favicon/" + options.minecraft_options.ip)
      .setDescription(` \`\`\`${err}\`\`\`\n **Minecraft bot has shut down**`)
      .setColor(options.color)
      .setFooter('Glowstone Bot | Glowstone-Development');
      
      channel.send(`<@&${options.discord_options.developer_role}>`);
      channel.send(botEmbed);
      console.log(chalk.red(`[Glowstone] Minecraft Bot Error: ${err}`));
      console.log(chalk.red(`[Glowstone] Minecraft Bot has shut down!`));
      bot.end();
      options.minecraft_options.bot = null;
      options.online = false;
    });

    bot.on("playerJoined", (player)=>{
      if (Object.keys(options.players.whitelist).includes(player.username) && Object.keys(options.players.faction).includes(player.username)){
        console.log(player.username + " has joined!")
        if(!playtime.has(player.username)){
          playtime.add(player.username)
          tempTime[player.username] = performance.now()
        }
       
      }else {
      
        return
      }
      
    });

    bot.on("playerLeft", (player)=>{
      if (Object.keys(options.players.whitelist).includes(player.username) || Object.keys(options.players.faction).includes(player.username)){
        
        if(playtime.has(player.username)){

          playtime.delete(player.username)
          let endTime = performance.now()
          let onlineTime = Math.round(endTime-tempTime[player.username])

          let playTimeMinutes = Math.floor(onlineTime / 60000);
          console.log(player.username + " has left!")

          if (!options.playtime[player.username]){
            
            options.playtime[player.username] = playTimeMinutes;
          }else{
            options.playtime[player.username] += playTimeMinutes;
          }

          db.ref().child(options.config.glowstone_token).child('playtime').set(options.playtime);
          
        }
      } else {
      
        return
      }

    });

    bot._client.on('explosion', data => {
      let alerts_chat = client.channels.cache.get(options.discord_options.alerts_channel);
      
      if (options.tnt_alert == true && !tnt_cooldown.has("cooldown")){
        tnt_cooldown.add("cooldown");
        setTimeout(()=> tnt_cooldown.delete("cooldown"), 6000);
        if (data.radius == 4){

          const tntEmbed = new Discord.MessageEmbed();

          tntEmbed.setTitle(`💣 TNT Shot Alert`)
          .setColor(options.color)
          .setThumbnail("https://art.pixilart.com/12f55dd3412c81c.png")
          .setDescription(`Tnt shot detected near me\n**Coords:** (${parseFloat(data.x).toFixed(2)}, ${parseFloat(data.y).toFixed(2)}, ${parseFloat(data.z).toFixed(2)})`)
          .setFooter(`Glowstone Bot | ${message.guild.name}`);
          
          alerts_chat.send(tntEmbed);
          alerts_chat.send("@everyone");
          
        }

      }
      if(options.cegg_alert == true && !cegg_cooldown.has("cooldown")){

        cegg_cooldown.add("cooldown");
        setTimeout(()=> cegg_cooldown.delete("cooldown"), 6000);

        if (data.radius != 4) {
          const ceggEmbed = new Discord.MessageEmbed();

          ceggEmbed.setTitle(`💣 Cegg Egg Alert`)
          .setColor(options.color)
          .setThumbnail("https://i.pinimg.com/originals/84/3b/6b/843b6b77f46c1c3a69091d13fa9593d7.jpg")
          .setDescription(`Possible free-cam cegg detected\n**Coords:** (${parseFloat(data.x).toFixed(2)}, ${parseFloat(data.y).toFixed(2)}, ${parseFloat(data.z).toFixed(2)})`)
          .setFooter(`Glowstone Bot | ${message.guild.name}`);
          
          alerts_chat.send(ceggEmbed);
          alerts_chat.send("@everyone");

        }

      }
  });
}