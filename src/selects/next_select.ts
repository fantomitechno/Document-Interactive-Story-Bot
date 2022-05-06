import { SelectMenu } from '../bases';
import { next } from '../utils';

export default new SelectMenu('next_select', (client, interaction) => {
  next(client, interaction, <string>(<unknown>interaction.data?.values[0]));
  return;
});
