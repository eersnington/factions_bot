const Discord = require("discord.js");
const mineflayer = require("mineflayer");
const client = new Discord.Client();
const config = require('./config.json');
const chalk = require('chalk');
const fs = require('fs');
const glowstone = chalk.hex("#F1C40F");
const figlet = require('figlet');
const uuid = require("uuid");

/** 
 * Firebase Realtime Database
 */
const firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyDdpuRU628S2JbwVTPGmwgdjtp5rtBTB4E",
  authDomain: "factionsbot-glowstone.firebaseapp.com",
  databaseURL: "https://factionsbot-glowstone-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "factionsbot-glowstone",
  storageBucket: "factionsbot-glowstone.appspot.com",
  messagingSenderId: "352969983692",
  appId: "1:352969983692:web:524fcf10c6c44141f2a469",
  measurementId: "G-2HT5XD7Q5G"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.database()

const options = {
  color: "#F1C40F",
  //mineflayer variables
  online: false,
  config: {mc_username: config.username, mc_password: config.password, cracked_password: config.cracked_password, auth: config.microsoft_or_mojang, glowstone_token: config.glowstone_token}, 
  minecraft_options:{bot: null, version: '1.8.9', ip: null, join_command: null, relog_interval: null},
  //discord bot variables
  discord_options: {prefix: '*', developer_role: config.developer_role_id, member_role: null, server_chat_channel: null, weewoo_channel: null, buffer_channel: null,
  ftop_channel: null, fptop_channel: null, flist_channel: null, alerts_channel: null, whitelist_channel: null, logs_channel: null, interval: 5},
  //members
  players: {
    whitelist: {}, faction: {} },
  //bank data
  bank: {total_deposits: 0, members: {}},
  //checks data
  checks: {buffer_check_count: 0, buffer_interval: null, members:{}},
  //chat data
  server_chat: {toggle: true, data: []},
  ftop: {toggle: false, data: []},
  fptop: {toggle: false, data: []},
  flist: {toggle: false, data: []},
  cegg_alert: false,
  tnt_alert: false,
  logs: false,
  temp_uuid: {},
  commands: {},
  macros: {},
  playtime:{}
}

figlet('FACTIONS-BOT', (err, data) =>{
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  let pjson = require('./package.json');
  console.log(glowstone(data));
  console.log(glowstone("Factions Bot: v"+pjson.version))
});

if (options.config.glowstone_token == ""){
  console.log(chalk.hex("#e12120")("[Glowstone] Please enter your given Glowstone Token"))
  process.exit(0);
}

db.ref().child(options.config.glowstone_token).get().then((snapshot) => {
  if (snapshot.exists()) {
    return
  }else{
    console.log(chalk.hex("#e12120")("[Glowstone] Invalid Glowstone Token"))
    process.exit(0);
  }
}).catch((error) => {console.log("Contact the developers with a ticket of this screenshot", error)});

fs.unlink("./commands/.DS_Store", (err) => {
  if (err) {
      console.log("[Glowstone] DS_Store is already deleted");
  } else {
      console.log("Glowstone] Successfully deleted DS_Store");                                
  }
});

async function pause(ms){
  await new Promise(resolve => setTimeout(resolve, ms))
}
pause(5000)

let fetch_data = {
  mineflayer_data: function fetch_mineflayer_data(){
    //bot information
    db.ref().child(options.config.glowstone_token).child('botInfo').get().then((snapshot) => {
        if (snapshot.exists()) {
          let snapshot_json = snapshot.toJSON()
          let minecraft_options = options.minecraft_options
          for (var opt of Object.keys(snapshot_json)){
            minecraft_options[opt] = snapshot_json[opt]
          }
          console.log(chalk.green('Minecraft Bot Data Loaded'))
        } else {
          console.log("[Glowstone] No minecraft bot data available", `Please Initialize with ${options.discord_options.prefix}db initialize`)
        }
    }).catch((error) => {
      if (error == "ReferenceError: message is not defined") return console.log(`Minecraft bot data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
      console.log(error)});
  },
  discord_data: function fetch_discordbot_data(){
    //discord information
    db.ref().child(options.config.glowstone_token).child('discordInfo').get().then((snapshot) => {
        if (snapshot.exists()) {
          let snapshot_json = snapshot.toJSON()
          let discord_options = options.discord_options;
          for (var opt of Object.keys(snapshot_json)){
            discord_options[opt] = snapshot_json[opt]
            if (opt == 'interval'){
              let time = parseInt(snapshot_json[opt]);
              options.ftop.interval = time*60000;
              options.fptop.interval = time*60000;
              options.flist.interval = time*60000;
            }
          }
          console.log(chalk.green('Discord Bot Data Loaded'))
        } else {
          console.log("[Glowstone] No discord bot data available", `Please Initialize with ${options.discord_options.prefix}db initialize`)
        }
    }).catch((error) => {
      if (error == "ReferenceError: message is not defined") return console.log(`Discord bot data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
      console.log(error)});
  },
  whitelist_data: function fetch_whitelist_data(){
    //whitelist 
    db.ref().child(options.config.glowstone_token).child('whitelist').get().then((snapshot) => {
        if (snapshot.exists()) {
          let snapshot_json = snapshot.toJSON()
          options.players.whitelist = snapshot_json;
          
          console.log(chalk.green('Whitelist Data Loaded'))
        } else {
          console.log("[Glowstone] No whitelist data available.", `Please Initialize with ${options.discord_options.prefix}db initialize`)
        }
      }).catch((error) => {
        if (error == "ReferenceError: message is not defined") return console.log(`Whitelist data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
        console.log(error)}); 
  },
  facmembers_data: function fetch_facmember_data(){
    //fac members
    db.ref().child(options.config.glowstone_token).child('members').get().then((snapshot) => {
       if (snapshot.exists()) {
         let snapshot_json = snapshot.toJSON()
         options.players.faction = snapshot_json;

         console.log(chalk.green('Faction Members Data Loaded'))
       } else {
           console.log("[Glowstone] No fac member data available.", `Please Initialize with ${options.discord_options.prefix}db initialize`)
       }
     }).catch((error) => {
       if (error == "ReferenceError: message is not defined") return console.log(`Faction members data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
       console.log(error)});
  },
  checks_data: function fetch_checks_data(){
    //walls/buffer checks
    db.ref().child(options.config.glowstone_token).child('checks').get().then((snapshot) => {
       if (snapshot.exists()) {
         let snapshot_json = snapshot.toJSON()
         options.checks.members = snapshot_json;
         console.log(chalk.green('Checks Data Loaded'))
       } else {
           console.log("[Glowstone] No checks data available.", `Please Initialize with ${options.discord_options.prefix}db initialize`)
       }
     }).catch((error) => {
       if (error == "ReferenceError: message is not defined") return console.log(`Checks data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
       console.log(error)});
  },
  banks_data: function fetch_banks_data(){
    //walls/buffer checks
    db.ref().child(options.config.glowstone_token).child('banks').get().then((snapshot) => {
       if (snapshot.exists()) {
         let snapshot_json = snapshot.toJSON()
         options.bank.members = snapshot_json;
         console.log(chalk.green('Banks Data Loaded'))
       } else {
           console.log(`[Glowstone] No banks data available. Please Initialize with ${options.discord_options.prefix}db initialize`)
       }
     }).catch((error) => {
       if (error == "ReferenceError: message is not defined") return console.log(`Banks data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
       console.log(error)});
  },
  macros_data: function fetch_macros_data(){
    //walls/buffer checks
    db.ref().child(options.config.glowstone_token).child('macros').get().then((snapshot) => {
       if (snapshot.exists()) {
         let snapshot_json = snapshot.toJSON()
         options.macros = snapshot_json;
         console.log(chalk.green('Macros Data Loaded'))
       } else {
           console.log(`[Glowstone] No macros data available. Please Initialize with ${options.discord_options.prefix}db initialize`)
       }
     }).catch((error) => {
       if (error == "ReferenceError: message is not defined") return console.log(`Macros data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
       console.log(error)});
  },
  playtime_data: function fetch_playtime_data(){
    //walls/buffer checks
    db.ref().child(options.config.glowstone_token).child('playtime').get().then((snapshot) => {
       if (snapshot.exists()) {
         let snapshot_json = snapshot.toJSON()
         options.playtime = snapshot_json;
         console.log(chalk.green('Playtime Data Loaded'))
       } else {
           console.log(`[Glowstone] No playtime data available. Please Initialize with ${options.discord_options.prefix}db initialize`)
       }
     }).catch((error) => {
       if (error == "ReferenceError: message is not defined") return console.log(`Play data missing. Please Initialize with ${options.discord_options.prefix}db initialize`)
       console.log(error)});
  },
}
db.ref().child(options.config.glowstone_token).get().then((snapshot) => {
  if (snapshot.exists()) {
    fetch_data.mineflayer_data();
    fetch_data.discord_data();
    fetch_data.whitelist_data();
    fetch_data.facmembers_data();
    fetch_data.checks_data();
    fetch_data.banks_data();
    fetch_data.macros_data();
    fetch_data.playtime_data();
  } else {
      console.log(`[Glowstone] Database missing. Please Initialize with "${options.discord_options.prefix}db initialize" in Discord`)
  }
}).catch((error) => {
  if (error == "ReferenceError: message is not defined") return console.log(`Guild data missing. Please Initialize with "${options.discord_options.prefix}db initialize" in Discord`);
  console.log(error)});


/** 
 * Discord Command Handler
 */
client.commands = new Discord.Collection();
const command_folder = fs.readdirSync('./commands/');

for (const folder of command_folder) {
	const command_folder = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of command_folder) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

/** 
 * Discord Client Event
 */

client.on('ready', activity => {
    client.user.setStatus(`available`)
    setTimeout(()=>client.user.setActivity(
      `${options.minecraft_options.ip} server's chat | for help do  ${options.discord_options.prefix}help | https://discord.io/glowstone?`, {
        type: "WATCHING"
      }
    ),1000)
    
});
  
client.on("ready", async =>{
  console.log(chalk.yellow(`[Glowstone] Discord bot online as ${client.user.tag}`));
})

// Discord Messages //
client.on("message", (message) => {
  if (!message.guild) return;
  if (!message.content.startsWith(options.discord_options.prefix) || message.author.bot) return;

	const args = message.content.slice(options.discord_options.prefix.length).trim().split(/[ ]+/);
	const command = args.shift().toLowerCase();

  if (!client.commands.has(command)){
    const errCommand = new Discord.MessageEmbed();
        errCommand.setTitle(`⁉️ Non-existent Command`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(`The command \`${options.discord_options.prefix}${command}\` doesn't exist. \nPlease use \`${options.discord_options.prefix}help\` to see all commands!`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
    return message.reply(errCommand);
  }
  
  try {
    if (command == 'help'){
      return client.commands.get(command).execute(client, message, args, db, fetch_data, options);
    }
		client.commands.get(command).execute(client, message, args, db, fetch_data, options);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
 
client.login(config.discord_bot_token)
.catch(error =>{
	console.log(chalk.red('Discord Bot Failed Login'));
  })