import React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16/build";
import { configure, mount, shallow } from "enzyme";
import examples from "./examples.data";
import MSFTActionToggle, {
    ActionToggleAppearance,
    ActionToggleHandledProps,
    ActionToggleManagedClasses,
    ActionToggleProps,
    ActionToggleUnhandledProps,
} from "./action-toggle";
import { ActionToggle } from "./index";
import { ActionToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DisplayNamePrefix } from "../utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("action toggle", (): void => {
    const href: string = "#";
    const classes: ActionToggleClassNameContract = {
        actionToggle: "actionToggle",
        actionToggle__primary: "actionToggle__primary",
        actionToggle__lightweight: "actionToggle__lightweight",
        actionToggle__justified: "actionToggle__justified",
        actionToggle__outline: "actionToggle__outline",
        actionToggle__disabled: "actionToggle__disabled",
    };

    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(MSFTActionToggle as any).name}`).toBe(
            MSFTActionToggle.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(
                <MSFTActionToggle selectedLabel="selected" unselectedLabel="unselected" />
            );
        }).not.toThrow();
    });

    test("should create unselectedglyph if element passed in", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>Y</div>;
            },
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.contains(<div>Y</div>)).toEqual(true);
    });

    test("should create selectedglyph if element passed in", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>Y</div>;
            },
            selected: true,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.contains(<div>X</div>)).toEqual(true);
    });

    test("should implement unhandledProps", () => {
        const handledProps: ActionToggleProps = {
            href,
            selectedLabel: "selected",
            unselectedLabel: "unselected",
        };

        const unhandledProps: ActionToggleUnhandledProps = {
            "aria-label": "label",
        };

        const props: ActionToggleProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should add a custom class name if a class name has been provided", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });

    test("should apply a 'disabled' html class when prop disabled is passed", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            disabled: true,
            managedClasses: classes,
        };

        const rendered: any = mount(<MSFTActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__disabled"
        );
    });

    test("should apply a 'primary' html class when appearance is primary", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: true,
            appearance: ActionToggleAppearance.primary,
            managedClasses: classes,
        };

        const rendered: any = mount(<MSFTActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__primary"
        );
    });

    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: true,
            appearance: ActionToggleAppearance.lightweight,
            managedClasses: classes,
        };

        const rendered: any = mount(<MSFTActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__lightweight"
        );
    });

    test("should apply a 'justified' html class when appearance is justified", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: true,
            appearance: ActionToggleAppearance.justified,
            managedClasses: classes,
        };

        const rendered: any = mount(<MSFTActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__justified"
        );
    });

    test("should apply a 'outline' html class when appearance is outline", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: true,
            appearance: ActionToggleAppearance.outline,
            managedClasses: classes,
        };

        const rendered: any = mount(<MSFTActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__outline"
        );
    });

    test("should apply selected ARIA label if prop is set", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: true,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("aria-label")).toEqual("selected");
    });

    test("should apply the unselected ARIA label if prop is set", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: false,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("aria-label")).toEqual("unselected");
    });

    test("should call a registered callback after a change event", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
        };
        const onToggle: any = jest.fn();
        const rendered: any = mount(<ActionToggle {...props} onToggle={onToggle} />);

        rendered.find("button").simulate("click");

        expect(onToggle).toHaveBeenCalledTimes(1);

        rendered.find("button").simulate("click");

        expect(onToggle).toHaveBeenCalledTimes(2);
    });

    test("should apply selected class after click event", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
        };
        const onToggle: any = jest.fn();
        const rendered: any = mount(<ActionToggle {...props} onToggle={onToggle} />);

        expect(rendered.find("button").prop("className")).not.toContain(
            "actionToggle__selected"
        );
        rendered.find("button").simulate("click");
        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__selected"
        );
    });

    test("should not apply selected class after click event when props specify selected = false", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: false,
        };
        const onToggle: any = jest.fn();
        const rendered: any = mount(<ActionToggle {...props} onToggle={onToggle} />);

        expect(rendered.find("button").prop("className")).not.toContain(
            "actionToggle__selected"
        );
        rendered.find("button").simulate("click");
        expect(rendered.find("button").prop("className")).not.toContain(
            "actionToggle__selected"
        );
    });

    test("should apply a hasGlyphAndContent class when display is content only", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selectedContent: "selected",
            unselectedContent: "unselected",
        };

        const rendered: any = mount(<ActionToggle {...props} />);
        expect(rendered.find("button").prop("className")).not.toContain(
            "actionToggle__hasGlyphAndContent"
        );

        rendered.find("button").simulate("click");
        expect(rendered.find("button").prop("className")).not.toContain(
            "actionToggle__hasGlyphAndContent"
        );
    });

    test("should not apply a hasGlyphandContent class when display is glyph only", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>Y</div>;
            },
        };

        const rendered: any = mount(<ActionToggle {...props} />);
        expect(rendered.find("button").prop("className")).not.toContain(
            "actionToggle__hasGlyphandContent"
        );

        rendered.find("button").simulate("click");
        expect(rendered.find("button").prop("className")).not.toContain(
            "actionToggle__hasGlyphandContent"
        );
    });

    test("should apply a hasGlyphandContent class when display includes content and glyph", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selectedContent: "selected",
            unselectedContent: "unselected",
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>Y</div>;
            },
        };

        const rendered: any = mount(<ActionToggle {...props} />);
        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__hasGlyphAndContent"
        );

        rendered.find("button").simulate("click");
        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__hasGlyphAndContent"
        );
    });
});
