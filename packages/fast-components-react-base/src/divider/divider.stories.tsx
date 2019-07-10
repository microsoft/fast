import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import Divider from "./";
import { uniqueId } from "lodash-es";
import { DividerRoles } from "./divider.props";

storiesOf("Divider", module)
    .add("Divider", () => <Divider />)
    .add("Divider with role seperator", () => <Divider role={DividerRoles.separator} />)
    .add("Divider with role presentation", () => (
        <Divider role={DividerRoles.presentation} />
    ));
