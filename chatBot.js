require("dotenv").config();
const Insta = require("@androz2091/insta.js");
const { Configuration, OpenAIApi } = require("openai");
const client = new Insta.Client();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

client.login(process.env.USERNAM,process.env.PASSWORD);

client.on("connected", () => {
  console.log(`Logged in as ${client.user.username}`);
});

function start() {
  console.log(`Started`);
  console.log(process.env);

  client.on("messageCreate", async (message) => {
    if (message.author.id === client.user.id) return;
    message.markSeen();
  
    switch (true) {
      case message.content.length >= 8:
        message.reply('Please wait for seconds...')
        console.log('Please wait for seconds...')

        const finalResult = await generateResult(message.content);
        message.reply(finalResult);
        console.log(`Result sent`);
  
        break;
      default:
        message.reply(`"I am Amit's assistant bot. Please hit me up with a query of at least 8 characters."
        `);
        // message.reply('Hello, ich bin Amit Assistant. Ask me anything..')
        // message.reply("I am assistant bot only please hit me up for a query ");
    }
  });
  
  // message.reply("Hello, ich bin Amit Assistant. Ask me anything..");

  // client.on("messageCreate", async (message) => {
  //   if (message.author.id === client.user.id) return;
  //   message.markSeen();

  //   if (message.content.length >= 8) {
  //     message.reply("Please wait for seconds...");
  //     const finalResult = await generateResult(message.content);
  //     message.reply(finalResult);

  //     console.log(`Hello, ich bin Amit Assistant. Ask me anything..`);
  //   } else {
  //     message.reply(
  //       `I am his assistant bot.Please hit me up for a query(atleast 8 character)`
  //     );
  //     message.reply("Hello, ich bin Amit Assistant. Ask me anything..");
  //     // message.reply("I am assistant bot only please hit me up for a query ");
  //   }
  // });
}

const generateResult = async (message) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    temperature: 0.6,
    max_tokens: 1000,
  });

  return completion.data.choices[0].text;
};

start();

