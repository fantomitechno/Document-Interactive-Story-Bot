import { Button } from '../bases';

export default new Button('create_start', (client, interaction) => {
  client.interaction.createInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: 9,
      data: {
        title: 'Create a starting point',
        custom_id: 'create_start',
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
  return;
});
