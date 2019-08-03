import { ComponentViewConfig } from "./data.props";
import {
    Typography,
    TypographyProps,
    typographySchema,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/typography/guidance";

const typographyConfig: ComponentViewConfig<TypographyProps> = {
    schema: typographySchema,
    component: Typography,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                children: "Typography",
            },
        },
    ],
};

export default typographyConfig;
