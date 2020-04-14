import { storiesOf } from "@storybook/react";
import React from "react";
import { DividerRoles } from "./divider.props";
import Divider from "./";

storiesOf("Divider", module)
    .add("Divider", () => <Divider />)
    .add("Divider with role seperator", () => <Divider role={DividerRoles.separator} />)
    .add("Divider with role presentation", () => (
        <Divider role={DividerRoles.presentation} />
    ));
