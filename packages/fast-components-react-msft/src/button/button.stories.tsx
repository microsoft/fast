import React from "react";
import { addDecorator, storiesOf } from "@storybook/react";
import { Button, ButtonAppearance } from "./";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";
import { Background, DarkModeBackgrounds } from "../background";
import withDesignSystem from "../../design-system-provider-addon";

storiesOf("Button", module)
    .addDecorator(withDesignSystem)
    .add(
        "Primary",
        () => <Button appearance={ButtonAppearance.primary}>Primary button</Button>,
        { foo: { data: "awesome" } }
    )
    .add("Secondary", () => <Button>Secondary button</Button>)
    .add("Stealth", () => (
        <Button appearance={ButtonAppearance.stealth}>Stealth button</Button>
    ))
    .add("Outline", () => (
        <Button appearance={ButtonAppearance.outline}>Outline button</Button>
    ))
    .add("Justified", () => (
        <Button appearance={ButtonAppearance.justified}>Justified button</Button>
    ));
