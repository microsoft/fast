import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16/build";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import CallToAction,
{
    CallToActionProps,
    ICallToActionHandledProps,
    ICallToActionManagedClasses,
    ICallToActionUnhandledProps
} from "./call-to-action";
import { ButtonAppearance, IButtonHandledProps } from "../button/button.props";
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
        callToAction_backer: "call-to-action-backer",
        callToAction_lightweight: "call-to-action-lightweight",
        glyph: "glyph"
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
    test("should set a className that matches callToAction_backer managedClass when ButtonAppearance.primary is passed to the appearance prop", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.primary
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction_backer;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;

        expect(callToAction.instance().props.appearance).toEqual(ButtonAppearance.primary);
        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName}`);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a className that matches callToAction_lightweight managedClass when ButtonAppearance.lightweight is passed to the appearance prop", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.lightweight
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction_lightweight;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;

        expect(callToAction.instance().props.appearance).toEqual(ButtonAppearance.lightweight);
        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName}`);
    });

    // tslint:disable-next-line:max-line-length
    test("should set a className that matches callToAction_lightweight managedClass when ButtonAppearance.justified is passed to the appearance prop", () => {
        const props: IButtonHandledProps = {
            appearance: ButtonAppearance.justified
        };

        const rendered: any = shallow(
            <Component {...props}/>
        );

        const callToAction: any = rendered.first().shallow();
        // Get the expected className value from the list of generated managed classes
        const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction_lightweight;
        const rootClassName: string = callToAction.instance().props.managedClasses.callToAction;

        expect(callToAction.instance().props.appearance).toEqual(ButtonAppearance.justified);
        // Generated managedClass should be passed to className
        expect(callToAction.prop("className")).toBe(`${rootClassName} ${expectedClassName}`);
    });
});
