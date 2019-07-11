import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import Badge from "./";
import { uniqueId } from "lodash-es";

storiesOf("Badge", module).add("Badge", () => <Badge>Badge</Badge>);
