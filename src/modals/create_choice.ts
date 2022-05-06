import { TextInput } from 'higa';
import { Modal } from '../bases';
import { next } from '../utils';

export default new Modal('create_choice', (client, interaction) => {
  if (interaction.data?.components?.length !== 2) return;
  const videoTextInput = <TextInput>(
    interaction.data.components[0].components[0]
  );
  const descriptionTextInput = <TextInput>(
    interaction.data.components[1].components[0]
  );
  const video = videoTextInput.value;
  const description = descriptionTextInput.value;
  if (!video?.startsWith(`https://youtu.be/`)) {
    client.interaction.createInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: 4,
        data: {
          content: 'Invalid video link'
        }
      }
    );
    return;
  }
  const id = video.replace(`https://youtu.be/`, ``);
  client.db.get(`SELECT * FROM videos WHERE video = ${id}`, (_err, row) => {
    if (!row)
      client.db.run(
        `INSERT INTO videos (video, description) VALUES ('${id}', "${description}")`
      );
    client.db.get(
      `SELECT choice_1, choice_2, choice_3, choice_4 FROM videos WHERE video = '${interaction.data?.custom_id?.replace(
        'create_choice_',
        ''
      )}'`,
      (_err, row) => {
        if (!row.choice_1)
          client.db.run(
            `UPDATE videos SET choice_1 = '${id}' WHERE video = '${interaction.data?.custom_id?.replace(
              `create_choice_`,
              ''
            )}'`
          );
        else if (!row.choice_2)
          client.db.run(
            `UPDATE videos SET choice_2 = '${id}' WHERE video = '${interaction.data?.custom_id?.replace(
              `create_choice_`,
              ''
            )}'`
          );
        else if (!row.choice_3)
          client.db.run(
            `UPDATE videos SET choice_3 = '${id}' WHERE video = ${interaction.data?.custom_id?.replace(
              `create_choice_`,
              ''
            )}`
          );
        else if (!row.choice_4)
          client.db.run(
            `UPDATE videos SET choice_4 = '${id}' WHERE video = ${interaction.data?.custom_id?.replace(
              `create_choice_`,
              ''
            )}`
          );
        else throw new Error('Too many choices');
      }
    );
    next(client, interaction, id);
  });
});
