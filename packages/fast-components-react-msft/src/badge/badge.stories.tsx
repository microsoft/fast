import { storiesOf } from "@storybook/react";
import React from "react";
import { Badge, BadgeSize } from "./";
import API from "./API.md";

storiesOf("Badge", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => <Badge>Badge</Badge>)
    .add("Large", () => <Badge size={BadgeSize.large}>Large badge</Badge>)
    .add("Small", () => <Badge size={BadgeSize.small}>Small badge</Badge>)
    .add("Unfilled", () => <Badge filled={false}>Small badge</Badge>);
