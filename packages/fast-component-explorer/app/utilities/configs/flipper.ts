import { ComponentViewConfig } from "./data.props";
import {
    Flipper,
    FlipperDirection,
    FlipperProps,
    flipperSchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/flipper/guidance";

const flipperConfig: ComponentViewConfig<FlipperProps> = {
    schema: flipperSchema,
    component: Flipper,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Next",
            data: {},
        },
        {
            displayName: "Previous",
            data: {
                direction: FlipperDirection.previous,
            },
        },
    ],
};

export default flipperConfig;
