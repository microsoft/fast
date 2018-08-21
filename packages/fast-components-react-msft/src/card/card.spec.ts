import * as React from "react";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    CardHTMLTags,
    CardProps,
    ICardClassNameContract,
    ICardHandledProps,
    ICardManagedClasses,
    ICardUnhandledProps
} from "@microsoft/fast-components-react-base";

describe("card snapshot", (): void => {
    generateSnapshots(examples);
});
