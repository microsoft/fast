import * as path from "path";
import * as _ from "lodash";
import * as Generator from "yeoman-generator";

import { Options } from "../commands/generate";

class ComponentGenerator extends Generator {
    constructor(args: any, public options: Options) {
        super(args, options);
    }

    async prompting(): Promise<void> {
        this.log(path.join(__dirname, "../../templates"));
    }

    writing(): void {
        this.sourceRoot(path.join(__dirname, "../../templates/component"));
        const componentPath = this.destinationPath(
            `src/${this.options.name}/${this.options.name}.ts`
        );
        const opts = { ...this.options, _, type: "component", path: componentPath };

        this.fs.copyTpl(
            this.templatePath("_component.stories.ts.ejs"),
            this.destinationPath(
                `src/${this.options.name}/${this.options.name}.stories.ts`
            ),
            opts
        );

        this.fs.copyTpl(
            this.templatePath("_component.styles.ts.ejs"),
            this.destinationPath(
                `src/${this.options.name}/${this.options.name}.styles.ts`
            ),
            opts
        );

        this.fs.copyTpl(
            this.templatePath("base.html"),
            this.destinationPath(`src/${this.options.name}/scenario/base.html`),
            opts
        );

        this.fs.copyTpl(
            this.templatePath("index.html"),
            this.destinationPath(`src/${this.options.name}/fixtures/index.html`)
        );

        this.fs.copyTpl(
            this.templatePath("index.ts.ejs"),
            this.destinationPath(`src/${this.options.name}/index.ts`),
            opts
        );
    }
}

export = ComponentGenerator;
