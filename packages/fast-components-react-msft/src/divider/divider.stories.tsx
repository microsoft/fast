import { storiesOf } from "@storybook/react";
import React from "react";
import { Divider, DividerClassNameContract, DividerRoles } from "./";
import { DesignSystem, designUnit } from "@microsoft/fast-components-styles-msft";
import { ComponentStyleSheet } from "../../../fast-jss-manager/dist";
import { multiply, toPx } from "@microsoft/fast-jss-utilities";

const styles: ComponentStyleSheet<DividerClassNameContract, DesignSystem> = {
    divider: {
        marginTop: toPx(multiply(designUnit, 12)),
    },
};

storiesOf("Divider", module)
    .add("Default", () => <Divider jssStyleSheet={styles} />)
    .add("Presentation role", () => (
        <Divider role={DividerRoles.presentation} jssStyleSheet={styles} />
    ))
    .add("Seperator role", () => (
        <Divider role={DividerRoles.separator} jssStyleSheet={styles} />
    ));
