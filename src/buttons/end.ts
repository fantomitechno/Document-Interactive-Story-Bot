import { Button } from '../bases';

export default new Button('end', (client, interaction) => {
  client.interaction.createInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: 4,
      data: {
        content: 'You setted this as an ending!'
      }
    }
  );
  client.db.run(
    `UPDATE videos SET choice_1 = 'null' WHERE video = '${interaction.data?.custom_id?.replace(
      `end_`,
      ''
    )}'`
  );
  client.cache.splice(
    client.cache.indexOf(interaction.member?.user.id ?? ''),
    1
  );
  return;
});
