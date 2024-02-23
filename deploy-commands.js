"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builders_1 = require("@discordjs/builders");
var rest_1 = require("@discordjs/rest");
var v10_1 = require("discord-api-types/v10");
var dotenv = require('dotenv');
dotenv.config();
var clientId = process.env.BOT_USER_ID;
var guildId = process.env.MAIN_SERVER_ID;
var token = process.env.BOT_TOKEN;
if (!clientId)
    throw new Error("Client ID not defined in .env");
if (!guildId)
    throw new Error("Guild ID not defined in .env");
if (!token)
    throw new Error("Bot Token not defined in .env");
var commands = [
    new builders_1.SlashCommandBuilder().setName("startvote").setDefaultMemberPermissions(v10_1.PermissionFlagsBits.ManageThreads).setDescription("Creates a voting thread in 'vote-on-appeals' for handling ban appeal votes."),
]
    .map(function (command) { return command.toJSON(); });
var rest = new rest_1.REST({ version: '10' }).setToken(token);
rest.put(v10_1.Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(function () { return console.log('Successfully registered main server application commands.'); })
    .catch(console.error);
