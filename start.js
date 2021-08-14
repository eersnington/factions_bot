const chalk = require("chalk");
const { Client, Discord } = require('discord.js')
const { exec } = require('child_process');
console.log(
chalk.yellow        (" ██████╗ ██╗      ██████╗ ██╗    ██╗███████╗████████╗ ██████╗ ███╗   ██╗███████╗ "),         chalk.yellow (" ██████╗ ███████╗██╗   ██╗\n"),
chalk.yellow        ("██╔════╝ ██║     ██╔═══██╗██║    ██║██╔════╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝  "),         chalk.white (" ██╔══██╗██╔════╝██║   ██║\n"),
chalk.yellow        ("██║  ███╗██║     ██║   ██║██║ █╗ ██║███████╗   ██║   ██║   ██║██╔██╗ ██║█████╗    "),        chalk.yellow (" ██║  ██║█████╗  ██║   ██║\n"),
chalk.yellow        ("██║   ██║██║     ██║   ██║██║███╗██║╚════██║   ██║   ██║   ██║██║╚██╗██║██╔══╝     "),         chalk.white(" ██║  ██║██╔══╝  ╚██╗ ██╔╝\n"),
chalk.yellow        ("╚██████╔╝███████╗╚██████╔╝╚███╔███╔╝███████║   ██║   ╚██████╔╝██║ ╚████║███████╗   "),        chalk.yellow(" ██████╔╝███████╗ ╚████╔╝ \n"),
chalk.yellow         ("╚═════╝ ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝    "),       chalk.white(" ╚═════╝ ╚══════╝  ╚═══╝  \n"), 
)
console.log("\n[»] "),chalk.blue("Glowstone Development"),
require('./index')