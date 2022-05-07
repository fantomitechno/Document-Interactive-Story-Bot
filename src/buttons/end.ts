import { Button } from '../bases';

export default new Button('end', (client, interaction) => {
  client.interaction.createInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: 9,
      data: {
        custom_id: `end#${interaction.message?.id}#${
          interaction.message?.channel_id
        }#${interaction.data?.custom_id?.replace(`end_`, '')}`,
        title: 'Name the ending!',
        components: [
          {
            type: 1,
            components: [
              {
                type: 4,
                custom_id: 'Name',
                label: 'Name',
                style: 1
              }
            ]
          }
        ]
      }
    }
  );
  client.channel.editMessage(
    interaction.message?.channel_id ?? '',
    interaction.message?.id ?? '',
    {
      content: 'You setted this as an ending!',
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Name the end',
              custom_id: interaction.data?.custom_id ?? '',
              style: 4
            }
          ]
        }
      ]
    }
  );
  client.db.run(
    `UPDATE videos SET choice_1 = 'null' WHERE video = '${interaction.data?.custom_id?.replace(
      `end_`,
      ''
    )}'`
  );
  return;
});
