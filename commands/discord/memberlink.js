const Discord = require("discord.js");
const uuid = require("uuid");

module.exports = {
    name : 'memberlink',
    description : 'Link your minecraft account to discord',
    execute(client, message, args, db, fetch_data, options){

        const memberEmbed = new Discord.MessageEmbed();

        let tempUUID = "fm"+uuid.v4().substring(8,36);
        for (let user in options.temp_uuid) {
            if (options.temp_uuid[user] == message.author){
                memberEmbed.setTitle('⁉️ Temporary Token Exists')
                .setDescription(`There is already a token generated for <@${message.author.id}>\nCheck this Bot's DM, or get a <@&${options.discord_options.developer_role}> to do 
                \`${options.discord_options.prefix}tokenclear @user\``)
                .setThumbnail(message.guild.iconURL())
                .setColor(options.color)
                .setFooter(`Glowstone Bot | Glowstone-Development`);
                return message.channel.send(memberEmbed);
            }
          }
        options.temp_uuid[tempUUID] = message.author.id;
        
        memberEmbed.setTitle(`💬 Almost linked`)
        .setAuthor(message.member.user.tag)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`Final step: In-order to link the account <@${message.author.id}> to your minecraft account, issue the command sent in your DM's.`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
        message.channel.send(memberEmbed);
        memberEmbed.setTitle(`💬 Almost linked`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`Final step: Please issue the following command in-game\`\`\`${options.discord_options.prefix}link ${tempUUID}\`\`\`\nNote: **Do not share** this command to anyone else as it will
        link their minecraft account to your discord in ${message.guild.name}`)
        .setColor(options.color)
        .setFooter('Glowstone Bot | Glowstone-Development');
        message.author.send(memberEmbed);
    }
}