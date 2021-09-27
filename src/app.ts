import config from './config';
import Bot from './models/Bot';

const bot = new Bot(config);

bot.start();