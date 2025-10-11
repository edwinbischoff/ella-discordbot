import 'dotenv/config';
import { Client, GatewayIntentBits } from "discord.js";

const TOKEN = process.env.TOKEN;
const TARGET_ROLE_ID = "1426431045905154152";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

  if (addedRoles.has(TARGET_ROLE_ID)) {
    try {
      await newMember.roles.remove(TARGET_ROLE_ID);
      await newMember.send("Your role was automatically removed after being given.");
      console.log(`Removed role from ${newMember.user.tag}`);
    } catch (error) {
      console.error("Error removing role or sending DM:", error);
    }
  }
});

client.login(TOKEN);
