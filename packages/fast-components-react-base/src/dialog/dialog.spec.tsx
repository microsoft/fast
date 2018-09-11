import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    DialogProps,
    IDialogClassNameContract,
    IDialogHandledProps,
    IDialogManagedClasses,
    IDialogUnhandledProps
} from "./dialog";
import { KeyCodes } from "@microsoft/fast-web-utilities";

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
        dialog_modalOverlay: "dialog-modal-overlay-class",
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

    test("should call the `onDismiss` callback after a click event on the modal overlay when `visible` prop is true", () => {
        const onDismiss: any = jest.fn();
        const rendered: any = shallow(
            <Component
                managedClasses={managedClasses}
                modal={true}
                onDismiss={onDismiss}
            />
        );

        rendered.find(`.${managedClasses.dialog_modalOverlay}`).simulate("click");

        expect(onDismiss).toHaveBeenCalledTimes(0);

        rendered.setProps({visible: true});

        rendered.find(`.${managedClasses.dialog_modalOverlay}`).simulate("click");

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should call the `onDismiss` callback when escape key is pressed and `visible` prop is true", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.addEventListener
        window.addEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        const rendered: any = mount(
            <Component managedClasses={managedClasses} modal={true} onDismiss={onDismiss} />
        );

        map.keydown({ keyCode: KeyCodes.escape });

        expect(onDismiss).toHaveBeenCalledTimes(0);

        // set visible prop
        rendered.setProps({visible: true});

        map.keydown({ keyCode: KeyCodes.escape });

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    test("should remove keydown event listener for the `onDismiss` callback when component unmounts", () => {
        const onDismiss: any = jest.fn();
        const map: any = {};

        // Mock window.removeEventListener
        window.removeEventListener = jest.fn((event: string, callback: any) => {
            map[event] = callback;
        });

        const rendered: any = mount(
            <Component managedClasses={managedClasses} modal={true} onDismiss={onDismiss} visible={true} />
        );

        rendered.unmount();

        map.keydown({ keyCode: KeyCodes.escape });

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });
});
