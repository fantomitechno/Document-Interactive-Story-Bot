import { SelectMenu } from '../bases';
import { next } from '../utils';

export default new SelectMenu('start_choose', (client, interaction) => {
  next(client, interaction, <string>(<unknown>interaction.data?.values[0]));
  return;
});
