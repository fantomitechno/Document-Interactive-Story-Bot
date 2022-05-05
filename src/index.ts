import { Client, InteractionCallbackType, SelectMenu, TextInput } from 'higa';
import { config } from 'dotenv';
config();
import axios from 'axios';
import { db, init } from './database';

const cache: string[] = [];

const client = new Client({
  token: process.env.DISCORD ?? '',
  tokenType: 'Bot',
  version: '9'
});

client.on('READY', async () => {
  init();

  const user = await client.user.getCurrentUser();
  console.log(`Logged in as ${user.username}!`);

  client.applicationCommand.createGlobalApplicationCommand(user.id, {
    name: 'start',
    description: 'Starts a session on a Markiplier adventure'
  });
  client.applicationCommand.createGlobalApplicationCommand(user.id, {
    name: 'dev',
    description: '...'
  });
});

client.on('INTERACTION_CREATE', (interaction) => {
  if (interaction.type === 2) {
    if (interaction.data?.name === 'start') {
      if (cache.includes(interaction.member?.user.id ?? '')) {
        client.interaction.createInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: 4,
            data: {
              content: 'Already in a session'
            }
          }
        );
        return;
      }
      cache.push(interaction.member?.user.id ?? '');
      client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 4,
          data: {
            content: 'Starting a session...'
          }
        }
      );
      db.all(`SELECT * FROM start`, async (_err, row) => {
        let menu: SelectMenu;
        if (!row.length) {
          menu = {
            disabled: true,
            custom_id: 'start_select',
            placeholder: 'No starting point created for now',
            type: 3,
            options: [
              {
                value: 'nop',
                label: 'No starting point'
              }
            ]
          };
        } else {
          menu = {
            custom_id: 'start_select',
            placeholder: 'Select a starting point',
            type: 3,
            options: []
          };
          for (const r of row) {
            // get a video title on youtube from it's id using axios
            await axios
              .get(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${r.video}&key=${process.env.YOUTUBE_API_KEY}`
              )
              .then((res) => {
                const title = res.data.items[0].snippet.title;
                menu.options.push({
                  label: title,
                  value: r.id
                });
              });
          }
        }
        client.interaction.editOriginalInteractionResponse(interaction.token, {
          components: [
            {
              type: 1,
              components: [menu]
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  label: 'Add a starting point',
                  custom_id: 'start_add',
                  style: 1
                }
              ]
            }
          ],
          content: 'Select a starting point'
        });
      });
      return;
    } else if (interaction.data?.name === 'dev') {
      client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 4,
          data: {
            content: `cache : ${cache.join(';')}`,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 3,
                    options: [
                      {
                        label: 'hi',
                        value: 'hi'
                      }
                    ],
                    custom_id: 't'
                  }
                ]
              }
            ]
          }
        }
      );
    }
  } else if (interaction.type === 3) {
    if (interaction.data?.custom_id === 'start_add') {
      client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 9,
          data: {
            title: 'Create a starting point',
            custom_id: 'start_add_form',
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    label: 'Video link (like https://youtu.be/<ID>)',
                    style: 1,
                    custom_id: 'video_link'
                  }
                ]
              },
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    label: 'Description',
                    style: 1,
                    custom_id: 'video_desc'
                  }
                ]
              }
            ]
          }
        }
      );
    }
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
