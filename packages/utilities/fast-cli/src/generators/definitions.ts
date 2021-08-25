import * as fileSys from "fs";
import * as _ from "lodash";
import * as Generator from "yeoman-generator";
// import { Options } from "../commands/generate";
import { Options } from "../commands/new";

class DefinitionGenerator extends Generator {
    pjson!: any;

    _ext: string = ".ts";

    get _src(): any {
        if (fileSys.existsSync("package.json")) {
            return fileSys.readdirSync(this.destinationPath(`./src`));
        }
        return fileSys.readdirSync(this.destinationPath(`./${this.options.name}/src`));
    }

    get _customElements(): any {
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
        );
    }

    get _indexSrc(): any {
        return _.without(
            this._src,
            "__test__",
            "accordion-item",
            "styles",
            "tab",
            "tab-panel",
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

    get _importPaths(): any {
        return this._customElements.map((fileName: string) => {
            const camelCase = _.camelCase(fileName);

            if (fileName === "accordion") {
                return `import { ${this.pjson.namespace}Accordion, ${this.pjson.namespace}AccordionItem } from "./${fileName}/index"`;
            }
            if (fileName === "accordion-item") {
                return;
            }
            if (fileName === "data-grid") {
                return `import { ${this.pjson.namespace}${_.upperFirst(camelCase)}, ${
                    this.pjson.namespace
                }DataGridCell, ${
                    this.pjson.namespace
                }DataGridRow } from "./${fileName}/index";`;
            }
            if (fileName === "listbox-option") {
                return `import { ${this.pjson.namespace}Option } from "./${fileName}/index";`;
            }
            if (fileName === "tabs") {
                return `import { ${this.pjson.namespace}Tab, ${this.pjson.namespace}TabPanel, ${this.pjson.namespace}Tabs } from "./tabs/index"`;
            }
            if (fileName === "tab" || fileName === "tab-panel") {
                return;
            } else {
                return `import { ${this.pjson.namespace}${_.upperFirst(
                    camelCase
                )}} from "./${fileName}/index";`;
            }
        });
    }

    get _formatPaths(): any {
        return _.without(this._importPaths, undefined).join("\n");
    }

    get _componentList(): any {
        return `${this._customElements.map((item: any) => {
            if (item === "listbox-option") {
                return `${this.pjson.namespace}Option`;
            }
            if (item === "data-grid") {
                return `${this.pjson.namespace}DataGrid,${this.pjson.namespace}DataGridCell,${this.pjson.namespace}DataGridRow`;
            }
            return `${this.pjson.namespace}${_.upperFirst(_.camelCase(item))}`;
        })}`;
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
        return this._indexSrc.map((item: any) => {
            if (item === "custom-elements.ts") {
                return `export * from "./custom-elements"`;
            }
            if (item === "fast-design-system.ts") {
                return `export { FASTDesignSystem, fastDesignSystemDefaults } from "./fast-design-system"`;
            }
            if (item === "design-system-provider") {
                return `export * from "./${item}/index";
export { Swatch, SwatchRGB } from "./color/swatch";
export { Palette, PaletteRGB } from "./color/palatte";
export { isDark } from "./color/utilities/is-dark";
export { StandardLuminance } from "./color/utilities/base-layer-luminance";`;
            }
            if (item === "design-tokens.ts") {
                return `export * from "./design-tokens";`;
            }
            if (item === "list-box-option") {
                return `export { ${this.pjson.namespace}Option } from "./${item}/index";`;
            }
            return `export * from "./${item}/index";`;
        });
    }

    constructor(args: any, public options: Options) {
        super(args, options);
        if (!fileSys.existsSync("package.json")) {
            this.pjson = this.fs.readJSON(`${this.options.name}/package.json`);
        } else {
            this.pjson = this.fs.readJSON("package.json");
        }
    }

    async prompting(): Promise<void> {
        if (fileSys.existsSync("package.json")) {
            this.log(`path: ./src`);
        } else {
            this.log(`path: ./${this.options.name}/src`);
        }
    }

    writing(): void {
        if (fileSys.existsSync("package.json")) {
            this.fs.write(
                this.destinationPath(`./src/custom-elements${this._ext}`),
                this._formatPaths
            );

            this.fs.append(
                this.destinationPath(`./src/custom-elements${this._ext}`),
                this._exports
            );

            this.fs.append(
                this.destinationPath(`./src/custom-elements${this._ext}`),
                this._allComponents
            );

            this.fs.write(
                this.destinationPath(`./src/index${this._ext}`),
                this._index.join("\n")
            );
        }
        this.fs.write(
            this.destinationPath(
                `./${this.options.name}/src/custom-elements${this._ext}`
            ),
            this._formatPaths
        );

        this.fs.append(
            this.destinationPath(
                `./${this.options.name}/src/custom-elements${this._ext}`
            ),
            this._exports
        );

        this.fs.append(
            this.destinationPath(
                `./${this.options.name}/src/custom-elements${this._ext}`
            ),
            this._allComponents
        );

        this.fs.write(
            this.destinationPath(`./${this.options.name}/src/index${this._ext}`),
            this._index.join("\n")
        );
    }
}

export = DefinitionGenerator;
