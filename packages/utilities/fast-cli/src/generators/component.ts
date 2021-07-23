import * as path from "path";
import * as _ from "lodash";
import * as Generator from "yeoman-generator";

import { Options } from "../commands/generate";

class ComponentGenerator extends Generator {
    pjson!: any

    constructor(args: any, public options: Options) {
        super(args, options);
        this.pjson = this.fs.readJSON(this.destinationPath('package.json'), {});
    }

    async prompting(): Promise<void> {
        this.log(this.pjson.namespace);
        this.log(path.join(__dirname, "../../templates"));
    }

    writing(): void {
        this.sourceRoot(path.join(__dirname, "../../templates/component"));

        const namespace = this.pjson.namespace

        const componentPath = this.destinationPath(
            `src/${this.options.name}/${this.options.name}.ts`
        );
        const opts = { ...this.options, _, type: "component", path: componentPath, namespace };

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
            this.templatePath("_component.template.ts.ejs"),
            this.destinationPath(
                `src/${this.options.name}/${this.options.name}.template.ts`
            ),
            opts
        );

        this.fs.copyTpl(
            this.templatePath("base.html.ejs"),
            this.destinationPath(`src/${this.options.name}/fixtures/base.html`),
            opts
        );

        this.fs.copyTpl(
            this.templatePath("index.ts.ejs"),
            this.destinationPath(`src/${this.options.name}/index.ts`),
            opts
        );

        this.fs.copyTpl(
            this.templatePath("_component.ts.ejs"),
            this.destinationPath(`src/${this.options.name}/${this.options.name}.ts`),
            opts
        );

        this.fs.copyTpl(
            this.templatePath("README.md.ejs"),
            this.destinationPath(`src/${this.options.name}/README.md`),
            opts
        );
    }
}

export = ComponentGenerator;
