import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    DialogProps,
    IDialogClassNameContract,
    IDialogHandledProps,
    IDialogManagedClasses,
    IDialogUnhandledProps
} from "./dialog";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("dialog snapshot", (): void => {
    generateSnapshots(examples);
});

describe("dialog", (): void => {
    const Component: React.ComponentClass<IDialogHandledProps & IDialogManagedClasses> = examples.component;
    const managedClasses: IDialogClassNameContract = {
        dialog: "dialog-class",
        dialog_contentRegion: "dialog-content-region-class",
        dialog_modalOverlay: "dialog-modal-overlay",
    };

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: IDialogHandledProps & IDialogManagedClasses = {
            managedClasses,
            label: "Dialog label"
        };

        const unhandledProps: any = {
            "data-m": "foo"
        } as IDialogUnhandledProps;

        const props: DialogProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.prop("data-m")).not.toBe(undefined);
        expect(rendered.prop("data-m")).toEqual("foo");
    });
});
