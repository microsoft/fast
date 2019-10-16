import { ActionToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { actionToggleButtonOverrides } from "@microsoft/fast-components-styles-msft";
import { classNames } from "@microsoft/fast-web-utilities";
import { isBoolean, isFunction, isNil } from "lodash-es";
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
        const selected: boolean = nextProps.selected;

        return isBoolean(selected) && selected !== prevState.selected
            ? { selected }
            : null;
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
            selected: !!this.props.selected,
        };
    }

    /**
     * Renders the component
     */
    public render(): JSX.Element {
        const selected: boolean = this.state.selected;

        return (
            <Button
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                disabled={this.props.disabled}
                onClick={this.handleToggleChange}
                aria-label={
                    selected ? this.props.selectedLabel : this.props.unselectedLabel
                }
                appearance={
                    ButtonAppearance[ActionToggleAppearance[this.props.appearance]]
                }
                jssStyleSheet={actionToggleButtonOverrides}
                beforeContent={this.renderGlyph}
            >
                {selected ? this.props.selectedContent : this.props.unselectedContent}
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
                this.props.managedClasses[`actionToggle__${this.props.appearance}`],
                [actionToggle__disabled, this.props.disabled],
                [actionToggle__selected, this.state.selected],
                [actionToggle__hasGlyphAndContent, this.hasGlyphAndContent()]
            )
        );
    }

    /**
     * Render Glyphs
     */
    private renderGlyph = (): React.ReactNode => {
        let glyph: (className: string) => React.ReactNode;
        let className: string;

        if (this.state.selected) {
            glyph = this.props.selectedGlyph;
            className = this.props.managedClasses.actionToggle_selectedGlyph;
        } else {
            glyph = this.props.unselectedGlyph;
            className = this.props.managedClasses.actionToggle_unselectedGlyph;
        }

        return isFunction(this.props.selectedGlyph)
            ? glyph(classNames(this.props.managedClasses.actionToggle_glyph, className))
            : null;
    };

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
        if (!isBoolean(this.props.selected)) {
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
