const { Plugin } = require('powercord/entities');
const { getModule, messages: { receiveMessage } } = require('powercord/webpack');
const { joinHypeSquadOnline } = getModule(['joinHypeSquadOnline'], false);
const { getChannelId } = getModule(['getLastSelectedChannelId'], false);
const { BOT_AVATARS } = getModule(['BOT_AVATARS'], false);
const { createBotMessage } = getModule(['createBotMessage'], false);
BOT_AVATARS.house_switcher = 'https://i.imgur.com/8IpqDKr.png';

module.exports = class Swap extends Plugin {
   startPlugin() {
      powercord.api.commands.registerCommand({
         command: 'house',
         aliases: ['hypesquad'],
         description: 'Allows you to change Hypesquad Houses',
         usage: '{c} (Brilliance, Bravery, Balance)',
         executor: async (args) => {
            if (!args[0] || !['bravery', 'brilliance', 'balance'].includes(args[0].toLowerCase())) {
               const receivedMessage = createBotMessage(getChannelId(), {});
               receivedMessage.author.username = 'House Switcher';
               receivedMessage.author.avatar = 'house_switcher';
               receivedMessage.content = 'Invalid option or none provided. Options: **Brilliance, Bravery, Balance**';
               return receiveMessage(receivedMessage.channel_id, receivedMessage);
            }

            let house = args[0].toLowerCase();
            return this.switchHouse(house);
         }
      });
   }

   switchHouse(house) {
      let houses = {
         bravery: 'HOUSE_1',
         brilliance: 'HOUSE_2',
         balance: 'HOUSE_3'
      };

      joinHypeSquadOnline({ houseID: houses[house] });

      const receivedMessage = createBotMessage(getChannelId(), {});
      receivedMessage.author.username = 'House Switcher';
      receivedMessage.author.avatar = 'house_switcher';

      receivedMessage.content = `Your house has been swapped to **${house.charAt(0).toUpperCase()}${house.slice(1, house.length)}**`;

      return receiveMessage(receivedMessage.channel_id, receivedMessage);
   }

   pluginWillUnload() {
      powercord.api.commands.unregisterCommand('house');
   }
};
