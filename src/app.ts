import { config } from './config';
import { Client, Intents } from 'discord.js';
import { Bot } from './models/Bot';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const bot = new Bot(config.id);

client.on('ready', () => console.log(`${client.user.tag} is Ready !`));

client.on('guildCreate', guild => {
    bot.addServer(guild.id);
    bot.createSbotCategory(guild);
    console.log(`${guild.name} is added to serverlist.`)
});

client.on('guildDelete', guild => {
    bot.deleteServer(guild.id);
    console.log(`${guild.name} is deleted from serverlist.`);
});

client.on('guildMemberRemove', member => bot.deleteUser(member.guild.id, member.user.id));

client.on('channelDelete', channel => {
    if (channel.type !== 'DM') bot.checkSummary(channel.guildId, channel.id)
});

client.on('messageCreate', message => bot.processCommand(message));

client.login(config.token).then(() => bot.initServerList(client.guilds.cache));