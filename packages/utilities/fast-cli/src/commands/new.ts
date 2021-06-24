import * as path from "path";
import { Command } from "@oclif/command";

const { spawn } = require("child_process");

// TODO: Path to be updated to local or repo
const template = path.join(__dirname, "../../../../../../templates/new");

export default class New extends Command {
    static description: string = "Scaffolds out a new FAST design system project";

    static args: any = [
        {
            name: "projectName",
            description: "The desired name of your project",
            default: "my-project",
        },
    ];

    async run(): Promise<void> {
        const { args } = this.parse(New);
        spawn("npx", ["makes", template, args.projectName], {
            stdio: "inherit",
            shell: true,
        });
    }
}
