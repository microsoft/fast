import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    CardHTMLTags,
    CardProps,
    ICardClassNameContract,
    ICardHandledProps,
    ICardManagedClasses,
    ICardUnhandledProps
} from "./card";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("card snapshot", (): void => {
    generateSnapshots(examples);
});
