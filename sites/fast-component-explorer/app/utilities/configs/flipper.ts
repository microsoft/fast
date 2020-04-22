import {
    Flipper,
    FlipperDirection,
    flipperSchema2,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/flipper/guidance";
import { ComponentViewConfig } from "./data.props";

const flipperConfig: ComponentViewConfig = {
    schema: flipperSchema2,
    component: Flipper,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Next",
            dataDictionary: [
                {
                    root: {
                        schemaId: flipperSchema2.id,
                        data: {},
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Previous",
            dataDictionary: [
                {
                    root: {
                        schemaId: flipperSchema2.id,
                        data: {
                            direction: FlipperDirection.previous,
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default flipperConfig;
