import { SelectMenu } from '../bases';

export default new SelectMenu('start_choose', (client, interaction) => {
  client.interaction.createInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: 4,
      data: {
        content: `Choosed ${interaction.data?.values[0]}`
      }
    }
  );
  return;
});
