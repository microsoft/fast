import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/tree-item/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastTreeItemId = "fast-tree-item";
const fastTreeItemConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastTreeItemId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastTreeItemId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastTreeItemConfig;
