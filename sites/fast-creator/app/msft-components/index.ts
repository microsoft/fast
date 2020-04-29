import { reactComponentDictionary } from "@microsoft/site-utilities";

import { ComponentDictionary } from "@microsoft/fast-tooling-react";
import textSchema from "./schemas/text.schema";

export * from "./example-data";
export { textSchema };
export const componentDictionary: ComponentDictionary = {
    ...reactComponentDictionary,
    [textSchema.id]: null,
};
