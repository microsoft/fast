import { storiesOf } from "@storybook/react";
import React from "react";
import { CallToAction, CallToActionAppearance } from "./";

storiesOf("Call to action", module)
    .add("Default", () => <CallToAction>Buy now</CallToAction>)
    .add("Primary", () => (
        <CallToAction appearance={CallToActionAppearance.primary}>Buy now</CallToAction>
    ))
    .add(" Primary Anchor", () => (
        <CallToAction appearance={CallToActionAppearance.primary} href="#">
            Buy now
        </CallToAction>
    ))
    .add("Primary Anchor - disabled", () => (
        <CallToAction
            appearance={CallToActionAppearance.primary}
            href="#"
            disabled={true}
        >
            Buy now
        </CallToAction>
    ))
    .add("Justified", () => (
        <CallToAction appearance={CallToActionAppearance.justified}>Buy now</CallToAction>
    ))
    .add("Justified Anchor", () => (
        <CallToAction appearance={CallToActionAppearance.justified} href="#">
            Buy now
        </CallToAction>
    ))
    .add("Lightweight", () => (
        <CallToAction appearance={CallToActionAppearance.lightweight}>
            Buy now
        </CallToAction>
    ))
    .add("Lightweight Anchor", () => (
        <CallToAction appearance={CallToActionAppearance.lightweight} href="#">
            Buy now
        </CallToAction>
    ))
    .add("Outline", () => (
        <CallToAction appearance={CallToActionAppearance.outline}>Buy now</CallToAction>
    ))
    .add("Outline Anchor", () => (
        <CallToAction appearance={CallToActionAppearance.outline} href="#">
            Buy now
        </CallToAction>
    ))
    .add("Primary", () => (
        <CallToAction appearance={CallToActionAppearance.primary}>Buy now</CallToAction>
    ))
    .add("Stealth", () => (
        <CallToAction appearance={CallToActionAppearance.stealth}>Buy now</CallToAction>
    ))
    .add("Stealth Anchor", () => (
        <CallToAction appearance={CallToActionAppearance.stealth} href="#">
            Buy now
        </CallToAction>
    ));
