import { Command } from "@oclif/command";
import { createEnv } from "yeoman-environment";
export interface Options {
    name: string;
}

export default class Generate extends Command {
    static description: string = "Generates a new FAST resource (i.e. Component)";

    static args: any = [
        {
            name: "name",
            description: "The desired name of your resource",
            required: true,
        },
    ];

    private generate(generatorOptions: any = {}): void {
        const env = createEnv();

        env.register(require.resolve("../generators/component"), "fast:component");

        env.run("fast:component", generatorOptions);
    }

    async run(): Promise<void> {
        const { args } = this.parse(Generate);
        this.generate({
            name: args.name,
        } as Options);
    }
}
