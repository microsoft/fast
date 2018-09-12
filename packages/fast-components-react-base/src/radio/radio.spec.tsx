import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    IRadioClassNameContract,
    IRadioHandledProps,
    IRadioManagedClasses,
    IRadioUnhandledProps,
    RadioHTMLTags,
    RadioProps
} from "./radio";

/**
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("radio snapshots", (): void => {
    generateSnapshots(examples);
});

describe("radio", (): void => {
    const Component: React.ComponentClass<IRadioHandledProps & IRadioManagedClasses> = examples.component;
    const managedClasses: IRadioClassNameContract = {
        radio: "radio",
        radio_disabled: "radio_disabled",
        radio_input: "radio_input",
        radio_label: "radio_label",
        radio_span: "radio_span"
    };

    const inputSelector: string = `.${managedClasses.radio_input}`;

    test("should implement unhandledProps", () => {
        const handledProps: IRadioHandledProps & IRadioManagedClasses = {
            tag: RadioHTMLTags.div,
            managedClasses
        };

        const unHandledProps: IRadioUnhandledProps = {
            "aria-hidden": true
        };

        const props: RadioProps = {...handledProps, ...unHandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.first().prop("aria-hidden")).toEqual(true);
    });
});
