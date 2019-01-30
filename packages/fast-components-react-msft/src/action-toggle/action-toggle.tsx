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
        managedClasses: void 0,
        disabled: void 0,
        selected: void 0,
        selectedGlyph: void 0,
        unselectedGlyph: void 0,
        selectedContent: void 0,
        unselectedContent: void 0,
        selectedLabel: void 0,
        unselectedLabel: void 0,
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
                    ButtonAppearance[ActionToggleAppearance[this.getAppearance()]]
                }
                jssStyleSheet={actionToggleButtonOverrides}
                beforeContent={this.renderGlyph}
            >
                {this.renderLabel()}
            </Button>
        );
    }

    /**
     * Generates class names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.actionToggle", "");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__disabled",
                ""
            )}`;
        }

        if (this.state.selected) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__selected",
                ""
            )}`;
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__primary",
                ""
            )}`;
        } else {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__lightweight",
                ""
            )}`;
        }

        if (this.hasGlyphAndContent()) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.actionToggle__hasGlyphAndContent",
                ""
            )}`;
        }

        return super.generateClassNames(classNames);
    }

    /**
     * Returns the appearance enum value to use based on current select state
     */
    private getAppearance(): ActionToggleAppearance {
        if (this.state.selected) {
            return ActionToggleAppearance.primary;
        }

        return ActionToggleAppearance.lightweight;
    }

    /**
     * Returns the appropriate ARIA label
     */
    private renderARIALabel(): string {
        if (this.state.selected) {
            return this.props.selectedLabel;
        }

        return this.props.unselectedLabel;
    }

    /**
     * Returns the appropriate text label
     */
    private renderLabel(): React.ReactNode {
        if (this.state.selected) {
            return this.props.selectedContent;
        }

        return this.props.unselectedContent;
    }

    /**
     * Render Glyphs
     */
    private renderGlyph = (): React.ReactNode => {
        if (this.state.selected) {
            return this.renderSelectedGlyph();
        }

        return this.renderUnselectedGlyph();
    };

    private renderSelectedGlyph(): React.ReactNode {
        if (typeof this.props.selectedGlyph === "function") {
            return this.props.selectedGlyph(
                get(this.props, "managedClasses.actionToggle_selectedGlyph", "")
            );
        }
        return null;
    }

    private renderUnselectedGlyph(): React.ReactNode {
        if (typeof this.props.unselectedGlyph === "function") {
            return this.props.unselectedGlyph(
                get(this.props, "managedClasses.actionToggle_unselectedGlyph", "")
            );
        }
        return null;
    }

    /**
     * Checks to see if the toggle is displaying both glyph and content or not
     */
    private hasGlyphAndContent(): boolean {
        return this.state.selected
            ? !isNullOrUndefined(this.props.selectedGlyph) &&
                  !isNullOrUndefined(this.props.selectedContent)
            : !isNullOrUndefined(this.props.unselectedGlyph) &&
                  !isNullOrUndefined(this.props.unselectedContent);
    }

    /**
     * Handles onClick
     */
    private handleToggleChange = (e: React.MouseEvent<HTMLElement>): void => {
        if (
            typeof this.props.selected !== "boolean" &&
            typeof this.props.selected !== "function"
        ) {
            this.setState({
                selected: !this.state.selected,
            });
        }

        if (this.props.onToggle) {
            this.props.onToggle(e, this.props);
        }
    };
}

export default ActionToggle;
export * from "./action-toggle.props";
