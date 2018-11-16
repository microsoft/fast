import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16/build";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTActionTrigger, {
    ActionTriggerAppearance,
    ActionTriggerHandledProps,
    ActionTriggerManagedClasses,
    ActionTriggerProps,
    ActionTriggerUnhandledProps,
} from "./action-trigger";
import { ActionTrigger } from "./index";
import { ActionTriggerClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("action trigger", (): void => {
    const managedClasses: ActionTriggerClassNameContract = {
        actionTrigger: "action-trigger",
        actionTrigger_glyph: "glyph",
        actionTrigger__primary: "action-trigger-primary",
        actionTrigger__outline: "action-trigger-outline",
        actionTrigger__lightweight: "action-trigger-lightweight",
        actionTrigger__justified: "action-trigger-justified",
        actionTrigger__disabled: "action-trigger-disabled",
    };
    const href: string = "#";

    test("should have a displayName that matches the component name", () => {
        expect((MSFTActionTrigger as any).name).toBe(MSFTActionTrigger.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<MSFTActionTrigger glyph={null} />);
            shallow(<MSFTActionTrigger glyph={null} disabled={true} />);
            shallow(
                <MSFTActionTrigger
                    glyph={null}
                    appearance={ActionTriggerAppearance.primary}
                />
            );
        }).not.toThrow();
    });

    test("should implement unhandledProps", () => {
        const handledProps: ActionTriggerProps = {
            managedClasses,
            href,
            glyph: null,
            children: "text",
        };

        const unhandledProps: ActionTriggerUnhandledProps = {
            "aria-label": "label",
        };

        const props: ActionTriggerProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'primary' html class when appearance is primary", () => {
        const props: ActionTriggerHandledProps = {
            glyph: null,
            appearance: ActionTriggerAppearance.primary,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__primary"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const props: ActionTriggerHandledProps = {
            glyph: null,
            appearance: ActionTriggerAppearance.lightweight,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__lightweight"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'justified' html class when appearance is justified", () => {
        const props: ActionTriggerHandledProps = {
            glyph: null,
            appearance: ActionTriggerAppearance.justified,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__justified"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'outline' html class when appearance is outline", () => {
        const props: ActionTriggerHandledProps = {
            glyph: null,
            appearance: ActionTriggerAppearance.outline,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__outline"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'disabled' html class when prop disabled is passed", () => {
        const props: ActionTriggerHandledProps = {
            glyph: null,
            disabled: true,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__disabled"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should set a custom class name and 'primary' class name when appearance is primary and a custom class is passed", () => {
        const props: ActionTriggerHandledProps = {
            glyph: null,
            appearance: ActionTriggerAppearance.primary,
        };

        const rendered: any = mount(
            <ActionTrigger className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__primary"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a custom class-name", () => {
        const rendered: any = mount(
            <ActionTrigger className={"custom-class-name"} glyph={null} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });
});
