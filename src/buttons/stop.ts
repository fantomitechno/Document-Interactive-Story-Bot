import { Button } from '../bases';

export default new Button('stop', (client, interaction) => {
  client.interaction.createInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: 4,
      data: {
        content: 'You stopped your session for now ;)'
      }
    }
  );
  client.cache.splice(
    client.cache.indexOf(interaction.member?.user.id ?? ''),
    1
  );
  return;
});
