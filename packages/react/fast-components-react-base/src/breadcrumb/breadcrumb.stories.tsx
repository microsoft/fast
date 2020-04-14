import { storiesOf } from "@storybook/react";
import React from "react";
import Hypertext from "../hypertext";
import Breadcrumb from "./";

function separator(className?: string): JSX.Element {
    return <span className={className}>/</span>;
}
storiesOf("Breadcrumb", module)
    .add("Default", () => (
        <Breadcrumb separator={separator}>
            <Hypertext href="#">Item one</Hypertext>
            <Hypertext href="#">Item Two</Hypertext>
            <Hypertext>Item Three</Hypertext>
        </Breadcrumb>
    ))
    .add("With label", () => (
        <Breadcrumb separator={separator} label="Breadcrumb">
            <Hypertext href="#">Item one</Hypertext>
            <Hypertext href="#">Item Two</Hypertext>
            <Hypertext>Item Three</Hypertext>
        </Breadcrumb>
    ));
