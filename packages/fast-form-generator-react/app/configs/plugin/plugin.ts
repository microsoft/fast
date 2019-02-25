import { FormPlugin, FormPluginProps } from "../../../src";

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
