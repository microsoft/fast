import { storiesOf } from "@storybook/react";
import React from "react";
import { Banner, BannerProps } from "./index";
import { StealthButton } from "@microsoft/fast-components-react-msft";

const props: BannerProps = {
    title: {
        children: "Lorem ipsum"
    },
    abstract: {
        children:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum suscipit metus quis ex pharetra porta ut eget arcu. Lorem ipsum dolor sit amet."
    },
    action: {
        href: "#"
    }
};

storiesOf("Banner", module)
    .add("Default", () => <Banner {...props} />)
    .add("with blue Background", () => <Banner {...props} backgroundColor={"#0069D1"} />)
    .add("with purple Background", () => <Banner {...props} backgroundColor={"#6438AD"} />)
    .add("width green Background", () => <Banner {...props} backgroundColor={"#008575"} />)
    .add("width action", () => <Banner {...props} backgroundColor={"#008575"} />);
