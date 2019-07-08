import { storiesOf } from "@storybook/react";
import React from "react";
import Button from "./index";

storiesOf("Button", module)
    .add("As Button", () => <Button>Button</Button>)
    .add("As Anchor", () => <Button href={"/"}>Anchor</Button>);
