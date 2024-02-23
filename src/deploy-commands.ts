import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes, PermissionFlagsBits } from 'discord-api-types/v10';
const dotenv = require('dotenv');

dotenv.config();

const clientId = process.env.BOT_USER_ID;
const guildId = process.env.MAIN_SERVER_ID;
const token = process.env.BOT_TOKEN


if (!clientId) throw new Error("Client ID not defined in .env");
if (!guildId) throw new Error("Guild ID not defined in .env");
if (!token) throw new Error("Bot Token not defined in .env");

const commands = [
  new SlashCommandBuilder().setName("startvote").setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads).setDescription("Creates a voting thread in 'vote-on-appeals' for handling ban appeal votes."),
]
  .map(command => command.toJSON());


const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered main server application commands.'))
  .catch(console.error);
