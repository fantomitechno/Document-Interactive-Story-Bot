import { config } from 'dotenv';

import { Button, Modal, SelectMenu } from './bases';
import { Bot } from './client';

config();

const client = new Bot({
  token: process.env.DISCORD ?? '',
  tokenType: 'Bot',
  version: '9'
});

client.on('READY', async () => {
  client.init();

  const user = await client.user.getCurrentUser();
  console.log(`Logged in as ${user.username}!`);

  client.syncCommands();
});

client.on('INTERACTION_CREATE', (interaction) => {
  if (interaction.type === 2) {
    const command = client.commands.get(interaction.data?.name ?? '');
    if (!command) return;

    command.run(client, interaction);
  } else if (interaction.type === 3) {
    if (interaction.data?.component_type === 2) {
      const buttons = client.buttons.keys();
      let buttonCommand: Button | undefined;
      for (const button of buttons) {
        if (interaction.data?.custom_id?.startsWith(button)) {
          buttonCommand = client.buttons.get(button);
          break;
        }
      }
      if (!buttonCommand) return;

      buttonCommand.run(client, interaction);
    } else if (interaction.data?.component_type === 3) {
      const selects = client.selects.keys();
      let selectCommand: SelectMenu | undefined;
      for (const select of selects) {
        if (interaction.data?.custom_id?.startsWith(select)) {
          selectCommand = client.selects.get(select);
          break;
        }
      }
      if (!selectCommand) return;

      selectCommand.run(client, interaction);
    }
  } else if (interaction.type === 5) {
    const modals = client.modals.keys();
    let modalCommand: Modal | undefined;
    for (const modal of modals) {
      if (interaction.data?.custom_id?.startsWith(modal)) {
        modalCommand = client.modals.get(modal);
        break;
      }
    }
    if (!modalCommand) return;

    modalCommand.run(client, interaction);
  }
});
