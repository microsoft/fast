/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "../../utilities/web-components/pragma"; /* Note: Import wrapped createElement. */

import React from "react";
import {
    RenderControlConfig,
    RenderRefControlConfig,
} from "./control.css.utilities.props";
import { FASTCheckbox, FASTTextField } from "@microsoft/fast-components";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle.
 */
FASTCheckbox;
FASTTextField;

function getTextInputChangeHandler(
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

export function renderDefault(config: RenderControlConfig): React.ReactNode {
    return (
        <fast-text-field
            key={config.key}
            events={{
                input: getTextInputChangeHandler(config.handleChange),
            }}
        ></fast-text-field>
    );
}

function getCheckboxInputChangeHandler(
    parentChangeHandler: (value: string) => void,
    value: string
): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("son of a b", e.currentTarget.checked);
        parentChangeHandler(e.currentTarget.checked ? value : "");
    };
}

export function renderZeroOrOne(config: RenderRefControlConfig): React.ReactNode {
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
