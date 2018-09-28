import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTSubheading, {
    ISubheadingHandledProps,
    ISubheadingManagedClasses,
    ISubheadingUnhandledProps,
    SubheadingLevel,
    SubheadingTag,
 } from "./subheading";
import { Subheading } from "./index";

 /**
  * Configure enzyme
  */
configure({adapter: new Adapter()});

describe("generate snapshots", (): void => {
    generateSnapshots(examples);
});

describe("subheading", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((MSFTSubheading as any).name).toBe(MSFTSubheading.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<MSFTSubheading />);
                shallow(<MSFTSubheading level={SubheadingLevel._1} />);
            }
        ).not.toThrow();
    });

    test("should return a valid object which includes all props that are not enumerated as handledProps", (): void => {
        const handledProps: ISubheadingHandledProps = {
            tag: SubheadingTag.h1,
            size: SubheadingLevel._1
        };

        const unhandledProps: ISubheadingUnhandledProps = {
            "aria-hidden": true
        };

        const props: ISubheadingHandledProps & ISubheadingUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Subheading {...props} />
        );

        const subheading: any = rendered.first().shallow();

        expect(subheading.prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `tag` when `tag` prop is passed in", (): void => {
        const rendered: any = shallow(
            <Subheading tag={SubheadingTag.h4} />
        );

        const subheading: any = rendered.first().shallow();

        expect(subheading.instance().props.tag).toEqual(SubheadingTag.h4);
    });

    test("should render default size if none is specified", (): void => {
        const rendered: any = shallow(
            <Subheading />
        );

        const subheading: any = rendered.first().shallow();

        expect(subheading.instance().props.size).toEqual(SubheadingLevel._1);
    });
});
