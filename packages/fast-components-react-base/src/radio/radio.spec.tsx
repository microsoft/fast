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
    RadioProps,
    RadioSlot
} from "./radio";
import Label from "../label";

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
        radio_input: "radio_input"
    };

    const inputSelector: string = `.${managedClasses.radio_input}`;

    test("should call a registerd callback after a change event", () => {
        const onChange: any = jest.fn();
        const controlled: any = shallow(
            <Component managedClasses={managedClasses} checked={true} onChange={onChange}>
                <div slot={RadioSlot.label} />
            </Component>
        );
        const uncontrolled: any = shallow(
            <Component managedClasses={managedClasses} onChange={onChange} />
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });
});
