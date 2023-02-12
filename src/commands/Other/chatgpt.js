const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const {
    OpenAIApi,
    Configuration
} = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Chat with GPT-3')
        .addStringOption(option => option.setName('message').setDescription('The message to send to GPT-3').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const message = interaction.options.getString('message');

        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                max_tokens: 2048,
                temperature: 0.5,
                top_p: 1,
                presence_penalty: 0.5,
                frequency_penalty: 0.5,
                best_of: 1,
                n: 1,
                stream: false,
                prompt: message
            })

            const embed = new EmbedBuilder()
                .setColor(2895667)
                .setTimestamp()
                .setAuthor({ name: 'ChatGPT', iconURL: 'https://openai.com/content/images/2022/05/openai-avatar.png'})
                .setDescription(`\`\`\`${response.data.choices[0].text}\`\`\``)

            await interaction.editReply({
                embeds: [embed]
            });
        } catch (error) {
            console.log(error)
            return await interaction.editReply({
                content: 'An error occurred while trying to send the message to GPT-3',
                ephemeral: true
            });
        }


    }
}