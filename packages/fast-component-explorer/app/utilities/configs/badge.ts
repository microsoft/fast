import { ComponentViewConfig } from "./data.props";
import {
    Badge,
    BadgeProps,
    badgeSchema,
    BadgeSize,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/badge/guidance";

const badgeConfig: ComponentViewConfig<BadgeProps> = {
    schema: badgeSchema,
    component: Badge,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Small",
            data: {
                children: "Small badge",
                size: BadgeSize.small,
            },
        },
        {
            displayName: "Large",
            data: {
                children: "Large badge",
                size: BadgeSize.large,
            },
        },
        {
            displayName: "Unfilled",
            data: {
                children: "Unfilled badge",
                filled: false,
            },
        },
    ],
};

export default badgeConfig;
