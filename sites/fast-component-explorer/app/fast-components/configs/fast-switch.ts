import { fastComponentSchemas } from "@microsoft/site-utilities";
import Guidance from "../../.tmp/switch/guidance";
import { ComponentViewConfig } from "./data.props";

export const fastSwitchId = "fast-switch";
const fastSwitchConfig: ComponentViewConfig = {
    schema: fastComponentSchemas[fastSwitchId],
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            dataDictionary: [
                {
                    root: {
                        schemaId: fastSwitchId,
                        data: {},
                    },
                },
                "root",
            ],
        },
    ],
};

export default fastSwitchConfig;
