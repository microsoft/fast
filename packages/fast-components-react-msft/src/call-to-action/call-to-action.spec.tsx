import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16/build";
import { configure, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import CallToAction,
{
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

// describe("call to action", (): void => {
//     const Component: React.ComponentClass<ICallToActionHandledProps & ICallToActionManagedClasses> = examples.component;
//     const managedClasses: ICallToActionClassNameContract = {
//         hypertext: "hypertext",
//         callToAction_primary: "call-to-action-primary",
//         callToAction_secondary: "call-to-action-secondary",
//         callToAction_lightweight: "call-to-action-lightweight",
//         callToAction_span: "call-to-action-span",
//         "@keyframes cta-glyph-move-out": "cta-glyph-move-out",
//         "@keyframes cta-glyph-move-in": "cta-glyph-move-in",
//         "@keyframes cta-text-move-in": "cta-text-move-in",
//         "@keyframes cta-text-move-out": "cta-text-move-out"
//     };
//     const href: string = "#";

//     test("should implement unhandledProps", () => {
//         const handledProps: ICallToActionProps & ICallToActionManagedClasses = {
//             managedClasses,
//             href,
//             children: "text"
//         };

//         const unhandledProps: ICallToActionUnhandledProps = {
//             "data-my-custom-attribute": true
//         };

//         const props: CallToActionProps = {...handledProps, ...unhandledProps};

//         const rendered: any = shallow(
//             <Component {...props} />
//         );

//         expect(rendered.first().prop("data-my-custom-attribute")).toEqual(true);
//     });

//     // tslint:disable-next-line:max-line-length
//     test("should set a className that matches callToAction_primary managedClass when CallToActionAppearance.primary is passed to the appearance prop", () => {
//         const props: IButtonHandledProps = {
//             appearance: CallToActionAppearance.primary
//         };

//         const rendered: any = shallow(
//             <Component {...props}/>
//         );

//         const callToAction: any = rendered.first().shallow();
//         // Get the expected className value from the list of generated managed classes
//         const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction_primary;

//         expect(callToAction.instance().props.appearance).toEqual(CallToActionAppearance.primary);
//         // Generated managedClass should be passed to className
//         expect(callToAction.prop("className")).toBe(expectedClassName);
//     });

//     // tslint:disable-next-line:max-line-length
//     test("should set a className that matches callToAction_secondary managedClass when CallToActionAppearance.secondary is passed to the appearance prop", () => {
//         const props: IButtonHandledProps = {
//             appearance: CallToActionAppearance.secondary
//         };

//         const rendered: any = shallow(
//             <Component {...props}/>
//         );

//         const callToAction: any = rendered.first().shallow();
//         // Get the expected className value from the list of generated managed classes
//         const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction_secondary;

//         expect(callToAction.instance().props.appearance).toEqual(CallToActionAppearance.secondary);
//         // Generated managedClass should be passed to className
//         expect(callToAction.prop("className")).toBe(expectedClassName);
//     });

//     // tslint:disable-next-line:max-line-length
//     test("should set a className that matches callToAction_lightweight managedClass when CallToActionAppearance.lightweight is passed to the appearance prop", () => {
//         const props: IButtonHandledProps = {
//             appearance: CallToActionAppearance.lightweight
//         };

//         const rendered: any = shallow(
//             <Component {...props}/>
//         );

//         const callToAction: any = rendered.first().shallow();
//         // Get the expected className value from the list of generated managed classes
//         const expectedClassName: string = callToAction.instance().props.managedClasses.callToAction_lightweight;

//         expect(callToAction.instance().props.appearance).toEqual(CallToActionAppearance.lightweight);
//         // Generated managedClass should be passed to className
//         expect(callToAction.prop("className")).toBe(expectedClassName);
//     });
// });
