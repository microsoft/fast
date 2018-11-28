import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16/build";
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

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("action toggle", (): void => {
    const managedClasses: ActionToggleClassNameContract = {
        actionToggle: "action-toggle",
        actionToggle_selectedGlyph: "selectedGlyph",
        actionToggle_unselectedGlyph: "unselectedGlyph",
        actionToggle__primary: "action-toggle-primary",
        actionToggle__lightweight: "action-toggle-lightweight",
        actionToggle__disabled: "action-toggle-disabled",
        actionToggle__selected: "action-toggle-selected",
        actionToggle__hasGlyphAndContent: "action-toggle-hasGlyphAndContent",
    };
    const href: string = "#";

    test("should have a displayName that matches the component name", () => {
        expect((MSFTActionToggle as any).name).toBe(MSFTActionToggle.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(
                <MSFTActionToggle selectedLabel="selected" unselectedLabel="unselected" />
            );
        }).not.toThrow();
    });

    test("should create unselectedglyph element passed in", () => {
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

    test("should create selectedglyph element passed in", () => {
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
            managedClasses,
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

    test("should apply a 'disabled' html class when prop disabled is passed", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            disabled: true,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__disabled"
        );
    });

    test("should apply a custom class-name", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });

    test("should apply the custom selected ARIA label", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: true,
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("aria-label")).toEqual("selected");
    });

    test("should apply the custom unselected ARIA label", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
            selected: false,
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("aria-label")).toEqual("unselected");
    });

    test("should call a registered callback after a change event", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
        };
        const onChange: any = jest.fn();
        const rendered: any = mount(
            <ActionToggle
                className={"custom-class-name"}
                {...props}
                onChange={onChange}
            />
        );

        rendered.find("button").simulate("click");

        expect(onChange).toHaveBeenCalledTimes(1);

        rendered.find("button").simulate("click");

        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test("should apply selected class after click event", () => {
        const props: ActionToggleHandledProps = {
            selectedLabel: "selected",
            unselectedLabel: "unselected",
        };
        const onChange: any = jest.fn();
        const rendered: any = mount(
            <ActionToggle
                className={"custom-class-name"}
                {...props}
                onChange={onChange}
            />
        );

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
        const onChange: any = jest.fn();
        const rendered: any = mount(
            <ActionToggle
                className={"custom-class-name"}
                {...props}
                onChange={onChange}
            />
        );

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

    test("should not apply a hasGlyphandContent  class when display is glyph only", () => {
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
