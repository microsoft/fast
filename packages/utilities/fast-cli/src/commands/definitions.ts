import { Command } from "@oclif/command";
import { definitions } from "../definitions";

export default class Defintions extends Command {
    async run(): Promise<void> {
        definitions();
    }
}
