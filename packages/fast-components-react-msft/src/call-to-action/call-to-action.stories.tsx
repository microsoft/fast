import { storiesOf } from "@storybook/react";
import React from "react";
import { CallToAction, CallToActionAppearance } from "./";
import API from "./API.md";

storiesOf("Call to action", module)
    .addParameters({
        readme: {
            sidebar: API,
        },
    })
    .add("Default", () => <CallToAction>Buy now</CallToAction>)
    .add("Primary", () => (
        <CallToAction appearance={CallToActionAppearance.primary}>Buy now</CallToAction>
    ))
    .add(" Primary Anchor", () => (
        <CallToAction appearance={CallToActionAppearance.primary} href="#">
            Buy now
        </CallToAction>
    ))
    .add("Justified", () => (
        <CallToAction appearance={CallToActionAppearance.justified}>Buy now</CallToAction>
    ))
    .add("Lightweight", () => (
        <CallToAction appearance={CallToActionAppearance.lightweight}>
            Buy now
        </CallToAction>
    ))
    .add("Outline", () => (
        <CallToAction appearance={CallToActionAppearance.outline}>Buy now</CallToAction>
    ))
    .add("Primary", () => (
        <CallToAction appearance={CallToActionAppearance.primary}>Buy now</CallToAction>
    ))
    .add("Stealth", () => (
        <CallToAction appearance={CallToActionAppearance.stealth}>Buy now</CallToAction>
    ));
