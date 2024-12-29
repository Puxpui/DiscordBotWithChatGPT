const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const BOT_TOKEN = process.env.BOT_TOKEN

async function getChatGPTResponse(message) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are cat'},
                    { role: 'user', content: message }
                ]
            },
            {
                headers:{
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error(error)
        return 'somthing went wrong..'
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const userMessage = message.content;
    const botReply = await getChatGPTResponse(userMessage);

    message.reply(botReply);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(BOT_TOKEN);