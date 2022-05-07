import { SelectMenu } from '../bases';
import { next } from '../utils';

export default new SelectMenu('start_choose', (client, interaction) => {
  client.cache.set(
    interaction.member?.user.id ?? '',
    <string>(<unknown>interaction.data?.values[0])
  );
  next(client, interaction, <string>(<unknown>interaction.data?.values[0]));
  return;
});
