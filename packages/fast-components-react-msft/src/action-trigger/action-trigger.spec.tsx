import React from "react";
import Adapter from "enzyme-adapter-react-16/build";
import { configure, mount, shallow } from "enzyme";
import { ActionTriggerClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DisplayNamePrefix } from "../utilities";
import MSFTActionTrigger, {
    ActionTriggerAppearance,
    ActionTriggerHandledProps,
    ActionTriggerProps,
    ActionTriggerUnhandledProps,
} from "./action-trigger";
import { ActionTrigger } from "./index";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("action trigger", (): void => {
    const managedClasses: ActionTriggerClassNameContract = {
        actionTrigger: "action-trigger",
        actionTrigger_glyph: "glyph",
        actionTrigger__justified: "action-trigger-justified",
        actionTrigger__lightweight: "action-trigger-lightweight",
        actionTrigger__outline: "action-trigger-outline",
        actionTrigger__primary: "action-trigger-primary",
        actionTrigger__stealth: "action-trigger-stealth",
        actionTrigger__disabled: "action-trigger-disabled",
        actionTrigger__hasGlyphAndContent: "action-trigger-has-glyph-and-content",
    };
    const href: string = "#";

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTActionTrigger as any).name}`).toBe(
            MSFTActionTrigger.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(
                <MSFTActionTrigger
                    glyph={(className?: string): React.ReactNode => {
                        return <div className={className}>X</div>;
                    }}
                />
            );
        }).not.toThrow();
    });

    test("should not throw if glyph prop is not provided", () => {
        expect(() => {
            shallow(<MSFTActionTrigger glyph={null} />);
        }).not.toThrow();
    });

    test("should create glyph element passed in", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            appearance: ActionTriggerAppearance.primary,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.contains(<div>X</div>)).toEqual(true);
    });

    test("should implement unhandledProps", () => {
        const handledProps: ActionTriggerProps = {
            managedClasses,
            href,
            glyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            children: "text",
        };

        const unhandledProps: ActionTriggerUnhandledProps = {
            "aria-label": "label",
        };

        const props: ActionTriggerProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should apply a 'justified' html class when appearance is justified", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
            appearance: ActionTriggerAppearance.justified,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__justified"
        );
    });

    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
            appearance: ActionTriggerAppearance.lightweight,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__lightweight"
        );
    });

    test("should apply a 'outline' html class when appearance is outline", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
            appearance: ActionTriggerAppearance.outline,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__outline"
        );
    });

    test("should apply a 'primary' html class when appearance is primary", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
            appearance: ActionTriggerAppearance.primary,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__primary"
        );
    });

    test("should apply a 'stealth' html class when appearance is stealth", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
            appearance: ActionTriggerAppearance.stealth,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__stealth"
        );
    });

    test("should apply a 'disabled' html class when prop disabled is passed", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
            disabled: true,
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__disabled"
        );
    });

    test("should set a custom class name and 'primary' class name when appearance is primary and a custom class is passed", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
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

    test("should apply a custom class-name", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
        };

        const rendered: any = mount(
            <ActionTrigger className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });

    test("should apply 'hasGlyphandContent' class when display includes content and glyph", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
            children: "text",
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionTrigger__hasGlyphAndContent"
        );
    });

    test("should not apply 'hasGlyphandContent' class when displaying only glyph", () => {
        const props: ActionTriggerHandledProps = {
            glyph: (className?: string): React.ReactNode => {
                return <div className={className}>X</div>;
            },
        };

        const rendered: any = mount(<ActionTrigger {...props} />);

        expect(rendered.find("button").prop("className")).not.toContain(
            "actionTrigger__hasGlyphAndContent"
        );
    });
});
