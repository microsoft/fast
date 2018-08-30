import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { 
    ISubheadingHandledProps,
    ISubheadingManagedClasses,
    ISubheadingUnhandledProps,
    SubheadingLevel,
    SubheadingTag,
 } from "./subheading";

 /**
  * Configure enzyme
  */
 configure({adapter: new Adapter()});

 describe("generate snapshots", (): void => {
     generateSnapshots(examples);
 }

 describe("subheading", (): void => {

    const Component: React.ComponentClass<ISubheadingHandledProps> = examples.component;

    test("should return a valid object which includes all props that are not enumerated as handledProps", (): void => {
        const handledProps: ISubheadingHandledProps = {
            tag: SubheadingTag.h1,
            level: SubheadingLevel._1
        };

        const unhandledProps: ISubheadingUnhandledProps = {
            "aria-hidden": true
        };

        const props: ISubheadingHandledProps & ISubheadingUnhandledProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        const subheading: any = rendered.first().shallow();

        expect(subheading.prop("aria-hidden")).toEqual(true);
    });

    test("should render the correct `tag` when `tag` prop is passed in", (): void => {
        const rendered: any = shallow(
            <Component tag={SubheadingTag.h4} />
        );

        const subheading: any = rendered.first().shallow();

        expect(subheading.instance().props.tag).toEqual(SubheadingTag.h4);
    });

    test("should render default level if none is specified", (): void => {
        const rendered: any = shallow(
            <Component />
        );

        const subheading: any = rendered.first().shallow();

        expect(subheading.instance().props.level).toEqual(SubheadingLevel._1);
    });
 });