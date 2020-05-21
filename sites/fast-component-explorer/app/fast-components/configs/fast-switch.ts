import Guidance from "../../.tmp/switch/guidance";
import { ComponentViewConfig } from "./data.props";
import { webComponentSchemas } from "..";

export const fastSwitchId = "fast-switch";
const fastSwitchConfig: ComponentViewConfig = {
    schema: webComponentSchemas[fastSwitchId],
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
