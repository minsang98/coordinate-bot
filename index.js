require("dotenv").config();
const fs = require("fs");

const coordinate = require("./coordinate");

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { Guilds, GuildMessages, GuildMembers, MessageContent } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const prefix = "!";

const client = new Client({
  intents: [Guilds, GuildMessages, GuildMembers, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let event = false;

client.on("messageCreate", async (message) => {
  // message 작성자가 봇이면 그냥 return
  if (message.author.bot) return;
  // message 시작이 prefix가 아니면 return
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "좌표") {
    if (
      args.length !== 8 ||
      !["W", "E"].includes(args[0]) ||
      !["S", "N"].includes(args[4])
    ) {
      return message.reply("좌표 형식이 올바르지 않습니다.");
    }
    if (!event) {
      event = true;
      const replyMsg = await message.reply(
        `좌표 ${args.join(" ")}를 검색합니다.`
      );

      fs.access("coordinate.png", fs.constants.F_OK, (err) => {
        if (err) return;

        // 파일 삭제
        fs.unlink("coordinate.png", (err) => {
          if (err) throw err;
        });
      });

      await coordinate(args);
      await replyMsg.delete({ timeout: 100 });
      await message.reply({ files: [{ attachment: "./coordinate.png" }] });
      event = false;
    } else {
      return message.reply("기다려");
    }
  }
});

client.login(process.env.TOKEN);
