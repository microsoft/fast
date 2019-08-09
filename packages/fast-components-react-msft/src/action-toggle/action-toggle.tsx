import { ActionToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { actionToggleButtonOverrides } from "@microsoft/fast-components-styles-msft";
import { classNames } from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";
import React from "react";
import { Button, ButtonAppearance } from "../button";
import { DisplayNamePrefix } from "../utilities";
import {
    ActionToggleAppearance,
    ActionToggleHandledProps,
    ActionToggleProps,
    ActionToggleUnhandledProps,
} from "./action-toggle.props";

export interface ActionToggleState {
    selected: boolean;
}

class ActionToggle extends Foundation<
    ActionToggleHandledProps,
    ActionToggleUnhandledProps,
    ActionToggleState
> {
    public static displayName: string = `${DisplayNamePrefix}ActionToggle`;

    public static defaultProps: Partial<ActionToggleProps> = {
        managedClasses: {},
    };

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
        appearance: void 0,
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
                    ButtonAppearance[ActionToggleAppearance[this.props.appearance]]
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
        const {
            actionToggle,
            actionToggle__disabled,
            actionToggle__selected,
            actionToggle__hasGlyphAndContent,
        }: ActionToggleClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                actionToggle,
                [actionToggle__disabled, this.props.disabled],
                [actionToggle__selected, this.state.selected],
                [
                    this.props.managedClasses[`actionToggle__${this.props.appearance}`],
                    typeof this.props.appearance === "string",
                ],
                [actionToggle__hasGlyphAndContent, this.hasGlyphAndContent()]
            )
        );
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
                classNames(this.props.managedClasses.actionToggle_selectedGlyph)
            );
        }

        return null;
    }

    private renderUnselectedGlyph(): React.ReactNode {
        if (typeof this.props.unselectedGlyph === "function") {
            return this.props.unselectedGlyph(
                classNames(this.props.managedClasses.actionToggle_unselectedGlyph)
            );
        }

        return null;
    }

    /**
     * Checks to see if the toggle is displaying both glyph and content or not
     */
    private hasGlyphAndContent(): boolean {
        return this.state.selected
            ? !isNil(this.props.selectedGlyph) && !isNil(this.props.selectedContent)
            : !isNil(this.props.unselectedGlyph) && !isNil(this.props.unselectedContent);
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
