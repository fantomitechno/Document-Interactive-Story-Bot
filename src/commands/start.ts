import axios from 'axios';
import { SelectMenu } from 'higa';
import { Command } from '../bases';

export default new Command(
  {
    name: 'start',
    description: 'Starts a session on a Markiplier adventure'
  },
  (client, interaction) => {
    if (client.cache.has(interaction.member?.user.id ?? '')) {
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
    client.cache.set(interaction.member?.user.id ?? '', '');
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
    client.db.all(
      `SELECT * FROM start`,
      async (
        _err,
        row: {
          video: string;
          description: string;
        }[]
      ) => {
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
            custom_id: 'start_choose',
            placeholder: 'Select a starting point',
            type: 3,
            options: []
          };
          for (const r of row) {
            await axios
              .get(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${r.video}&key=${process.env.YOUTUBE_API_KEY}`
              )
              .then((res) => {
                const title = res.data.items[0].snippet.title;
                menu.options.push({
                  label: title,
                  value: r.video,
                  description: r.description
                });
              });
          }
        }
        await client.interaction.editOriginalInteractionResponse(
          interaction.token,
          {
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
                    custom_id: 'create_start',
                    style: 1
                  }
                ]
              }
            ],
            content: 'Select a starting point'
          }
        );
      }
    );
    return;
  }
);
