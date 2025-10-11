import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
});

const TOKEN = "YOUR_BOT_TOKEN";       // replace with your bot token
const TARGET_ROLE_ID = "ROLE_ID";     // replace with the role you want to auto-remove

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