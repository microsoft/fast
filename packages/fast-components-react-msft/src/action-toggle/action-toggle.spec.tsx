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
                    /* tslint:disable-next-line */
                    selectedGlyph={(className?: string): React.ReactNode => {
                        return <div>X</div>;
                    }}
                    /* tslint:disable-next-line */
                    unselectedGlyph={(className?: string): React.ReactNode => {
                        return <div>X</div>;
                    }}
                />
            );
        }).not.toThrow();
    });

    test("should throw if glyph props are not provided", () => {
        expect(() => {
            shallow(
                <MSFTActionToggle
                    /* tslint:disable-next-line */
                    selectedGlyph={null}
                    /* tslint:disable-next-line */
                    unselectedGlyph={null}
                />
            );
        }).toThrow();
    });

    // tslint:disable-next-line:max-line-length
    test("should create unselectedglyph element passed in", () => {
        const props: ActionToggleHandledProps = {
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
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
            selectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
            unselectedGlyph: (className?: string): React.ReactNode => {
                return <div>X</div>;
            },
        };

        const rendered: any = mount(
            <ActionToggle className={"custom-class-name"} {...props} />
        );

        expect(rendered.find("button").prop("className")).toContain("custom-class-name");
    });
});
