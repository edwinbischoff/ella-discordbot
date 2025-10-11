import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
});

import 'dotenv/config';  // if using a .env file locally
const TOKEN = process.env.TOKEN;

const TARGET_ROLE_ID = "1426431045905154152";     // replace with the role you want to auto-remove

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  // detect newly added roles
  const addedRoles = newMember.roles.cache.filter(
    (role) => !oldMember.roles.cache.has(role.id)
  );

  // if target role added
  if (addedRoles.has(TARGET_ROLE_ID)) {
    try {
      // remove the role
      await newMember.roles.remove(TARGET_ROLE_ID);
      // send a DM
      await newMember.send("Your role was automatically removed after being given.");
      console.log(`Removed role from ${newMember.user.tag}`);
    } catch (error) {
      console.error("Error removing role or sending DM:", error);
    }
  }
});

client.login(TOKEN);