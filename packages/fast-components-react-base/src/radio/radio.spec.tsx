import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Radio, {
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
    const managedClasses: IRadioClassNameContract = {
        radio: "radio",
        radio__disabled: "radio__disabled",
        radio_input: "radio_input",
        radio_label: "radio_label",
        radio_stateIndicator: "radio_stateIndicator"
    };

    const inputSelector: string = `.${managedClasses.radio_input}`;

    test("should have a displayName that matches the component name", () => {
        expect((Radio as any).name).toBe(Radio.displayName);
    });

    test("should call a registerd callback after a change event", () => {
        const onChange: any = jest.fn();
        const controlled: any = shallow(
            <Radio managedClasses={managedClasses} checked={true} onChange={onChange} id="radio">
                <div slot={RadioSlot.label} />
            </Radio>
        );
        const uncontrolled: any = shallow(
            <Radio managedClasses={managedClasses} onChange={onChange} id="radio"/>
        );

        controlled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(1);

        uncontrolled.find(inputSelector).simulate("change");

        expect(onChange).toHaveBeenCalledTimes(2);
    });
});
