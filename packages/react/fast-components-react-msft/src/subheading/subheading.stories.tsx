import { storiesOf } from "@storybook/react";
import React from "react";
import { Subheading, SubheadingSize, SubheadingTag } from "./";

storiesOf("Subheading", module)
    .add("Default", () => <Subheading>Default subheading</Subheading>)
    .add("Subheading 1", () => (
        <Subheading size={SubheadingSize._1}>Subheading 1</Subheading>
    ))
    .add("Subheading 2", () => (
        <Subheading size={SubheadingSize._2}>Subheading 2</Subheading>
    ))
    .add("Subheading 3", () => (
        <Subheading size={SubheadingSize._3}>Subheading 3</Subheading>
    ))
    .add("Subheading 4", () => (
        <Subheading size={SubheadingSize._4}>Subheading 4</Subheading>
    ))
    .add("Subheading 5", () => (
        <Subheading size={SubheadingSize._5}>Subheading 5</Subheading>
    ))
    .add("Subheading 6", () => (
        <Subheading size={SubheadingSize._6}>Subheading 6</Subheading>
    ))
    .add("Subheading 7", () => (
        <Subheading size={SubheadingSize._7}>Subheading 7</Subheading>
    ))
    .add("Subheading h1", () => (
        <Subheading tag={SubheadingTag.h1}>Subheading h1</Subheading>
    ))
    .add("Subheading h2", () => (
        <Subheading tag={SubheadingTag.h2}>Subheading h2</Subheading>
    ))
    .add("Subheading h3", () => (
        <Subheading tag={SubheadingTag.h3}>Subheading h3</Subheading>
    ))
    .add("Subheading h4", () => (
        <Subheading tag={SubheadingTag.h4}>Subheading h4</Subheading>
    ))
    .add("Subheading h5", () => (
        <Subheading tag={SubheadingTag.h5}>Subheading h5</Subheading>
    ))
    .add("Subheading h6", () => (
        <Subheading tag={SubheadingTag.h6}>Subheading h6</Subheading>
    ))
    .add("Subheading p", () => (
        <Subheading tag={SubheadingTag.p}>Subheading p</Subheading>
    ));
