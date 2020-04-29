import { reactComponentDictionary } from "@microsoft/site-utilities";

import textSchema from "./schemas/text.schema";
import { ComponentDictionary } from "@microsoft/fast-tooling-react";

export * from "./example-data";
export { textSchema };
export const componentDictionary: ComponentDictionary = {
    ...reactComponentDictionary,
    [textSchema.id]: null,
};
