import { FormPlugin, FormPluginProps } from "../../../../src";

/* tslint:disable:max-classes-per-file */
export class StringUpdateSchemaPlugin extends FormPlugin<FormPluginProps> {
    public resolver(schema: any, data: any): any {
        switch (data.pluginModifiedNumber) {
            case 1:
                return Object.assign({}, schema, { enum: ["foo"] });
            case 2:
                return Object.assign({}, schema, { enum: ["bar"] });
            case 3:
                return Object.assign({}, schema, { enum: ["bat"] });
        }

        return Object.assign({}, schema, { enum: ["red", "green", "blue"] });
    }
}

export class OneOfUpdateSchemaPlugin extends FormPlugin<FormPluginProps> {
    public resolver(schema: any, data: any): any {
        const testSchema: any = {
            oneOf: [
                {
                    description: "string option",
                    title: "string option",
                    type: "string",
                },
                {
                    description: "number option",
                    title: "number option",
                    type: "number",
                },
            ],
        };

        return Object.assign({}, schema, testSchema);
    }
}
