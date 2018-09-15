import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16/build";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    CallToActionAppearance,
    CallToActionProps,
    ICallToActionHandledProps,
    ICallToActionManagedClasses,
    ICallToActionUnhandledProps
} from "./call-to-action";
import { ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("call to action snapshot", (): void => {
    generateSnapshots(examples);
});

describe("call to action", (): void => {
    const Component: React.ComponentClass<ICallToActionHandledProps & ICallToActionManagedClasses> = examples.component;
    const managedClasses: ICallToActionClassNameContract = {
        callToAction: "call-to-action",
        callToAction_glyph: "glyph"
        callToAction__primary: "call-to-action-primary",
        callToAction__lightweight: "call-to-action-lightweight",
        callToAction__justified: "call-to-action-justified",
        callToAction__disabled: "call-to-action-disabled",
    };
    const href: string = "#";

    test("should implement unhandledProps", () => {
        const handledProps: ICallToActionProps & ICallToActionManagedClasses = {
            managedClasses,
            href,
            children: "text"
        };

        const unhandledProps: ICallToActionUnhandledProps = {
            "data-my-custom-attribute": true
        };

        const props: CallToActionProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.first().prop("data-my-custom-attribute")).toEqual(true);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a className that matches callToAction__primary managedClass when CallToActionAppearance.primary is passed to the appearance prop", () => {
        const props: ICallToActionHandledProps = {
            appearance: CallToActionAppearance.primary
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction__primary;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;

        expect(callToAction.instance().props.appearance).toEqual(CallToActionAppearance.primary);
        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName}`);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a className that matches callToAction__lightweight managedClass when CallToActionAppearance.lightweight is passed to the appearance prop", () => {
        const props: ICallToActionHandledProps = {
            appearance: CallToActionAppearance.lightweight
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction__lightweight;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;

        expect(callToAction.instance().props.appearance).toEqual(CallToActionAppearance.lightweight);
        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName}`);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a className that matches callToAction__justified managedClass when CallToActionAppearance.justified is passed to the appearance prop", () => {
        const props: ICallToActionHandledProps = {
            appearance: CallToActionAppearance.justified
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction__justified;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;

        expect(callToAction.instance().props.appearance).toEqual(CallToActionAppearance.justified);
        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName}`);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a className that matches callToAction__disabled managedClass when disabled prop is passed", () => {
        const props: ICallToActionHandledProps = {
            disabled: true
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction__disabled;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;

        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName}`);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a custom class name and appearance class name when a custom class name and CallToActionAppearance.primary appearance prop is passed", () => {
        const props: ICallToActionHandledProps = {
            appearance: CallToActionAppearance.primary
        };

        const rendered: any = shallow(
            <Component className={"custom-class-name"} {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction__primary;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;
        const customClassName: string = "custom-class-name";

        expect(callToAction.instance().props.appearance).toEqual(CallToActionAppearance.primary);
        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName} ${customClassName}`);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a custom class name and root class name when a custom class name is passed", () => {

        const rendered: any = shallow(
            <Component className={"custom-class-name"} />
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;
        const customClassName: string = "custom-class-name";

        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${customClassName}`);
    });
});
