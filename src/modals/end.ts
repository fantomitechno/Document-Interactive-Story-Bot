import { TextInput } from 'higa';
import { Modal } from '../bases';

export default new Modal('end', (client, interaction) => {
  if (interaction.data?.components?.length !== 1) return;
  const nameInput = <TextInput>interaction.data.components[0].components[0];
  const name = <string>nameInput.value;
  const custom_id_info =
    interaction.data.custom_id?.replace('end#', '').split('#') ?? [];
  const video = custom_id_info[2];
  const channel_id = custom_id_info[1];
  const msg_id = custom_id_info[0];
  const start = client.cache.get(interaction.member?.user.id ?? '');
  client.db.get(`SELECT * FROM ends WHERE video = '${video}'`, (_err, row) => {
    client.cache.delete(interaction.member?.user.id ?? '');
    if (row) {
      client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 4,
          data: {
            content: 'Already existing ending :thinking:'
          }
        }
      );
      client.cache.delete(interaction.member?.user.id ?? '');
      return;
    } else {
      client.db.run(
        `INSERT INTO ends (video, name, start) VALUES ('${video}', "${name}", "${start}")`
      );
      client.channel.editMessage(channel_id, msg_id, {
        content: `**${name}** has been added to the endings!`,
        components: []
      });
      client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 6
        }
      );
    }
  });
});
