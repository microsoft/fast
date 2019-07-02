import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { AutoSuggestOption } from "./";
import { uniqueId } from "lodash-es";
import { action } from "@storybook/addon-actions";

storiesOf("Auto suggest option ", module)
    .add("Default", () => <AutoSuggestOption value={"Value"} id={uniqueId()} />)
    .add("Disabled", () => (
        <AutoSuggestOption value={"Disabled"} id={uniqueId()} disabled={true} />
    ));
