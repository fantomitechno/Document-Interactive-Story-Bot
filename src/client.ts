import { Client, ClientOptions } from 'higa';
import { Database } from 'sqlite3';
import { Button, Command, Modal, SelectMenu } from './bases';
import { readdirSync } from 'fs';

export class Bot extends Client {
  cache = new Map();

  commands = new Map<string, Command>();
  buttons = new Map<string, Button>();
  modals = new Map<string, Modal>();
  selects = new Map<string, SelectMenu>();

  appId = '';

  constructor(options: ClientOptions) {
    super(options);
  }

  db = new Database('database.db');

  init = async () => {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS start (
        video TEXT PRIMARY KEY,
        description TEXT,
        choice_1 INTEGER DEFAULT NULL,
        choice_2 INTEGER DEFAULT NULL,
        choice_3 INTEGER DEFAULT NULL,
        choice_4 INTEGER DEFAULT NULL
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        video TEXT PRIMARY KEY,
        description TEXT,
        choice_1 INTEGER DEFAULT NULL,
        choice_2 INTEGER DEFAULT NULL,
        choice_3 INTEGER DEFAULT NULL,
        choice_4 INTEGER DEFAULT NULL
      );
    `);

    const rootDir = process.argv[3] === 'true' ? './src' : './build';

    const pathCommands = `${rootDir}/commands`;

    readdirSync(pathCommands).forEach(async (file) => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const { default: command } = await import(`./commands/${file}`);
        this.commands.set(command.data?.name ?? '', command);
      }
    });

    const pathButtons = `${rootDir}/buttons`;
    readdirSync(pathButtons).forEach(async (file) => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const { default: button } = await import(`./buttons/${file}`);
        this.buttons.set(button.custom_id_start ?? '', button);
      }
    });

    const pathModals = `${rootDir}/modals`;
    readdirSync(pathModals).forEach(async (file) => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const { default: modal } = await import(`./modals/${file}`);
        this.modals.set(modal.custom_id_start ?? '', modal);
      }
    });

    const pathSelects = `${rootDir}/selects`;
    readdirSync(pathSelects).forEach(async (file) => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const { default: select } = await import(`./selects/${file}`);
        this.selects.set(select.custom_id_start ?? '', select);
      }
    });
  };

  syncCommands = async () => {
    this.appId = (await this.user.getCurrentUser()).id;
    for (const c of this.commands.values()) {
      this.applicationCommand.createGlobalApplicationCommand(
        this.appId,
        c.data
      );
    }

    const currentCommands =
      await this.applicationCommand.getGlobalApplicationCommands(this.appId);

    for (const c of currentCommands) {
      if (!this.commands.has(c.name)) {
        this.applicationCommand.deleteGlobalApplicationCommand(
          this.appId,
          c.id
        );
      }
    }
  };
}
