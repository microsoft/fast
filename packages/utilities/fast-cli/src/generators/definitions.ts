import * as fileSys from "fs";
import * as _ from "lodash";
import * as Generator from "yeoman-generator";
import type { GenerateOptions } from "../commands/generate";
import type { NewOptions } from "../commands/new";

class DefinitionGenerator extends Generator {
    pjson!: any;

    _ext: string = ".ts";

    _destinationPath!: string;

    _projectDir: boolean = false;

    get _src(): string[] {
        if (this._projectDir) {
            return fileSys.readdirSync(this.destinationPath(`./src`));
        } else {
            return fileSys.readdirSync(
                this.destinationPath(`./${this.options.name}/src`)
            );
        }
    }

    get _customElements(): string[] {
        return _.without(
            this._src,
            "__test__",
            "design-system-provider",
            "utilities",
            "component-definitions.js",
            "custom-elements.ts",
            "color",
            "design-tokens.ts",
            "fast-design-system.ts",
            "index-rollup.ts",
            "index.ts",
            "mocha-typings.d.ts",
            "storybook-typings.d.ts",
            "styles"
        ) as string[];
    }

    get _indexSrc(): any {
        return _.without(
            this._src,
            "__test__",
            "accordion-item",
            "styles",
            "tab",
            "tab-panel",
            "color",
            `component-definitions.js`,
            `default-palette${this._ext}`,
            `design-tokens`,
            `index-rollup${this._ext}`,
            `index${this._ext}`,
            `mocha-typings.d${this._ext}`,
            `storybook-typings.d${this._ext}`,
            "utilities"
        );
    }

    get _importPaths(): string[] {
        return this._customElements
            .map((fileName: string) => {
                const camelCase = _.camelCase(fileName);

                switch (fileName) {
                    case "accordion": {
                        return `import { ${this.pjson.namespace}Accordion, ${this.pjson.namespace}AccordionItem } from "./${fileName}/index"`;
                    }

                    case "accordion-item":
                    case "tab":
                    case "tab-panel": {
                        return;
                    }

                    case "data-grid": {
                        return `import { ${this.pjson.namespace}${_.upperFirst(
                            camelCase
                        )}, ${this.pjson.namespace}DataGridCell, ${
                            this.pjson.namespace
                        }DataGridRow } from "./${fileName}/index";`;
                    }

                    case "listbox-option": {
                        return `import { ${this.pjson.namespace}Option } from "./${fileName}/index";`;
                    }

                    case "tabs": {
                        return `import { ${this.pjson.namespace}Tab, ${this.pjson.namespace}TabPanel, ${this.pjson.namespace}Tabs } from "./tabs/index"`;
                    }

                    default: {
                        return `import { ${this.pjson.namespace}${_.upperFirst(
                            camelCase
                        )} } from "./${fileName}/index";`;
                    }
                }
            })
            .filter(Boolean) as string[];
    }

    get _formatPaths(): string {
        return this._importPaths.join("\n");
    }

    get _componentList(): any {
        return `${this._customElements
            .map((item: any) => {
                switch (item) {
                    case "listbox-option": {
                        return `${this.pjson.namespace}Option`;
                    }
                    case "data-grid": {
                        return `${this.pjson.namespace}DataGrid,${this.pjson.namespace}DataGridCell,${this.pjson.namespace}DataGridRow`;
                    }
                    default: {
                        return `${this.pjson.namespace}${_.upperFirst(
                            _.camelCase(item)
                        )}`;
                    }
                }
            })
            .join(",\n  ")}`;
    }

    get _exports(): any {
        return `
export {
  ${this._componentList}
}
    `;
    }

    get _allComponents(): any {
        return `
export const allComponents = {
  ${this._componentList}
}
    `;
    }

    get _index(): any {
        return this._indexSrc
            .map((item: any) => {
                switch (item) {
                    case "custom-elements.ts": {
                        return `export * from "./custom-elements"`;
                    }
                    case "fast-design-system.ts": {
                        return `export { FASTDesignSystem, fastDesignSystemDefaults } from "./fast-design-system"`;
                    }
                    case "design-system-provider": {
                        return `
export * from "./${item}/index";
export { Swatch, SwatchRGB } from "./color/swatch";
export { Palette, PaletteRGB } from "./color/palette";
export { isDark } from "./color/utilities/is-dark";
export { StandardLuminance } from "./color/utilities/base-layer-luminance";
                    `;
                    }
                    case "design-tokens.ts": {
                        return `export * from "./design-tokens";`;
                    }
                    case "list-box-option": {
                        return `export { ${this.pjson.namespace}Option } from "./${item}/index";`;
                    }
                    default: {
                        return `export * from "./${item}/index";`;
                    }
                }
            })
            .join("\n");
    }

    constructor(args: any, public options: NewOptions | GenerateOptions) {
        super(args, options);
        if (fileSys.existsSync("package.json")) {
            this.pjson = this.fs.readJSON("package.json");
            this._destinationPath = `src`;
            this._projectDir = true;
        } else {
            this.pjson = this.fs.readJSON(`${this.options.name}/package.json`);
            this._destinationPath = `${this.options.name}/src`;
            this._projectDir = false;
        }
    }

    async prompting(): Promise<void> {
        this.log(this._destinationPath);
    }

    writing(): void {
        this.fs.write(
            this.destinationPath(
                `./${this._destinationPath}/custom-elements${this._ext}`
            ),
            this._formatPaths
        );

        this.fs.append(
            this.destinationPath(
                `./${this._destinationPath}/custom-elements${this._ext}`
            ),
            this._exports
        );

        this.fs.append(
            this.destinationPath(
                `./${this._destinationPath}/custom-elements${this._ext}`
            ),
            this._allComponents
        );

        this.fs.write(
            this.destinationPath(`./${this._destinationPath}/index${this._ext}`),
            this._index
        );
    }
}

export = DefinitionGenerator;
