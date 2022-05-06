import { TextInput } from 'higa';
import { Modal } from '../bases';
import { next } from '../utils';

export default new Modal('create_start', (client, interaction) => {
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
  client.db.get(`SELECT * FROM start WHERE video = ${id}`, (_err, row) => {
    if (row) {
      client.interaction.createInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: 4,
          data: {
            content: 'Already existing video link'
          }
        }
      );
      return;
    }
    client.db.run(
      `INSERT INTO start (video, description) VALUES ('${id}', "${description}")`
    );
    client.db.run(
      `INSERT INTO videos (video, description) VALUES ('${id}', "${description}")`
    );
    next(client, interaction, id);
  });
});
