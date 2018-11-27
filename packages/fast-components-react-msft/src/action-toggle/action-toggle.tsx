import * as React from "react";
import { get } from "lodash-es";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { Button, ButtonAppearance } from "../button";
import {
    ActionToggleAppearance,
    ActionToggleHandledProps,
    ActionToggleProps,
    ActionToggleUnhandledProps,
} from "./action-toggle.props";
import { actionToggleButtonOverrides } from "@microsoft/fast-components-styles-msft";
import { isNullOrWhiteSpace } from "../../../fast-web-utilities/dist";
import { isNullOrUndefined } from "util";

export interface ActionToggleState {
    selected: boolean;
}

class ActionToggle extends Foundation<
    ActionToggleHandledProps,
    ActionToggleUnhandledProps,
    ActionToggleState
> {
    public static displayName: string = "ActionToggle";

    /**
     * React life-cycle method
     */
    public static getDerivedStateFromProps(
        nextProps: ActionToggleProps,
        prevState: ActionToggleState
    ): null | Partial<ActionToggleState> {
        if (
            typeof nextProps.selected === "boolean" &&
            nextProps.selected !== prevState.selected
        ) {
            return {
                selected: nextProps.selected,
            };
        }

        return null;
    }

    protected handledProps: HandledProps<ActionToggleHandledProps> = {
        appearance: void 0,
        managedClasses: void 0,
        disabled: void 0,
        selected: void 0,
        selectedGlyph: void 0,
        unselectedGlyph: void 0,
        selectedText: void 0,
        unselectedText: void 0,
        selectedARIALabel: void 0,
        unselectedARIALabel: void 0,
    };

    /**
     * Define constructor
     */
    constructor(props: ActionToggleProps) {
        super(props);

        this.state = {
            selected: this.props.selected || false,
        };
    }

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        return (
            <Button
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                disabled={this.props.disabled}
                onClick={this.handleToggleChange}
                aria-label={this.renderARIALabel()}
                appearance={
                    ButtonAppearance[ActionToggleAppearance[this.props.appearance]]
                }
                jssStyleSheet={actionToggleButtonOverrides}
            >
                {this.renderGlyph()}
                {this.renderLabel()}
                {this.props.children}
            </Button>
        );
    }

    /**
     * Returns the appropriate ARIA label
     */
    public renderARIALabel(): string {
        if (this.state.selected) {
            return this.props.selectedARIALabel;
        } else {
            return this.props.unselectedARIALabel;
        }
    }

    /**
     * Returns the appropriate text label
     */
    public renderLabel(): string {
        if (this.state.selected) {
            return this.props.selectedText;
        } else {
            return this.props.unselectedText;
        }
    }

    /**
     * Render Glyphs
     */
    public renderGlyph(): React.ReactNode {
        if (this.state.selected) {
            return this.renderSelectedGlyph();
        } else {
            return this.renderUnselectedGlyph();
        }
    }

    public renderSelectedGlyph(): React.ReactNode {
        if (typeof this.props.selectedGlyph === "function") {
            return this.props.selectedGlyph(
                get(this.props, "managedClasses.actionToggle_selectedGlyph")
            );
        }
        return null;
    }

    public renderUnselectedGlyph(): React.ReactNode {
        if (typeof this.props.unselectedGlyph === "function") {
            return this.props.unselectedGlyph(
                get(this.props, "managedClasses.actionToggle_unselectedGlyph")
            );
        }
        return null;
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.actionToggle") || "";

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__disabled"
            )}`;
        }

        if (this.state.selected) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__selected"
            )}`;
        }

        if (this.isSingleElement()) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__singleElement"
            )}`;
        }

        switch (this.props.appearance) {
            case ActionToggleAppearance.primary:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.actionToggle__primary"
                )}`;
                break;
            case ActionToggleAppearance.lightweight:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.actionToggle__lightweight"
                )}`;
                break;
            case ActionToggleAppearance.justified:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.actionToggle__justified"
                )}`;
                break;
            case ActionToggleAppearance.outline:
                classNames = `${classNames} ${get(
                    this.props,
                    "managedClasses.actionToggle__outline"
                )}`;
                break;
        }

        return super.generateClassNames(classNames);
    }

    /**
     * Checks to see if the toggle is displaying both glyph and text or not
     */
    private isSingleElement(): boolean {
        if (this.state.selected) {
            if (
                isNullOrWhiteSpace(this.props.selectedText) ||
                isNullOrUndefined(this.props.selectedGlyph)
            ) {
                return true;
            } else {
                return false;
            }
        } else {
            if (
                isNullOrWhiteSpace(this.props.unselectedText) ||
                isNullOrUndefined(this.props.unselectedGlyph)
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Handles onClick
     */
    private handleToggleChange = (e: React.MouseEvent<HTMLElement>): void => {
        if (typeof this.props.selected !== "boolean") {
            this.setState({ selected: !this.state.selected });
        }
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    };
}

export default ActionToggle;
export * from "./action-toggle.props";
