/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */

import React from "react";
import {
    RenderRefControlConfig,
    RenderSelectControlConfig,
} from "./control.css.utilities.props";
import {
    FASTCheckbox,
    FASTNumberField,
    FASTOption,
    FASTSelect,
    FASTTextField,
} from "@microsoft/fast-components";
import { FASTColorPicker } from "./css";
/**
 * Ensure tree-shaking doesn't remove these components from the bundle.
 */
FASTCheckbox;
FASTNumberField;
FASTOption;
FASTSelect;
FASTTextField;
FASTColorPicker;

export function renderDefault(config: RenderRefControlConfig): React.ReactNode {
    return renderTextInput(config);
}

function getInputChangeHandler(
    parentChangeHandler: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    let timer: null | NodeJS.Timer = null;

    const handleCheck = (newValue: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            parentChangeHandler(newValue);
        }, 500);
    };

    return (e: React.ChangeEvent<HTMLInputElement>) => {
        handleCheck(e.currentTarget.value);
    };
}

export function renderTextInput(config: RenderRefControlConfig): React.ReactNode {
    return (
        <fast-text-field
            key={config.key}
            events={{
                input: getInputChangeHandler(config.handleChange),
            }}
        ></fast-text-field>
    );
}

export function renderNumber(config: RenderRefControlConfig): React.ReactNode {
    return (
        <fast-number-field
            key={config.key}
            events={{
                input: getInputChangeHandler(config.handleChange),
            }}
        ></fast-number-field>
    );
}

export function renderInteger(config: RenderRefControlConfig): React.ReactNode {
    return (
        <fast-number-field
            key={config.key}
            events={{
                input: getInputChangeHandler(config.handleChange),
            }}
            step={1}
        ></fast-number-field>
    );
}

function getCheckboxInputChangeHandler(
    parentChangeHandler: (value: string) => void,
    value: string
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        parentChangeHandler(e.currentTarget.checked ? value : "");
    };
}

export function renderCheckbox(config: RenderRefControlConfig): React.ReactNode {
    return (
        <fast-checkbox
            events={{
                change: getCheckboxInputChangeHandler(
                    config.handleChange,
                    config.ref.ref as string
                ),
            }}
        >
            {config.ref.ref}
        </fast-checkbox>
    );
}

function getSelectionChangeHandler(
    parentChangeHandler: (value: string) => void
): (e: React.ChangeEvent<HTMLSelectElement>) => void {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
        parentChangeHandler(e.currentTarget.value);
    };
}

export function renderSelection(config: RenderSelectControlConfig): React.ReactNode {
    return (
        <fast-select
            events={{
                change: getSelectionChangeHandler(config.handleChange),
            }}
        >
            {config.options.map(option => {
                return (
                    <fast-option value={`${option.value}`} key={option.key}>
                        {option.displayName}
                    </fast-option>
                );
            })}
        </fast-select>
    );
}

function getColorPickerChangeHandler(
    parentChangeHandler: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    let timer: null | NodeJS.Timer = null;

    const handleCheck = (newValue: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            parentChangeHandler(newValue);
        }, 500);
    };

    return (e: React.ChangeEvent<HTMLInputElement>) => {
        handleCheck(e.currentTarget.value);
    };
}

export function renderColorPicker(config: RenderRefControlConfig): React.ReactNode {
    return (
        <color-picker
            key={config.key}
            events={{
                change: getColorPickerChangeHandler(config.handleChange),
            }}
        ></color-picker>
    );
}
