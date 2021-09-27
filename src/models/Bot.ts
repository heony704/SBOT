import { Client, Intents } from 'discord.js';
import Server from './Server';

export default class Bot {
    private id: string;
    private token: string;
    private client: Client;
    private serverList: Map<string, Server>;

    constructor(config: {token: string, id: string}) {
        this.id = config.id;
        this.token = config.token;
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
        this.serverList = new Map();
    }

    public start() {
        this.client.login(this.token)
        .then(() => {
            console.log('client login !');
            this.client.guilds.cache.forEach(guild => {
                const server = new Server();
                this.serverList.set(guild.id, server);
            });
        });
    }
}