import { storiesOf } from "@storybook/react";
import React from "react";
import { DesignSystem, designUnit } from "@microsoft/fast-components-styles-msft";
import { multiply, toPx } from "@microsoft/fast-jss-utilities";
import { ComponentStyleSheet } from "../../../fast-jss-manager/dist";
import { Divider, DividerClassNameContract, DividerRoles } from "./";

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
