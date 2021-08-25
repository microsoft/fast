import * as path from "path";
import { Command } from "@oclif/command";
import { createEnv } from "yeoman-environment";
import { definitions } from "../definitions";

const { spawn } = require("child_process");
export interface Options {
    name: string;
}

// TODO: Path to be updated to local or repo
const template = path.join(__dirname, "../../templates/new");

export default class New extends Command {
    static description: string = "builds a scaffold for a new FAST project";

    static args: any = [
        {
            name: "projectName",
            description: "The desired name of your project",
            default: "my-project",
        },
    ];

    protected generateDefinitions(options: any = {}): void {
        const env = createEnv();

        env.register(require.resolve("../generators/definitions"), "fast:definitions");

        env.run("fast:definitions", options);
    }

    run(): Promise<void> {
        return new Promise<void>((resolve: any, reject) => {
            const { args } = this.parse(New);
            const p = spawn("npx", ["makes", template, args.projectName], {
                stdio: "inherit",
                shell: true,
            });
            p.on("close", () => {
                definitions({
                    name: args.projectName,
                } as Options);
                resolve();
            });
        });
    }
}
