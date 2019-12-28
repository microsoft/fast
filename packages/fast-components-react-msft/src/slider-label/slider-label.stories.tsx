import { storiesOf } from "@storybook/react";
import React from "react";
import { SliderLabel } from "./";
import API from "./.tmp/API.md";

const Center: React.FunctionComponent = (props: {
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <div style={{ margin: "40px auto", position: "relative", width: 0 }}>
            {props.children}
        </div>
    );
};

storiesOf("Slider label", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => (
        <Center>
            <SliderLabel label="Label" />
        </Center>
    ))
    .add("Without tick mark", () => (
        <Center>
            <SliderLabel label="Label" showTickmark={false} />
        </Center>
    ));
