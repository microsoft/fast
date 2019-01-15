import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import Dialog, {
    DialogClassNameContract,
    DialogHandledProps,
    DialogManagedClasses,
    DialogProps,
    DialogUnhandledProps,
} from "./dialog";
import { KeyCodes } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("dialog", (): void => {
    const managedClasses: DialogClassNameContract = {
        dialog: "dialog-class",
        dialog_contentRegion: "dialog-content-region-class",
        dialog_modalOverlay: "dialog-modal-overlay-class",
    };

    test("should have a displayName that matches the component name", () => {
        expect((Dialog as any).name).toBe(Dialog.displayName);
    });

    test("should have correct element attribute role 'dialog'", () => {
        const rendered: any = shallow(<Dialog managedClasses={managedClasses} />);
        expect(
            rendered.find(`.${managedClasses.dialog_contentRegion}`).prop("role")
        ).toBe("dialog");
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Dialog />);
            shallow(<Dialog modal={true} />);
        }).not.toThrow();
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: DialogHandledProps = {
            managedClasses,
            label: "Dialog label",
        };

        const unhandledProps: any = {
            "data-m": "foo",
        } as DialogUnhandledProps;

        const props: DialogProps = { ...handledProps, ...unhandledProps };

        const rendered: any = shallow(<Dialog {...props} />);

        expect(rendered.prop("data-m")).not.toBe(undefined);
        expect(rendered.prop("data-m")).toEqual("foo");
    });

    test("should add an `aria-label` attribute to the `dialog` element when the `label` prop is provided", () => {
        const label: string = "Dialog";
        const rendered: any = shallow(
            <Dialog managedClasses={managedClasses} label={label} />
        );

        expect(
            rendered.find(`.${managedClasses.dialog_contentRegion}`).prop("aria-label")
        ).toEqual(label);
    });

    test("should add an `aria-labelledby` attribute to the `dialog` element when the `labelledby` prop is provided", () => {
        const labelledby: string = "Dialog";
        const rendered: any = shallow(
            <Dialog managedClasses={managedClasses} labelledBy={labelledby} />
        );

        expect(
            rendered
                .find(`.${managedClasses.dialog_contentRegion}`)
                .prop("aria-labelledby")
        ).toEqual(labelledby);
    });

    test("should add an `aria-describedBy` attribute to the `dialog` element when the `describedBy` prop is provided", () => {
        const describedby: string = "Dialog";
        const rendered: any = shallow(
            <Dialog managedClasses={managedClasses} describedBy={describedby} />
        );

        expect(
            rendered
                .find(`.${managedClasses.dialog_contentRegion}`)
                .prop("aria-describedby")
        ).toEqual(describedby);
    });

    test('should have an attribute of `aria-hidden="true"` when the `visible` prop is false', () => {
        const rendered: any = shallow(
            <Dialog managedClasses={managedClasses} visible={false} />
        );

        expect(rendered.find(`.${managedClasses.dialog}`).prop("aria-hidden")).toEqual(
            true
        );
    });

    test('should have an attribute of `aria-hidden="false"` when the `visible` prop is true', () => {
        const rendered: any = shallow(
            <Dialog managedClasses={managedClasses} visible={true} />
        );

        expect(rendered.find(`.${managedClasses.dialog}`).prop("aria-hidden")).toEqual(
            false
        );
    });

    test("should call the `onDismiss` callback after a click event on the modal overlay when `visible` prop is true", () => {
        const onDismiss: any = jest.fn();
        const rendered: any = shallow(
            <Dialog managedClasses={managedClasses} modal={true} onDismiss={onDismiss} />
        );

        rendered.find(`.${managedClasses.dialog_modalOverlay}`).simulate("click");

        expect(onDismiss).toHaveBeenCalledTimes(0);

        rendered.setProps({ visible: true });

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
            <Dialog managedClasses={managedClasses} modal={true} onDismiss={onDismiss} />
        );

        map.keydown({ keyCode: KeyCodes.escape });

        expect(onDismiss).toHaveBeenCalledTimes(0);

        // set visible prop
        rendered.setProps({ visible: true });

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
            <Dialog
                managedClasses={managedClasses}
                modal={true}
                onDismiss={onDismiss}
                visible={true}
            />
        );

        rendered.unmount();

        map.keydown({ keyCode: KeyCodes.escape });

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });
});
