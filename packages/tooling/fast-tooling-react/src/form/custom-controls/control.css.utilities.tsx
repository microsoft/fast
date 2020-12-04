import React from "react";
import { PropertyState } from "./control.css.props";
import {
    CombinatorType,
    CSSPropertyRef,
    CSSPropertyRefType,
} from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";
import { XOR } from "@microsoft/fast-tooling/dist/data-utilities/type.utilities";
import { syntaxes } from "@microsoft/fast-tooling/dist/css-data";

export interface RenderControlBaseConfig {
    mapsToProperty: string;
    combinatorType: CombinatorType;
    index: number;
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    changeHandler: (value: string) => void;
}

export interface RenderControlConfig extends RenderControlBaseConfig {
    refKey: string;
    refType: CSSPropertyRefType;
}

export interface RenderSelectControlConfig extends RenderControlBaseConfig {
    values: string[];
}

export interface RenderAutoSuggestControlConfig extends RenderControlBaseConfig {
    values: string[];
}

type ControlConfig = XOR<
    RenderControlBaseConfig,
    XOR<
        RenderControlConfig,
        XOR<RenderSelectControlConfig, RenderAutoSuggestControlConfig>
    >
>;

export function renderDefault(config: RenderControlConfig): React.ReactNode {
    return <input key={config.index} type={"text"} onChange={config.onChangeHandler} />;
}

export function renderSelect(config: RenderSelectControlConfig): React.ReactNode {
    return (
        <select key={config.index} onChange={config.onChangeHandler}>
            {config.values.map((value: string, index: number) => {
                return <option key={index}>{value}</option>;
            })}
        </select>
    );
}

export function renderAutoSuggest(
    config: RenderAutoSuggestControlConfig
): React.ReactNode {
    const listId: string = config.mapsToProperty;

    return (
        <React.Fragment>
            <input
                type={"text"}
                onChange={config.onChangeHandler}
                aria-autocomplete={"list"}
                list={listId}
                aria-controls={listId}
            />
            <datalist id={listId}>
                {config.values.map((value: string, index: number) => {
                    return <option key={index}>{value}</option>;
                })}
            </datalist>
        </React.Fragment>
    );
}

export function renderDeclarationValue(config: RenderControlBaseConfig): React.ReactNode {
    return <input key={config.index} type={"text"} onChange={config.onChangeHandler} />;
}

export function renderNumberInput(config: RenderControlBaseConfig): React.ReactNode {
    return <input key={config.index} type={"number"} onChange={config.onChangeHandler} />;
}

export function resolveCSSType(
    propertyState: PropertyState,
    combinatorType: CombinatorType,
    ref: XOR<string, CSSPropertyRef[]>
): string {
    return propertyState.values.reduce(
        (previousPropertyValue: string, currentPropertyValue: string) => {
            return previousPropertyValue + currentPropertyValue;
        },
        ""
    );
}

export function resolveCSSSyntax(
    propertyState: PropertyState,
    combinatorType: CombinatorType,
    ref: XOR<string, CSSPropertyRef[]>
): string {
    return propertyState.values
        .reduce((previousPropertyValue: string, currentPropertyValue: string) => {
            return `${previousPropertyValue} ${currentPropertyValue}`;
        }, "")
        .trim();
}

export function resolveCSSMixed(
    propertyState: PropertyState,
    ref: CSSPropertyRef[]
): string {
    if (ref[propertyState.index]) {
        return resolveCSSValue(
            propertyState,
            ref[propertyState.index].type,
            ref[propertyState.index].refCombinatorType,
            ref[propertyState.index].ref
        );
    }

    return "";
}

export function resolveCSSValue(
    propertyState: PropertyState,
    refType: CSSPropertyRefType,
    combinatorType: CombinatorType,
    ref: XOR<string, CSSPropertyRef[]>
): string {
    switch (refType) {
        case "value":
            if (ref === "<declaration-value>") {
                return propertyState.values[0];
            }

            return ref as string;
        case "type":
            return resolveCSSType(propertyState, combinatorType, ref);
        case "syntax":
            return resolveCSSSyntax(propertyState, combinatorType, ref);
        case "mixed":
            return resolveCSSMixed(propertyState, ref as CSSPropertyRef[]);
        default:
            return "";
    }
}

/**
 * Render a control based on type
 */
export function resolveControl(config: ControlConfig): React.ReactNode {
    switch (config.combinatorType) {
        case CombinatorType.exactlyOne:
            return renderSelect({
                ...config,
                values: syntaxes[config.refKey].value.ref.map((ref): string => {
                    return ref.ref;
                }),
            });
        default:
            return renderDefault(config as RenderControlConfig);
    }
}
