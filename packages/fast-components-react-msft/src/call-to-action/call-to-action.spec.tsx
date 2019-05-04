import React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16/build";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTCallToAction, {
    CallToActionAppearance,
    CallToActionHandledProps,
    CallToActionManagedClasses,
    CallToActionProps,
    CallToActionUnhandledProps,
} from "./call-to-action";
import { CallToAction } from "./index";
import { CallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("call to action", (): void => {
    const managedClasses: CallToActionClassNameContract = {
        callToAction: "call-to-action",
        callToAction_glyph: "glyph",
        callToAction__justified: "call-to-action-justified",
        callToAction__lightweight: "call-to-action-lightweight",
        callToAction__outline: "call-to-action-outline",
        callToAction__primary: "call-to-action-primary",
        callToAction__stealth: "call-to-action-stealth",
        callToAction__disabled: "call-to-action-disabled",
    };
    const href: string = "#";

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTCallToAction as any).name}`).toBe(
            MSFTCallToAction.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTCallToAction />);
            shallow(<MSFTCallToAction disabled={true} />);
            shallow(<MSFTCallToAction appearance={CallToActionAppearance.justified} />);
            shallow(<MSFTCallToAction appearance={CallToActionAppearance.lightweight} />);
            shallow(<MSFTCallToAction appearance={CallToActionAppearance.outline} />);
            shallow(<MSFTCallToAction appearance={CallToActionAppearance.primary} />);
            shallow(<MSFTCallToAction appearance={CallToActionAppearance.stealth} />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const handledProps: CallToActionProps & CallToActionManagedClasses = {
            managedClasses,
            href,
            children: "text",
        };

        const unhandledProps: CallToActionUnhandledProps = {
            "aria-label": "label",
        };

        const props: CallToActionProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<CallToAction {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should apply a 'justified' html class when appearance is justified", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.justified,
        };

        const rendered: any = mount(<CallToAction {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "callToAction__justified"
        );
    });

    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.lightweight,
        };

        const rendered: any = mount(<CallToAction {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "callToAction__lightweight"
        );
    });

    test("should apply a 'outline' html class when appearance is outline", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.outline,
        };

        const rendered: any = mount(<CallToAction {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "callToAction__outline"
        );
    });

    test("should apply a 'primary' html class when appearance is primary", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.primary,
        };

        const rendered: any = mount(<CallToAction {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "callToAction__primary"
        );
    });

    test("should apply a 'stealth' html class when appearance is stealth", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.stealth,
        };

        const rendered: any = mount(<CallToAction {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "callToAction__stealth"
        );
    });

    test("should apply a 'disabled' html class when prop disabled is passed", () => {
        const props: CallToActionHandledProps = {
            disabled: true,
        };

        const rendered: any = mount(<CallToAction {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "callToAction__disabled"
        );
    });

    test("should set a custom class name and 'primary' class name when appearance is primary and a custom class is passed", () => {
        const props: CallToActionHandledProps = {
            appearance: CallToActionAppearance.primary,
        };

        const rendered: any = mount(
            <CallToAction className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
        expect(rendered.find("button").prop("className")).toContain(
            "callToAction__primary"
        );
    });

    test("should apply a custom class-name when passed", () => {
        const rendered: any = mount(<CallToAction className={"custom-class-name"} />);

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });
});
