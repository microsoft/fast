import { ComponentDictionary } from "@microsoft/fast-tooling-react";
import { designSystemSchema } from "@microsoft/fast-components-styles-msft";
import { reactComponentDictionary } from "@microsoft/site-utilities";

const componentDictionary: ComponentDictionary = {
    ...reactComponentDictionary,
    [designSystemSchema.id]: "",
};

export { componentDictionary };
