import { Command } from "@oclif/command";
import { definitions } from "../definitions";

export interface Options {
    name: string;
}

export default class Definitions extends Command {
    static args: any = [
        {
            name: "name",
            description: "The desired name of your resource",
            required: true,
        },
    ];

    async run(): Promise<void> {
        const { args } = this.parse(Definitions);
        definitions({
            name: args.name,
        } as Options);
    }
}
