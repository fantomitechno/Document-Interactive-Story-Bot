import { Button } from '../bases';

export default new Button('create_choice', (client, interaction) => {
  client.interaction.createInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: 9,
      data: {
        title: 'Create a new choice',
        custom_id: interaction.data?.custom_id,
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
