import React from "react";
import { storiesOf } from "@storybook/react";
import { Button, ButtonAppearance } from "./";

storiesOf("Button", module)
    .add("Primary", () => (
        <Button appearance={ButtonAppearance.primary}>Primary button</Button>
    ))
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
