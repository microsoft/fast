import { Command } from "@oclif/command";
import * as path from "path";

const { spawn } = require("child_process");

const template = path.join(__dirname, "../templates/new");

export default class New extends Command {
    static description = "Scaffolds out a new FAST design system project";

    static args = [
        {
            name: "projectName",
            description: "The desired name of your project",
            default: "my-project",
        },
    ];

    async run() {
        const { args } = this.parse(New);
        spawn("npx", ["makes", template, args.projectName], {
            stdio: "inherit",
            shell: true,
        });
    }
}
