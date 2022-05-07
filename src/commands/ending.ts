import axios from 'axios';
import { SelectMenu } from 'higa';
import { Command } from '../bases';

export default new Command(
  {
    name: 'ending',
    description: 'See the different endings of a Markiplier adventure'
  },
  (client, interaction) => {
    client.db.all(`SELECT * FROM start`, async (_err, rows) => {
      let menu: SelectMenu;
      if (!rows.length) {
        menu = {
          disabled: true,
          custom_id: 'ending_choose',
          placeholder: 'No video created for now',
          type: 3,
          options: [
            {
              value: 'nop',
              label: 'No video'
            }
          ]
        };
      } else {
        menu = {
          custom_id: 'ending_choose',
          placeholder: 'Select a video',
          type: 3,
          options: []
        };
        for (const r of rows) {
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
      client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 4,
          data: {
            content: 'Choose a video to get the endings for',
            components: [
              {
                type: 1,
                components: [menu]
              }
            ]
          }
        }
      );
    });
  }
);
