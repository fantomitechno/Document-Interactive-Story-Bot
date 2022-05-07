import axios from 'axios';
import { Interaction, SelectMenu } from 'higa';
import { Bot } from './client';

const next = async (client: Bot, interaction: Interaction, video: string) => {
  await axios
    .get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${video}&key=${process.env.YOUTUBE_API_KEY}`
    )
    .then(async (res) => {
      const title = res.data.items[0].snippet.title;
      await client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 5
        }
      );
      await client.channel.editMessage(
        interaction.message?.channel_id ?? '',
        interaction.message?.id ?? '',
        {
          content: `You choosed: ${title}\n\n<https://youtu.be/${video}>`,
          components: []
        }
      );
      client.db.get(
        `SELECT choice_1, choice_2, choice_3, choice_4 FROM videos WHERE video = '${video}'`,
        async (_err, row) => {
          if (row?.choice_1 !== 'null') {
            let menu: SelectMenu;
            const buttons = [
              {
                type: 2,
                label: 'Add a choice',
                custom_id: 'create_choice_' + video,
                style: 1
              },
              {
                type: 2,
                label: 'Stop',
                custom_id: 'stop',
                style: 4
              }
            ];
            if (
              !row.choice_1 &&
              !row.choice_2 &&
              !row.choice_3 &&
              !row.choice_4
            ) {
              menu = {
                disabled: true,
                custom_id: 'next_select',
                placeholder: 'No choices for this video',
                type: 3,
                options: [
                  {
                    value: 'nop',
                    label: 'No videos'
                  }
                ]
              };
              buttons.push({
                type: 2,
                label: 'Set as End',
                custom_id: 'end_' + video,
                style: 4
              });
            } else {
              menu = {
                custom_id: 'next_select',
                placeholder: `What's your choice?`,
                type: 3,
                options: []
              };
              if (row.choice_1) {
                await axios
                  .get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${row.choice_1}&key=${process.env.YOUTUBE_API_KEY}`
                  )
                  .then((res) => {
                    const title = res.data.items[0].snippet.title;
                    menu.options.push({
                      value: row.choice_1,
                      label: title
                    });
                  });
              }
              if (row.choice_2) {
                await axios
                  .get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${row.choice_2}&key=${process.env.YOUTUBE_API_KEY}`
                  )
                  .then((res) => {
                    const title = res.data.items[0].snippet.title;
                    menu.options.push({
                      value: row.choice_2,
                      label: title
                    });
                  });
              }
              if (row.choice_3) {
                await axios
                  .get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${row.choice_3}&key=${process.env.YOUTUBE_API_KEY}`
                  )
                  .then((res) => {
                    const title = res.data.items[0].snippet.title;
                    menu.options.push({
                      value: row.choice_3,
                      label: title
                    });
                  });
              }
              if (row.choice_4) {
                await axios
                  .get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${row.choice_4}&key=${process.env.YOUTUBE_API_KEY}`
                  )
                  .then((res) => {
                    const title = res.data.items[0].snippet.title;
                    menu.options.push({
                      value: row.choice_4,
                      label: title
                    });
                  });
              }
            }

            client.interaction.editOriginalInteractionResponse(
              interaction.token,
              {
                content: `What's your choice?`,
                components: [
                  {
                    type: 1,
                    components: [menu]
                  },
                  {
                    type: 1,
                    components: buttons
                  }
                ]
              }
            );
          } else {
            client.db.get(
              `SELECT name FROM ends WHERE video = '${video}'`,
              (_err, row) => {
                if (!row) {
                  client.interaction.editOriginalInteractionResponse(
                    interaction.token,
                    {
                      content: `No choices for this video`,
                      components: [
                        {
                          type: 1,
                          components: [
                            {
                              type: 2,
                              label:
                                'Name the end (will trigger the ending protocol)',
                              custom_id: 'end_' + video,
                              style: 4
                            }
                          ]
                        }
                      ]
                    }
                  );
                } else {
                  client.cache.delete(interaction.member?.user.id ?? '');
                  client.interaction.editOriginalInteractionResponse(
                    interaction.token,
                    {
                      content: `You've got an ending!\n\n**${row.name}**`
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
};

export { next };
