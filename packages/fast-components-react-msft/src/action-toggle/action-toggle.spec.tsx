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
        actionToggle__outline: "action-toggle-outline",
        actionToggle__lightweight: "action-toggle-lightweight",
        actionToggle__justified: "action-toggle-justified",
        actionToggle__disabled: "action-toggle-disabled",
        actionToggle__selected: "action-toggle-selected",
        actionToggle__singleElement: "action-toggle-singleElement",
    };
    const href: string = "#";

    test("should have a displayName that matches the component name", () => {
        expect((MSFTActionToggle as any).name).toBe(MSFTActionToggle.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(
                <MSFTActionToggle
                    selectedARIALabel="selected"
                    unselectedARIALabel="unselected"
                />
            );
        }).not.toThrow();
    });

    // tslint:disable-next-line:max-line-length
    test("should create unselectedglyph element passed in", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>Y</div>;
            },
            appearance: ActionToggleAppearance.primary,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.contains(<div>Y</div>)).toEqual(true);
    });

    // tslint:disable-next-line:max-line-length
    test("should create selectedglyph element passed in", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>Y</div>;
            },
            selected: true,
            appearance: ActionToggleAppearance.primary,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.contains(<div>X</div>)).toEqual(true);
    });

    test("should implement unhandledProps", () => {
        const handledProps: ActionToggleProps = {
            managedClasses,
            href,
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            children: "text",
        };

        const unhandledProps: ActionToggleUnhandledProps = {
            "aria-label": "label",
        };

        const props: ActionToggleProps = { ...handledProps, ...unhandledProps };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'primary' html class when appearance is primary", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            appearance: ActionToggleAppearance.primary,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__primary"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'lightweight' html class when appearance is lightweight", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            appearance: ActionToggleAppearance.lightweight,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__lightweight"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'justified' html class when appearance is justified", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            appearance: ActionToggleAppearance.justified,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__justified"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'outline' html class when appearance is outline", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            appearance: ActionToggleAppearance.outline,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__outline"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a 'disabled' html class when prop disabled is passed", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            disabled: true,
        };

        const rendered: any = mount(<ActionToggle {...props} />);

        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__disabled"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should set a custom class name and 'primary' class name when appearance is primary and a custom class is passed", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            appearance: ActionToggleAppearance.primary,
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
        expect(rendered.find("button").prop("className")).toContain(
            "actionToggle__primary"
        );
    });

    // tslint:disable-next-line:max-line-length
    test("should apply a custom class-name", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply the custom selected ARIA label", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            selected: true,
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("aria-label")).toEqual("selected");
    });

    // tslint:disable-next-line:max-line-length
    test("should apply the custom unselected ARIA label", () => {
        const props: ActionToggleHandledProps = {
            selectedARIALabel: "selected",
            unselectedARIALabel: "unselected",
            selected: false,
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("aria-label")).toEqual("unselected");
    });
});
