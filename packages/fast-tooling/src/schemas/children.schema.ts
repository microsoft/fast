import childSchema from "./child.schema";
import { childrenPluginId, pluginIdKeyword } from "./keywords";

export enum ChildrenType {
    string = "string",
    number = "number",
    component = "component",
}

export default {
    [pluginIdKeyword]: childrenPluginId,
    oneOf: [
        ...childSchema.oneOf,
        {
            type: "array",
            items: childSchema,
        },
    ],
};
