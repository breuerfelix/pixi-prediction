import {EventSystem} from './event-system';

interface Command {
  timestamp: number;
  command: string;
}

interface CommandCallback {
  callback: CommandFunction;
  command: string;
}

type CommandFunction = (command: string) => void;

export enum CommandEvent {
  New,
}

export class Commander extends EventSystem<CommandEvent> {
  commands = new Array<Command>();
  subscriber = new Array<CommandCallback>();

  new(timestamp: number, command: string): void {
    this.commands.push({ timestamp, command });

    // sort ascending
    this.commands.sort((a, b) => a.timestamp - b.timestamp);
    this.emit(CommandEvent.New, command);
  }

  subscribe(command: string, callback: CommandFunction): () => void {
    const obj = { command, callback };
    this.subscriber.push(obj);

    return (): CommandCallback[] =>
      this.subscriber.splice(this.subscriber.indexOf(obj, 0), 1);
  }

  execute(lastUpdate: number, delta: number): void {
    this.commands
      .filter(c => c.timestamp > lastUpdate && c.timestamp <= lastUpdate + delta)
      .forEach(c => {
        this.subscriber
          .filter(s => c.command.startsWith(s.command))
          .forEach(s => s.callback(c.command));
      });
  }

  clear(timestamp: number): void {
    this.commands = this.commands.filter(c => c.timestamp >= timestamp);
  }
}
