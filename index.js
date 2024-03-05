"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
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
var client = new discord_js_1.Client({
    allowedMentions: {
        parse: [],
        repliedUser: false,
        roles: [],
        users: [],
    },
    intents: 0 |
        v10_1.GatewayIntentBits.GuildModeration |
        v10_1.GatewayIntentBits.GuildIntegrations |
        v10_1.GatewayIntentBits.GuildMembers |
        v10_1.GatewayIntentBits.GuildMessageReactions |
        v10_1.GatewayIntentBits.GuildMessageTyping |
        v10_1.GatewayIntentBits.GuildMessages |
        v10_1.GatewayIntentBits.GuildPresences |
        v10_1.GatewayIntentBits.GuildWebhooks |
        v10_1.GatewayIntentBits.Guilds |
        v10_1.GatewayIntentBits.MessageContent |
        0,
});
function isChannelPartOfStaffCategory(channel) {
    switch (channel.id) {
        case "1208857141394411537": // mod commands
            return true;
        default:
            var parent_1 = channel.parent;
            return parent_1 ? isChannelPartOfStaffCategory(parent_1) : false;
    }
}
function isInteractionOutsideStaffCategory(interaction) {
    return interaction.channel ? !isChannelPartOfStaffCategory(interaction.channel) : false;
}
// this is the start of an era
var ticketBotId = '557628352828014614'; // "ticket tool" id
var ticketCategoryId = '1198741504345247794'; // "appeals 1" category id
var staffRoleId = '1198735267503276153'; // "pyrocynical discord staff" role id
var acceptedChannelId = '1209271871439372378'; // ID of the "accepted" channel
var rejectedChannelId = '1209271907220852767'; // ID of the "rejected" channel
var voteChannelId = '1198735748233429202'; // "vote-on-appeals" channel id#
function timestampCheck() {
    var unixTimestamp = Math.floor(Date.now() / 1000); // unix timestamp
    var timestampString = "<t:".concat(unixTimestamp, ":f>"); // format to long date short time
    return timestampString;
}
var COMMAND_startvote = function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var link, channel, channelLink, messages, embedDescriptions_1, voteChannel, voteMessage_1, discussionThread_1, voteMessageLink_1, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                link = "https://discord.com/channels/".concat((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id, "/");
                channel = interaction.channel;
                channelLink = "".concat(link).concat(channel === null || channel === void 0 ? void 0 : channel.id);
                if (!(channel && 'parent' in channel && ((_b = channel.parent) === null || _b === void 0 ? void 0 : _b.id) !== ticketCategoryId)) return [3 /*break*/, 2];
                return [4 /*yield*/, interaction.reply({
                        content: 'This command is to be run in tickets only.',
                        ephemeral: true
                    })];
            case 1:
                _d.sent();
                return [2 /*return*/];
            case 2:
                if (!(channel && (channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.ThreadChannel))) return [3 /*break*/, 15];
                _d.label = 3;
            case 3:
                _d.trys.push([3, 13, , 14]);
                return [4 /*yield*/, channel.messages.fetch()];
            case 4:
                messages = _d.sent();
                embedDescriptions_1 = [];
                return [4 /*yield*/, Promise.all(messages.map(function (message) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(message.author.id === ticketBotId)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Promise.all(message.embeds.map(function (embed, index) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!(index === 1)) return [3 /*break*/, 2];
                                                        embedDescriptions_1.push((embed === null || embed === void 0 ? void 0 : embed.description) || '');
                                                        return [4 /*yield*/, interaction.reply({
                                                                content: "Loading...",
                                                                ephemeral: true
                                                            })];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 5:
                _d.sent();
                voteChannel = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.get(voteChannelId);
                if (!voteChannel || !(voteChannel instanceof discord_js_1.TextChannel)) {
                    return [2 /*return*/, interaction.editReply({
                            content: "Could not find or access vote-on-appeals channel.",
                        })];
                }
                return [4 /*yield*/, interaction.editReply({
                        content: "Creating threads channel..."
                    })];
            case 6:
                _d.sent();
                return [4 /*yield*/, voteChannel.send({
                        content: "<@&".concat(staffRoleId, "> Please vote on this appeal.\nVote started on ").concat(timestampCheck(), "\nLink to ticket: ").concat(channelLink),
                        embeds: [{
                                description: embedDescriptions_1.join('\n\n'),
                            }],
                        allowedMentions: {
                            roles: [staffRoleId],
                        },
                    })];
            case 7:
                voteMessage_1 = _d.sent();
                return [4 /*yield*/, voteChannel.threads.create({
                        name: "".concat(channel.name, " discussion"),
                        invitable: false,
                        reason: "For discussing the appeal",
                        type: discord_js_1.ChannelType.PublicThread,
                    })];
            case 8:
                discussionThread_1 = _d.sent();
                return [4 /*yield*/, discussionThread_1.send({
                        content: "Please discuss this appeal.\n\nVote started on ".concat(timestampCheck(), "\nCreated by <@").concat(interaction.user.id, ">"),
                        embeds: [{
                                description: embedDescriptions_1.join('\n\n'),
                            }],
                        allowedMentions: {
                            roles: [staffRoleId, interaction.user.id],
                        }
                    })];
            case 9:
                _d.sent();
                // adds the reactions for voting on the form
                return [4 /*yield*/, voteMessage_1.react('✅')];
            case 10:
                // adds the reactions for voting on the form
                _d.sent();
                return [4 /*yield*/, voteMessage_1.react('❎')];
            case 11:
                _d.sent();
                voteMessageLink_1 = "".concat(link).concat(voteChannelId, "/").concat(voteMessage_1.id);
                return [4 /*yield*/, interaction.editReply("Vote created at ".concat(voteMessageLink_1, "\nDiscussion thread created at ").concat(link).concat(discussionThread_1.id))
                    // after 24 hours do a thing
                ];
            case 12:
                _d.sent();
                // after 24 hours do a thing
                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var reactions, tickReaction, crossReaction, tickCount, crossCount, resultMessage, acceptedChannel, embedContent, rejectedChannel, embedContent, error_2;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 4, , 5]);
                                reactions = voteMessage_1.reactions.cache;
                                tickReaction = reactions.get('✅');
                                crossReaction = reactions.get('❎');
                                tickCount = tickReaction ? tickReaction.count : 0;
                                crossCount = crossReaction ? crossReaction.count : 0;
                                resultMessage = '';
                                if (!(crossCount === tickCount)) return [3 /*break*/, 2];
                                // if tied then do the thing to say it's tied
                                return [4 /*yield*/, discussionThread_1.send({
                                        content: "<@&".concat(staffRoleId, "> The appeal is tied. Please discuss and vote again."),
                                        embeds: [{
                                                description: embedDescriptions_1.join('\n\n'),
                                            }],
                                        allowedMentions: {
                                            roles: [staffRoleId],
                                        },
                                    })];
                            case 1:
                                // if tied then do the thing to say it's tied
                                _c.sent();
                                resultMessage = 'revote';
                                return [2 /*return*/];
                            case 2:
                                if (tickCount > crossCount) {
                                    // if tick wins then accepted
                                    resultMessage = 'accepted';
                                    acceptedChannel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(acceptedChannelId);
                                    if (!acceptedChannel) {
                                        console.error('Unable to find accepted appeals log channel.');
                                    }
                                    else if (acceptedChannel.isTextBased()) {
                                        embedContent = "# Appeal was accepted.\n\n".concat(embedDescriptions_1.join('\n\n'), "\nLink to original vote message: ").concat(voteMessageLink_1, "\nLink to original ticket: ").concat(channelLink, "\nVote finished on ").concat(timestampCheck());
                                        acceptedChannel.send({
                                            content: "<@&".concat(staffRoleId, ">"),
                                            embeds: [{
                                                    description: embedContent,
                                                    color: 0x00ff00 // hex colour for green
                                                }],
                                            allowedMentions: {
                                                roles: [staffRoleId]
                                            }
                                        });
                                    }
                                }
                                else {
                                    // otherwise, not tied, not accepted so rejected
                                    resultMessage = 'rejected';
                                    rejectedChannel = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.get(rejectedChannelId);
                                    if (!rejectedChannel) {
                                        console.error('Unable to find rejected appeals log channel.');
                                    }
                                    else if (rejectedChannel.isTextBased()) {
                                        embedContent = "# Appeal was rejected.\n\n".concat(embedDescriptions_1.join('\n\n'), "\nLink to original vote message: ").concat(voteMessageLink_1, "\nLink to original ticket: ").concat(channelLink, "\nVote finished on ").concat(timestampCheck());
                                        rejectedChannel.send({
                                            content: "<@&".concat(staffRoleId, ">"),
                                            embeds: [{
                                                    description: embedContent,
                                                    color: 0xff0000 // hex colour for red
                                                }],
                                            allowedMentions: {
                                                roles: [staffRoleId]
                                            }
                                        });
                                    }
                                }
                                _c.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                error_2 = _c.sent();
                                console.error("Error sending reaction counts or posting to channel:", error_2);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
                return [3 /*break*/, 14];
            case 13:
                error_1 = _d.sent();
                console.error("Error:", error_1);
                return [3 /*break*/, 14];
            case 14: return [3 /*break*/, 16];
            case 15:
                console.error("Error finding channel/category");
                _d.label = 16;
            case 16: return [2 /*return*/];
        }
    });
}); };
// this is the end of an era
// Terrible Command Handler
client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_3, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!interaction.isChatInputCommand()) return [3 /*break*/, 13];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 13]);
                _a = interaction.commandName;
                switch (_a) {
                    case "startvote": return [3 /*break*/, 2];
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, COMMAND_startvote(interaction)];
            case 3:
                _c.sent();
                return [2 /*return*/];
            case 4: return [4 /*yield*/, interaction.reply({
                    content: "Unknown command.",
                })];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6: return [3 /*break*/, 13];
            case 7:
                error_3 = _c.sent();
                _c.label = 8;
            case 8:
                _c.trys.push([8, 10, , 12]);
                return [4 /*yield*/, interaction.reply({
                        content: "An error has occured.",
                        ephemeral: isInteractionOutsideStaffCategory(interaction),
                    })];
            case 9:
                _c.sent();
                return [3 /*break*/, 12];
            case 10:
                _b = _c.sent();
                return [4 /*yield*/, interaction.editReply({
                        content: "An error has occured",
                    })];
            case 11:
                _c.sent();
                return [3 /*break*/, 12];
            case 12:
                console.error(error_3);
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
// When bot is ready
client.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 1:
                _b.sent();
                console.log("".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.username, " is ready"));
                return [2 /*return*/];
        }
    });
}); });
// Login
client.login(token);
