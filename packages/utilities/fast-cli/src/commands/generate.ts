import { Command, flags } from "@oclif/command";
import { createEnv } from "yeoman-environment";

export interface Options {
    name: string;
    defaults?: boolean;
    force?: boolean;
}

export default class Generate extends Command {
    static description: string = "Generates a new FAST resource (i.e. Component)";

    static flags: any = {
        defaults: flags.boolean({ description: "use defaults for every setting" }),
        force: flags.boolean({ description: "overwrite existing files" }),
    };

    static args: any = [
        {
            name: "name",
            description: "The desired name of your resource",
            required: true,
        },
    ];

    protected generate(generatorOptions: any = {}): void {
        const env = createEnv();

        env.register(require.resolve("../generators/component"), "fast:component");

        env.run("fast:component", generatorOptions);
    }

    async run(): Promise<void> {
        const { flags, args } = this.parse(Generate);
        this.generate({
            name: args.name,
            defaults: flags.defaults,
            force: flags.force,
        } as Options);
    }
}
