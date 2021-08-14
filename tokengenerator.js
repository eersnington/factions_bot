const uuid = require('uuid');
const chalk = require('chalk')

console.log(chalk.hex("#F1C40F")(chalk.bold("Glowstone Token:"), chalk.bold.red(Math.random().toString(12).substring(2,12)+uuid.v4()+Math.random().toString(26).substring(2,26))))