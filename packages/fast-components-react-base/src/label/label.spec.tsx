import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import Label, { ILabelClassNameContract } from "./label";
import {
    ILabelHandledProps,
    ILabelMangedClasses,
    ILabelUnhandledProps,
    LabelProps,
    LabelTag
} from "./label.props";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("label", (): void => {
    generateSnapshots(examples);
});

describe("label unit-tests", (): void => {
    let Component: React.ComponentClass<ILabelHandledProps & ILabelMangedClasses>;
    let managedClasses: ILabelClassNameContract;

    beforeEach(() => {
        Component = examples.component;
        managedClasses = {
            label: "label-class",
            label_hidden: "label-hidden-class"
        };
    });

    test("should correctly manage unhandledProps", () => {
        const handledProps: ILabelHandledProps & ILabelMangedClasses = {
            managedClasses,
            tag: LabelTag.label
        };
        const unhandledProps: ILabelUnhandledProps = {
            "aria-hidden": true
        };
        const props: LabelProps = {...handledProps, ...unhandledProps};
        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.props()["aria-hidden"]).not.toBe(undefined);
        expect(rendered.props()["aria-hidden"]).toEqual(true);
    });

    test("should correctly handle children", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} tag={LabelTag.label}>
                Children
            </Component>
        );

        expect(rendered.prop("children")).not.toBe(undefined);
        expect(rendered.prop("children")).toEqual("Children");
    });

    test("should render with a default tag of `label` if no `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} />
        );

        expect(rendered.prop("tag")).toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(LabelTag.label);
    });

    test("should render the correct `tag` when `tag` prop is passed", () => {
        const rendered: any = shallow(
            <Component managedClasses={managedClasses} tag={LabelTag.legend} />
        );

        expect(rendered.instance().props.tag).not.toBe(undefined);
        expect(rendered.instance().props.tag).toEqual(LabelTag.legend);
    });
});
