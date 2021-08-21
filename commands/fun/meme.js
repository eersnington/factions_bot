const Discord = require("discord.js");
const got = require('got');
const embed = new Discord.MessageEmbed();

module.exports = {
    name : 'meme',
    description : 'Send a meme',
    execute(client, message, args, db, fetch_data, options){
        
        const meme = new Discord.MessageEmbed();
        got('https://www.reddit.com/r/memes/random/.json')
            .then(response => {
                const [list] = JSON.parse(response.body);
                const [post] = list.data.children;
    
                const permalink = post.data.permalink;
                const memeUrl = `https://reddit.com${permalink}`;
                const memeImage = post.data.url;
                const memeTitle = post.data.title;
                const memeUpvotes = post.data.ups;
                const memeNumComments = post.data.num_comments;
    
                meme.setTitle(`${memeTitle}`);
                meme.setURL(`${memeUrl}`);
                meme.setColor(options.color);
                meme.setImage(memeImage);
                meme.setTimestamp()
                meme.setFooter(` | ${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
    
                message.channel.send(meme);
            })
            .catch(console.error); 
    }
}