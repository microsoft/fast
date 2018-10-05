import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16/build";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import MSFTCallToAction, {
    CallToActionAppearance,
    CallToActionHandledProps,
    CallToActionManagedClasses,
    CallToActionProps,
    CallToActionUnhandledProps
} from "./call-to-action";
import { CallToAction } from "./index";

import { CallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("call to action snapshot", (): void => {
    generateSnapshots(examples);
});

describe("call to action", (): void => {
    const managedClasses: CallToActionClassNameContract = {
        callToAction: "call-to-action",
        callToAction_glyph: "glyph",
        callToAction__primary: "call-to-action-primary",
        callToAction__lightweight: "call-to-action-lightweight",
        callToAction__justified: "call-to-action-justified",
        callToAction__disabled: "call-to-action-disabled",
    };
    const href: string = "#";

    test("should have a displayName that matches the component name", () => {
        expect((MSFTCallToAction as any).name).toBe(MSFTCallToAction.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(
            () => {
                shallow(<MSFTCallToAction />);
                shallow(<MSFTCallToAction disabled={true} />);
                shallow(<MSFTCallToAction appearance={CallToActionAppearance.primary} />);
                shallow(<MSFTCallToAction appearance={CallToActionAppearance.lightweight} />);
                shallow(<MSFTCallToAction appearance={CallToActionAppearance.justified} />);
            }
        ).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const handledProps: CallToActionProps & CallToActionManagedClasses = {
            managedClasses,
            href,
            children: "text"
        };

        const unhandledProps: CallToActionUnhandledProps = {
            "data-my-custom-attribute": true
        };

        const props: CallToActionProps = {...handledProps, ...unhandledProps};

        const rendered: any = mount(
            <CallToAction {...props} />
        );

        expect(rendered.first().prop("data-my-custom-attribute")).toEqual(true);
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'primary' html class when appearance is primary", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.primary
        };

        const rendered: any = mount(
            <CallToAction {...props}/>
        );

        expect(rendered.find("button").prop("className")).toContain("callToAction__primary");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.lightweight
        };

        const rendered: any = mount(
            <CallToAction {...props}/>
        );

        expect(rendered.find("button").prop("className")).toContain("callToAction__lightweight");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'justified' html class when appearance is justified", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.justified
        };

        const rendered: any = mount(
            <CallToAction {...props}/>
        );

        expect(rendered.find("button").prop("className")).toContain("callToAction__justified");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'disabled' html class when prop disabled is passed", () => {
        const props: CallToActionHandledProps = {
            disabled: true
        };

        const rendered: any = mount(
            <CallToAction {...props}/>
        );

        expect(rendered.find("button").prop("className")).toContain("callToAction__disabled");
    });

    // tslint:disable-next-line:max-line-length
    test("should set a custom class name and 'primary' class name when appearance is primary and a custom class is passed", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.primary
        };

        const rendered: any = mount(
            <CallToAction className={"custom-class-name"} {...props}/>
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
        expect(rendered.find("button").prop("className")).toContain("callToAction__primary");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a custom class-name", () => {
        const rendered: any = mount(
            <CallToAction className={"custom-class-name"} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });
});
