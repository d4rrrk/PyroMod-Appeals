import { Client, ChannelType, GuildChannel, BaseInteraction, TextChannel, ChatInputCommandInteraction, ThreadChannel } from "discord.js";
import { GatewayIntentBits } from "discord-api-types/v10";
const dotenv = require('dotenv');

dotenv.config();

const clientId = process.env.BOT_USER_ID;
const guildId = process.env.MAIN_SERVER_ID;
const token = process.env.BOT_TOKEN;

if (!clientId) throw new Error("Client ID not defined in .env");
if (!guildId) throw new Error("Guild ID not defined in .env");
if (!token) throw new Error("Bot Token not defined in .env");

const client = new Client({
  allowedMentions: {
    parse: [],
    repliedUser: false,
    roles: [],
    users: [],
  },
  intents: 0 |
    GatewayIntentBits.GuildModeration |
    GatewayIntentBits.GuildIntegrations |
    GatewayIntentBits.GuildMembers |
    GatewayIntentBits.GuildMessageReactions |
    GatewayIntentBits.GuildMessageTyping |
    GatewayIntentBits.GuildMessages |
    GatewayIntentBits.GuildPresences |
    GatewayIntentBits.GuildWebhooks |
    GatewayIntentBits.Guilds |
    GatewayIntentBits.MessageContent |
    0,
});

function isChannelPartOfStaffCategory(channel: GuildChannel): boolean {
  switch (channel.id) {
    case "1208857141394411537": // mod commands
      return true;
    default:
      const parent = channel.parent;
      return parent ? isChannelPartOfStaffCategory(parent) : false;
  }
}

function isInteractionOutsideStaffCategory(interaction: BaseInteraction): boolean {
  return interaction.channel ? !isChannelPartOfStaffCategory(interaction.channel as GuildChannel) : false;
}

// this is the start of an era

const ticketBotId = '557628352828014614'; // "ticket tool" id
const ticketCategoryId = '1198741504345247794'; // "appeals 1" category id
const staffRoleId = '1198735267503276153'; // "pyrocynical discord staff" role id
const acceptedChannelId = '1209271871439372378'; // ID of the "accepted" channel
const rejectedChannelId = '1209271907220852767'; // ID of the "rejected" channel
const voteChannelId = '1198735748233429202'; // "vote-on-appeals" channel id#

function timestampCheck() {
  const unixTimestamp = Math.floor(Date.now() / 1000); // unix timestamp
  const timestampString = `<t:${unixTimestamp}:f>`; // format to long date short time
  return timestampString
}

const COMMAND_startvote = async (interaction: ChatInputCommandInteraction) => {
  const link = `https://discord.com/channels/${interaction.guild?.id}/`; // ${channel id}/${message id}
  const channel = interaction.channel; // channel that the command was used in
  const channelLink = `${link}${channel?.id}`;

  // check if run in a ticket
  if (channel && 'parent' in channel && channel.parent?.id !== ticketCategoryId) {
    await interaction.reply({
      content: 'This command is to be run in tickets only.',
      ephemeral: true
    });
    return;
  }

  // gets embeds from ticket tool for the form
  if (channel && (channel instanceof TextChannel || channel instanceof ThreadChannel)) {
    try {
      const messages = await channel.messages.fetch();

      const embedDescriptions: string[] = [];

      await Promise.all(messages.map(async (message) => {
        if (message.author.id === ticketBotId) {
          await Promise.all(message.embeds.map(async (embed, index) => {
            if (index === 1) {
              embedDescriptions.push(embed?.description || '');
              await interaction.reply({
                content: `Loading...`,
                ephemeral: true
              });
            }
          }));
        }
      }));

      // if bot cannot find vote-on-appeals server. maybe change permissions if this is the case?
      const voteChannel = interaction.guild?.channels.cache.get(voteChannelId); // "vote-on-appeals" channel for threads
      if (!voteChannel || !(voteChannel instanceof TextChannel)) {
        return interaction.editReply({
          content: "Could not find or access vote-on-appeals channel.",
        });
      }

      await interaction.editReply({
        content: `Creating threads channel...`
      });

      // send the message to the vote thread
      const voteMessage = await voteChannel.send({
        content: `<@&${staffRoleId}> Please vote on this appeal.\nVote started on ${timestampCheck()}\nLink to ticket: ${channelLink}`,
        embeds: [{
          description: embedDescriptions.join('\n\n'),
        }],
        allowedMentions: {
          roles: [staffRoleId],
        },
      });

      // creates the thread for discussion
      const discussionThread = await voteChannel.threads.create({
        name: `${channel.name} discussion`,
        invitable: false,
        reason: "For discussing the appeal",
        type: ChannelType.PublicThread,
      });

      await discussionThread.send({
        content: `Please discuss this appeal.\n\nVote started on ${timestampCheck()}\nCreated by <@${interaction.user.id}>`,
        embeds: [{
          description: embedDescriptions.join('\n\n'),
        }],
        allowedMentions: {
          roles: [staffRoleId, interaction.user.id],
        }
      });

      // adds the reactions for voting on the form
      await voteMessage.react('✅');
      await voteMessage.react('❎');

      const voteMessageLink = `${link}${voteChannelId}/${voteMessage.id}`;

      await interaction.editReply(`Vote created at ${voteMessageLink}\nDiscussion thread created at ${link}${discussionThread.id}`)

      // after 24 hours do a thing
      setTimeout(async () => {
        try {
          // gets reactions from the form post
          const reactions = voteMessage.reactions.cache;

          // gets the reactions
          const tickReaction = reactions.get('✅');
          const crossReaction = reactions.get('❎');

          // counts the reactions
          const tickCount = tickReaction ? tickReaction.count : 0;
          const crossCount = crossReaction ? crossReaction.count : 0;

          let resultMessage = ''; // empty string for output of `if appeal = accepted (if tick bigger than cross) then resultMessage = accepted`

          // checks if tied, accepted, or rejected. also sends a ping to revote. no 2nd timer added yet for 2nd vote that's way too hard
          if (crossCount === tickCount) {
            // if tied then do the thing to say it's tied
            await discussionThread.send({
              content: `<@&${staffRoleId}> The appeal is tied. Please discuss and vote again.`,
              embeds: [{
                description: embedDescriptions.join('\n\n'),
              }],
              allowedMentions: {
                roles: [staffRoleId],
              },
            });
            resultMessage = 'revote'
            return;
          } else if (tickCount > crossCount) {
            // if tick wins then accepted
            resultMessage = 'accepted';
            const acceptedChannel = interaction.guild?.channels.cache.get(acceptedChannelId);

            if (!acceptedChannel) {
              console.error('Unable to find accepted appeals log channel.');
            } else if (acceptedChannel.isTextBased()) {
              const embedContent = `# Appeal was accepted.\n\n${embedDescriptions.join('\n\n')}\nLink to original vote message: ${voteMessageLink}\nLink to original ticket: ${channelLink}\nVote finished on ${timestampCheck()}`;
              (acceptedChannel as TextChannel).send({
                content: `<@&${staffRoleId}>`,
                embeds: [{
                  description: embedContent,
                  color: 0x00ff00 // hex colour for green
                }],
                allowedMentions: {
                  roles: [staffRoleId]
                }
              });
            }
          } else {
            // otherwise, not tied, not accepted so rejected
            resultMessage = 'rejected';
            const rejectedChannel = interaction.guild?.channels.cache.get(rejectedChannelId)

            if (!rejectedChannel) {
              console.error('Unable to find rejected appeals log channel.');
            } else if (rejectedChannel.isTextBased()) {
              const embedContent = `# Appeal was rejected.\n\n${embedDescriptions.join('\n\n')}\nLink to original vote message: ${voteMessageLink}\nLink to original ticket: ${channelLink}\nVote finished on ${timestampCheck()}`;
              (rejectedChannel as TextChannel).send({
                content: `<@&${staffRoleId}>`,
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
        } catch (error) {
          console.error("Error sending reaction counts or posting to channel:", error);
        }
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error("Error finding channel/category");
  }
};

// this is the end of an era
 
// Terrible Command Handler

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    try {
      // Slash Commands
      switch (interaction.commandName) {
        case "startvote":
          await COMMAND_startvote(interaction);
          return
        // Error
        default:
          await interaction.reply({
            content: "Unknown command.",
          });
      }
    } catch (error) {
      try {
        await interaction.reply({
          content: "An error has occured.",
          ephemeral: isInteractionOutsideStaffCategory(interaction),
        });
      } catch {
        await interaction.editReply({
          content: "An error has occured",
        });
      }
      console.error(error);
    }
  }
});

// When bot is ready
client.on("ready", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`${client.user?.username} is ready`)
});

// Login
client.login(token);
