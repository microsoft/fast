import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Label, {
    ILabelClassNameContract,
    ILabelHandledProps,
    ILabelManagedClasses,
    ILabelUnhandledProps,
    LabelProps,
    LabelTag
} from "./label";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("label snapshot", (): void => {
    generateSnapshots(examples);
});

describe("label", (): void => {
    const managedClasses: ILabelClassNameContract = {
        label: "label-class",
        label__hidden: "label-hidden-class"
    };

    test("should have a displayName that matches the component name", () => {
        expect((Label as any).name).toBe(Label.displayName);
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ILabelHandledProps & ILabelManagedClasses = {
            managedClasses,
            tag: LabelTag.label
        };
        const unhandledProps: ILabelUnhandledProps = {
            "aria-hidden": true
        };
        const props: LabelProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Label {...props} />
        );

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should correctly handle children", () => {
        const rendered: any = shallow(
            <Label managedClasses={managedClasses} tag={LabelTag.label}>
                Children
            </Label>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });

    test("should render with a default tag of `label` if no `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Label managedClasses={managedClasses} />
        );

        expect(rendered.prop("tag")).toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(LabelTag.label);
        expect(rendered.type()).toBe(LabelTag.label);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Label managedClasses={managedClasses} tag={LabelTag.legend} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(LabelTag.legend);
        expect(rendered.type()).toBe(LabelTag.legend);
    });

    test("should add the base className", () => {
        const rendered: any = shallow(
            <Label managedClasses={managedClasses} />
        );

        expect(rendered.hasClass("label-class")).toBe(true);
    });

    test("should add the hidden className and the base className when the hidden prop is passed", () => {
        const renderedHidden: any = shallow(
            <Label managedClasses={managedClasses} hidden={true} />
        );

        expect(renderedHidden.hasClass("label-class label-hidden-class")).toBe(true);
    });
});
