import { SelectMenu, TextInput } from 'higa';
import { config } from 'dotenv';
config();
import axios from 'axios';
import { db } from './database';
import { Bot } from './client';

const cache: string[] = [];

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
    const button = client.buttons.get;
  } else if (interaction.type === 5 && interaction.data?.components) {
    if (interaction.data?.custom_id === 'start_add_form') {
      const videoTextInput = <TextInput>(
        interaction.data.components[0].components[0]
      );
      const descriptionTextInput = <TextInput>(
        interaction.data.components[1].components[0]
      );
      const video = videoTextInput.value;
      const description = descriptionTextInput.value;
      if (!video?.startsWith(`https://youtu.be/`)) {
        client.interaction.createInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: 4,
            data: {
              content: 'Invalid video link'
            }
          }
        );
        return;
      }
      const id = video.replace(`https://youtu.be/`, ``);
      db.get(`SELECT * FROM start WHERE video = ${id}`, (_err, row) => {
        if (row) {
          client.interaction.createInteractionResponse(
            interaction.id,
            interaction.token,
            {
              type: 4,
              data: {
                content: 'Already existing video link'
              }
            }
          );
          return;
        }
        db.run(
          `INSERT INTO start (video, description) VALUES ('${id}', '${description}')`
        );
        client.interaction.createInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: 4,
            data: {
              content: 'Registred start point...'
            }
          }
        );
      });
    }
  }
});
