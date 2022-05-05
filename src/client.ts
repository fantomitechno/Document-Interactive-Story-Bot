import { Client, ClientOptions } from 'higa';
import { Database } from 'sqlite3';
import { Button, Command } from './bases';
import { readdirSync } from 'fs';

export class Bot extends Client {
  cache = new Map();

  commands = new Map<string, Command>();
  buttons = new Map<string, Button>();

  appId = '';

  constructor(options: ClientOptions) {
    super(options);
  }

  db = new Database('database.db');

  init = async () => {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS start (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video TEXT,
        description TEXT,
        choice_1 INTEGER DEFAULT NULL,
        choice_2 INTEGER DEFAULT NULL,
        choice_3 INTEGER DEFAULT NULL,
        choice_4 INTEGER DEFAULT NULL
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_id INTEGER,
        video TEXT,
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
        this.buttons.set(button ?? '', button);
      }
    });

    this.appId = (await this.user.getCurrentUser()).id;
  };

  syncCommands = async () => {
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
