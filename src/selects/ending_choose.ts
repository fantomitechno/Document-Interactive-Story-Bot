import axios from 'axios';
import { Embed } from 'higa';
import { SelectMenu } from '../bases';

export default new SelectMenu('ending_choose', async (client, interaction) => {
  const start = <string>(<unknown>interaction.data?.values[0]);
  await axios
    .get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${start}&key=${process.env.YOUTUBE_API_KEY}`
    )
    .then((res) => {
      const title = res.data.items[0].snippet.title;
      client.db.all(
        `SELECT * FROM ends WHERE start = '${start}'`,
        async (_err, rows) => {
          client.interaction.createInteractionResponse(
            interaction.id,
            interaction.token,
            {
              type: 6
            }
          );
          if (rows.length === 0) {
            client.channel.editMessage(
              interaction.channel_id ?? '',
              interaction.message?.id ?? '',
              {
                content: `No endings found for **${title}**`
              }
            );
          } else {
            const embed: Embed = {
              title: `Endings for **${title}**:`,
              fields: []
            };
            for (const row of rows) {
              await axios
                .get(
                  `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${row.video}&key=${process.env.YOUTUBE_API_KEY}`
                )
                .then((res) => {
                  const title = res.data.items[0].snippet.title;
                  embed.fields?.push({
                    name: row.name,
                    value: `[${title}](https://youtube.be/${row.video})`,
                    inline: true
                  });
                });
            }
            client.channel.editMessage(
              interaction.channel_id ?? '',
              interaction.message?.id ?? '',
              {
                content: ``,
                embeds: [embed],
                components: []
              }
            );
          }
        }
      );
    });
});
