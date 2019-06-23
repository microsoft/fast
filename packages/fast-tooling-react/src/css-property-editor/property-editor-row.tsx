import React from "react";
import { camelCase, get, isNil } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSPropertyEditorRowHandledProps,
    CSSPropertyEditorRowUnhandledProps,
} from "./property-editor-row.props";
import { KeyCodes, spinalCase } from "@microsoft/fast-web-utilities";

export default class CSSPropertyEditorRow extends Foundation<
    CSSPropertyEditorRowHandledProps,
    CSSPropertyEditorRowUnhandledProps,
    {}
> {
    public static displayName: string = "CSSPropertyEditorRow";

    protected handledProps: HandledProps<CSSPropertyEditorRowHandledProps> = {
        cssKey: void 0,
        value: void 0,
        rowIndex: void 0,
        onKeyChange: void 0,
        onValueChange: void 0,
        onClickToInsert: void 0,
        onCommitKeyEdit: void 0,
        onRowFocus: void 0,
        onRowBlur: void 0,
        managedClasses: void 0,
    };

    private monospaceFontWidthMultiplier: number = 7.6;
    private rowRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private keyInputRef: React.RefObject<HTMLInputElement> = React.createRef<
        HTMLInputElement
    >();
    private valueInputRef: React.RefObject<HTMLInputElement> = React.createRef<
        HTMLInputElement
    >();

    public componentDidMount(): void {
        if (
            isNil(this.rowRef.current) ||
            isNil(this.keyInputRef.current) ||
            isNil(this.valueInputRef.current)
        ) {
            return;
        }

        // force focus to a new row when it mounts
        if (
            this.props.cssKey === "" &&
            this.props.value === "" &&
            !this.rowRef.current.contains(document.activeElement)
        ) {
            this.keyInputRef.current.focus();
        }
    }

    /**
     * main render function for the row
     */
    public render(): React.ReactNode {
        return (
            <div
                ref={this.rowRef}
                className={get(this.props.managedClasses, "cssPropertyEditorRow", "")}
                tabIndex={-1}
                onClick={this.handleClick}
            >
                <input
                    type={"text"}
                    ref={this.keyInputRef}
                    className={this.generateKeyClassNames()}
                    onChange={this.handleKeyInputChange}
                    onBlur={this.handleKeyInputBlur}
                    onFocus={this.handleFocus}
                    onKeyDown={this.handleKeyInputKeyDown}
                    value={spinalCase(this.props.cssKey)}
                    style={{
                        width: `${this.getMonospaceInputWidth(this.props.cssKey)}px`,
                    }}
                />
                :
                <input
                    type={"text"}
                    ref={this.valueInputRef}
                    className={this.generateValueClassNames()}
                    onChange={this.handleValueInputChange}
                    onBlur={this.handleValueInputBlur}
                    onFocus={this.handleFocus}
                    value={this.props.value}
                    style={{
                        width: `${this.getMonospaceInputWidth(this.props.value)}px`,
                    }}
                />
                ;
            </div>
        );
    }

    /**
     * calculate mono space width of an input
     */
    private getMonospaceInputWidth = (inputValue: string): number => {
        if (isNil(inputValue)) {
            return 0;
        }
        return inputValue.length * this.monospaceFontWidthMultiplier;
    };

    /**
     * get classes for key input
     */
    private generateKeyClassNames(): string {
        return `${get(this.props.managedClasses, "cssPropertyEditorRow_input", "")} ${get(
            this.props.managedClasses,
            "cssPropertyEditorRow_inputKey",
            ""
        )}`;
    }

    /**
     * get classes for value input
     */
    private generateValueClassNames(): string {
        return `${get(this.props.managedClasses, "cssPropertyEditorRow_input", "")} ${get(
            this.props.managedClasses,
            "cssPropertyEditorRow_inputValue",
            ""
        )}`;
    }

    /**
     * value has changed in key input
     */
    private handleKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newKey: string = e.target.value;
        if (
            typeof this.props.onKeyChange === "function" &&
            this.props.cssKey !== newKey
        ) {
            this.props.onKeyChange(
                camelCase(newKey),
                this.props.cssKey,
                this.props.rowIndex
            );
        }
    };

    /**
     * value has changed in value input
     */
    private handleValueInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue: string = e.target.value;
        if (
            typeof this.props.onValueChange === "function" &&
            this.props.value !== newValue
        ) {
            this.props.onValueChange(newValue, this.props.cssKey, this.props.rowIndex);
        }
    };

    /**
     *  Handle focus events
     */
    private handleFocus = (): void => {
        if (typeof this.props.onRowFocus === "function") {
            this.props.onRowFocus(this.props.cssKey, this.props.rowIndex);
        }
    };

    /**
     *  key input has lost focus
     */
    private handleKeyInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        if (typeof this.props.onCommitKeyEdit === "function") {
            this.props.onCommitKeyEdit(this.props.cssKey, this.props.rowIndex);
        }

        this.checkForRowBlur(e);
    };

    /**
     *  value input has lost focus
     */
    private handleValueInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        this.checkForRowBlur(e);
    };

    /**
     *  check if the row is losing focus in the provided focus event
     */
    private checkForRowBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        if (
            typeof this.props.onRowBlur === "function" &&
            !isNil(this.rowRef.current) &&
            !this.rowRef.current.contains(e.relatedTarget as Element)
        ) {
            this.props.onRowBlur(this.props.cssKey, this.props.rowIndex);
        }
    };

    /**
     * Handle click
     */
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (
            typeof this.props.onClickToInsert === "function" &&
            (e.target as HTMLElement).nodeName !== "INPUT"
        ) {
            this.props.onClickToInsert(this.props.cssKey, this.props.rowIndex);
        }
        e.preventDefault();
    };

    /**
     * Handle key presses on key input
     */
    private handleKeyInputKeyDown = (e: React.KeyboardEvent): void => {
        if (e.keyCode !== KeyCodes.enter) {
            return;
        }
        e.preventDefault();
        if (typeof this.props.onCommitKeyEdit === "function") {
            this.props.onCommitKeyEdit(this.props.cssKey, this.props.rowIndex);
        }
    };
}
