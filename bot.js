import 'dotenv/config'; // This allows the bot token in a .env file to be pulled
import { Client, GatewayIntentBits, Partials } from "discord.js"; // Discord.js allows for easier coding, see readme.txt for docs

const TOKEN = process.env.TOKEN; // Grabs Ella Bot token from .env file
const TARGET_ROLE_ID = "1426431045905154152"; // This tag represents the watched role (named "temp"); it is given *once*, only used as a tag which is later removed.
const IGNORE_ROLE_ID = "1029821917131194470" // This tag represents the ignore role (named "vegan" but called "perm" in console); it is used so that users who have the role are not messaged
const MESSAGE_SEND = "Hi! \nI'm Ella Bot from the Knights for Animal Rights Discord. You're getting this message from me because you selected \"vegan\" during onboarding! We want to make sure everyone with the vegan role understands what veganism means (*i.e.*, what veganism means beyond just eating lettuce - yum), so club officers must verify all members who select the \"vegan\" role using the Vegan Application. You can find the Vegan Application in our Server Guide, located at the top of the server. Please remember you are welcome here, whether accepted or denied from the vegan role! \nIf you have any questions, check out https://discord.com/channels/1029820827203538954/1425635036379742410 to learn more about roles at KAR. Thanks for showing your support for animals like me! \n\n*This is an automated message.*"

const client = new Client({
  intents: [ // intents allow a lower computational burden by only selecting what we hope to accomplish
    GatewayIntentBits.Guilds, // Required base intent for *access to roles & IDs*
    GatewayIntentBits.GuildMembers, // Required to *detect old/new roles* and *change roles* (not used: members joining)
    GatewayIntentBits.DirectMessages, // Required to *DM members*
    GatewayIntentBits.MessageContent // debug
  ],
   partials: [Partials.Channel], // required for DMs
});

// Prints onto terminal console to confirm bot is ready
client.once("clientReady", () => {
    console.log(`\nBinkying in as ${client.user.tag}`); // expected -> Binkying in as Ella Bot#0202
    const guild = client.guilds.cache.get("1029820827203538954"); // gets the guild cache for the server
    guild.members.fetch().then(members => { // fetches the cache for everyone in server
      console.log(`Fetched ${members.size} members`);
    });
});

client.on("guildMemberAdd", async (member) => {
  // Check if they already have the TEMP_ROLE_ID
  if (member.roles.cache.has(TEMP_ROLE_ID)) {
      await member.roles.remove(TEMP_ROLE_ID);
      console.log(`Removed temp role from ${member.user.tag} on join`);
      await newMember.send(MESSAGE_SEND);
      console.log(`DMed ${newMember.user.tag} successfully`);
  }
});

client.on("guildMemberUpdate", async (oldMember, newMember) => { // at update/tick: Ella takes properties from member before the update, and then after.

    
    console.log(`\nSynced...`);
  const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id)); // compares old to new roles and sets new roles as addedRoles
    console.log(`addedRoles cached`);
  
    if (newMember.roles.cache.has(IGNORE_ROLE_ID) && newMember.roles.cache.has(TARGET_ROLE_ID)) {
      // IGNORE role present and still has TARGET -> remove TARGET
      await newMember.roles.remove(TARGET_ROLE_ID);
      console.log(`Removed temp role from ${newMember.user.tag}`);
      return;
    }

    // runs only when IGNORE role is newly added
    if (!oldMember.roles.cache.has(IGNORE_ROLE_ID) && newMember.roles.cache.has(IGNORE_ROLE_ID)) {
      console.log(`${newMember.user.tag} gained ignore role.`);
    }
    
  if (addedRoles.has(TARGET_ROLE_ID)) { // checks entire role caches of addedRoles if it contains "temp" role
    try {
      console.log(`addedRoles contains temp for ${newMember.user.tag}`);
      await newMember.roles.remove(TARGET_ROLE_ID); // removed "temp" role
      console.log(`Removed temp role from ${newMember.user.tag}`);
      // The following line is the message that will be sent:
      await newMember.send(MESSAGE_SEND);
      console.log(`DMed ${newMember.user.tag} successfully`);
    } catch (error) {
      console.error("Error removing role or sending DM:", error);
    }
  }
});

client.login(TOKEN); // connects bot to server
