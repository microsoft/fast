import { storiesOf } from "@storybook/react";
import React from "react";
import { Breadcrumb } from "./";
import { Hypertext } from "../hypertext";
import API from "./.tmp/API.md";

function separator(className?: string): JSX.Element {
    return <span className={className}>/</span>;
}

storiesOf("Breadcrumb", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => (
        <Breadcrumb separator={separator}>
            <Hypertext href="#">Item one</Hypertext>
            <Hypertext href="#">Item Two</Hypertext>
            <Hypertext>Item Three</Hypertext>
        </Breadcrumb>
    ));
