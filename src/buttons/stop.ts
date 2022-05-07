import { Button } from '../bases';

export default new Button('stop', (client, interaction) => {
  client.interaction.createInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: 6
    }
  );
  client.channel.editMessage(
    interaction.message?.channel_id ?? '',
    interaction.message?.id ?? '',
    {
      content: 'You stopped your session for now ;)',
      components: []
    }
  );
  client.cache.delete(interaction.member?.user.id ?? '');
  return;
});
