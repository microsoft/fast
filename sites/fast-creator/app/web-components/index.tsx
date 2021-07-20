/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import h from "@microsoft/site-utilities/dist/web-components/pragma";
import React from "react";
import {
    fastButton,
    fastSelect,
    fastSlider,
    fastSliderLabel,
    fastSwitch,
    fastTab,
    fastTabPanel,
    fastTabs,
    fastTextField,
} from "@microsoft/fast-components";
import { Select } from "@microsoft/fast-foundation";
import { componentCategories, downChevron, upChevron } from "@microsoft/site-utilities";
import { toggleStyle } from "@microsoft/site-utilities/src/components/style";
import {
    cssLayoutCssProperties,
    DataType,
    fastToolingColorPicker,
    fastToolingCSSLayout,
    MessageSystem,
} from "@microsoft/fast-tooling";
import {
    ControlConfig,
    ModularForm,
    ModularNavigation,
    StandardControlPlugin,
} from "@microsoft/fast-tooling-react";
import CSSControl from "@microsoft/fast-tooling-react/dist/form/custom-controls/control.css";
import { CSSPropertiesDictionary } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { ControlContext } from "@microsoft/fast-tooling-react/dist/form/templates/types";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";
import { CSSStandardControlPlugin } from "@microsoft/fast-tooling-react/dist/form/custom-controls/css";
import { CSSControlConfig } from "@microsoft/fast-tooling-react/dist/form/custom-controls/css/css.template.control.standard.props";
import { DesignSystem } from "@microsoft/fast-foundation";
import { FormId, NavigationId } from "../creator.props";
import { properties as CSSProperties } from "../css-data";
import { elementLibraries } from "../configs";
import { defaultDevices, Device } from "./devices";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
DesignSystem.getOrCreate().register(
    fastButton(),
    fastSelect(),
    fastSlider(),
    fastSliderLabel(),
    fastTabs(),
    fastTab(),
    fastSwitch(),
    fastTabPanel(),
    fastTextField(),
    fastToolingColorPicker({ prefix: "fast-tooling" }),
    fastToolingCSSLayout({ prefix: "fast-tooling" })
);

export function renderDevToolToggle(selected: boolean, onToggleCallback: () => void) {
    return (
        <fast-button
            events={{
                click: (e: React.ChangeEvent) => {
                    onToggleCallback();
                },
            }}
            class={"dev-tools-trigger"}
        >
            {selected ? downChevron() : upChevron()}
        </fast-button>
    );
}

function renderDeviceOptions(): React.ReactNode {
    return defaultDevices.map((deviceOption: Device) => {
        return (
            <fast-option
                key={deviceOption.id}
                value={deviceOption.id}
                style={{ height: "auto" }}
            >
                {deviceOption.displayName}
            </fast-option>
        );
    });
}

export function renderDeviceSelect(
    selectedDeviceId: string,
    onChangeCallback: (deviceId: string) => void,
    disable: boolean
): React.ReactNode {
    return (
        <fast-select
            value={selectedDeviceId}
            events={{
                change: (e: React.ChangeEvent): void => {
                    onChangeCallback((e.target as Select).value);
                },
            }}
            disabled={disable ? true : null}
        >
            {renderDeviceOptions()}
        </fast-select>
    );
}

function getColorPickerControl(
    id: string,
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin {
    return new StandardControlPlugin({
        id,
        context: ControlContext.fill,
        control: (config: ControlConfig): React.ReactNode => {
            return (
                <fast-tooling-color-picker
                    value={config.value || config.default}
                    events={{
                        change: (e: React.ChangeEvent<HTMLInputElement>): void => {
                            updateHandler({
                                [config.dataLocation]: e.target.value,
                            });
                        },
                    }}
                ></fast-tooling-color-picker>
            );
        },
    });
}

export function getColorPickerControls(
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin[] {
    return [
        getColorPickerControl("fill-color", updateHandler),
        getColorPickerControl("accent-base-color", updateHandler),
    ];
}

function getSliderLabels(positions: number[]): React.ReactNode {
    const positionLength = positions.length - 1;

    return positions.map((position: number, index: number) => {
        const displayNumber: XOR<void, number> =
            positions.length > 10 && index !== 0 && index !== positionLength
                ? undefined
                : position;
        return (
            <fast-slider-label key={position} position={position}>
                {displayNumber}
            </fast-slider-label>
        );
    });
}

function getSliderControl(
    id: string,
    updateHandler: (updatedData: { [key: string]: unknown }) => void,
    min: number,
    max: number,
    step: number = 1,
    defaultValue?: number
): StandardControlPlugin {
    return new StandardControlPlugin({
        id,
        context: ControlContext.fill,
        control: (config: ControlConfig): React.ReactNode => {
            const positions: number[] = new Array((max - min) / step + 1)
                .fill(0)
                .map((number: number, index: number): number => {
                    return min + step * index;
                });

            return (
                <fast-slider
                    value={config.value || defaultValue}
                    min={min}
                    max={max}
                    step={step}
                    events={{
                        change: (e: React.ChangeEvent<HTMLInputElement>): void => {
                            updateHandler({
                                [config.dataLocation]: parseFloat(e.target.value),
                            });
                        },
                    }}
                >
                    {getSliderLabels(positions)}
                </fast-slider>
            );
        },
    });
}

export function getSliderControls(
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin[] {
    return [
        getSliderControl("base-layer-luminance", updateHandler, 0, 1, 0.1, 1),
        getSliderControl("control-corner-radius", updateHandler, 0, 22, 1, 3),
        getSliderControl("stroke-width", updateHandler, 0, 12, 1, 1),
        getSliderControl("focus-stroke-width", updateHandler, 0, 12, 1, 2),
        getSliderControl("disabled-opacity", updateHandler, 0, 1, 0.1, 0.3),
    ];
}

function getCSSControls(): StandardControlPlugin {
    return new StandardControlPlugin({
        id: "style",
        context: ControlContext.fill,
        control: (controlConfig: ControlConfig): React.ReactNode => {
            return (
                <CSSControl
                    key={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                    css={(CSSProperties as unknown) as CSSPropertiesDictionary}
                    cssControls={[
                        new CSSStandardControlPlugin({
                            id: "layout",
                            propertyNames: cssLayoutCssProperties,
                            control: (config: CSSControlConfig) => {
                                return (
                                    <CSSLayout
                                        key={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                                        webComponentKey={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                                        value={config.css}
                                        onChange={config.onChange}
                                    />
                                );
                            },
                        }),
                    ]}
                    {...controlConfig}
                />
            );
        },
    });
}

function renderStartIcon(isIncluded: boolean): React.ReactNode {
    if (isIncluded) {
        return (
            <svg
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M11.8639 0.65511C12.0533 0.856064 12.0439 1.17251 11.8429 1.36191L3.91309 8.8358C3.67573 9.05952 3.30311 9.05263 3.07417 8.82028L0.393838 6.09995C0.200027 5.90325 0.202372 5.58667 0.399074 5.39286C0.595777 5.19905 0.912351 5.2014 1.10616 5.3981L3.51192 7.83975L11.1571 0.634189C11.358 0.44479 11.6745 0.454157 11.8639 0.65511Z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 0.5C6 0.223858 5.77614 0 5.5 0C5.22386 0 5 0.223858 5 0.5V5H0.5C0.223858 5 0 5.22386 0 5.5C0 5.77614 0.223858 6 0.5 6H5V10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5V6H10.5C10.7761 6 11 5.77614 11 5.5C11 5.22386 10.7761 5 10.5 5H6V0.5Z"
                fill="#FFFFFF"
            />
        </svg>
    );
}

export function renderNavigationTabs(
    activeId: any,
    fastMessageSystem: MessageSystem,
    addedLibraries: string[],
    handleAddLibrary: (libraryId: string) => void,
    handleNavigationTabsVisibility: (navigationId: any) => void
): React.ReactNode {
    return (
        <fast-tabs
            activeId={activeId}
            events={{
                change: (e: React.ChangeEvent<HTMLElement>) => {
                    if ((e as any).detail) {
                        handleNavigationTabsVisibility((e as any).detail.id);
                    }
                },
            }}
        >
            <fast-tab id={NavigationId.navigation}>Navigation</fast-tab>
            <fast-tab id={NavigationId.libraries}>Libraries</fast-tab>
            <fast-tab-panel id={NavigationId.navigation + "Panel"}>
                <ModularNavigation
                    messageSystem={fastMessageSystem}
                    types={[DataType.object]}
                />
            </fast-tab-panel>
            <fast-tab-panel id={NavigationId.libraries + "Panel"}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: "10px",
                    }}
                >
                    {Object.values(elementLibraries).map(elementLibrary => {
                        if (elementLibrary.optional) {
                            const isIncluded: boolean = addedLibraries.includes(
                                elementLibrary.id
                            );
                            return (
                                <fast-button
                                    key={elementLibrary.id}
                                    events={{
                                        click: (e: React.ChangeEvent) => {
                                            handleAddLibrary(elementLibrary.id);
                                        },
                                    }}
                                    disabled={isIncluded}
                                >
                                    <span slot="start">
                                        {renderStartIcon(isIncluded)}
                                    </span>
                                    {elementLibrary.displayName}
                                </fast-button>
                            );
                        }
                    })}
                </div>
            </fast-tab-panel>
        </fast-tabs>
    );
}

export function renderFormTabs(
    activeId: any,
    fastMessageSystem: MessageSystem,
    fastDesignMessageSystem: MessageSystem,
    linkedDataControl: StandardControlPlugin,
    handleFormVisibility: (formId: any) => void,
    handleDesignSystemChange: (updatedData: { [key: string]: unknown }) => void
): React.ReactNode {
    const formStyleOverride: string = `
        fast-tab-panel > div { width: 100%; }
    `;

    return (
        <fast-tabs
            activeId={activeId}
            events={{
                change: (e: React.ChangeEvent<HTMLElement>) => {
                    if ((e as any).detail) {
                        handleFormVisibility((e as any).detail.id);
                    }
                },
            }}
        >
            <fast-tab id={FormId.component}>Components</fast-tab>
            <fast-tab id={FormId.designSystem}>Design Tokens</fast-tab>
            <fast-tab-panel id={FormId.component + "Panel"}>
                <style>{formStyleOverride}</style>
                <ModularForm
                    key={FormId.component}
                    messageSystem={fastMessageSystem}
                    controls={[linkedDataControl, getCSSControls()]}
                    categories={componentCategories}
                />
            </fast-tab-panel>
            <fast-tab-panel id={FormId.designSystem + "Panel"}>
                <style>{formStyleOverride}</style>
                <ModularForm
                    key={FormId.designSystem}
                    messageSystem={fastDesignMessageSystem}
                    controls={[
                        linkedDataControl,
                        ...getSliderControls(handleDesignSystemChange),
                        ...getColorPickerControls(handleDesignSystemChange),
                        getCSSControls(),
                    ]}
                    categories={componentCategories}
                />
            </fast-tab-panel>
        </fast-tabs>
    );
}

export interface CSSLayoutProps {
    onChange: (config: { [key: string]: string }) => void;
    webComponentKey: string;
    value: { [key: string]: string };
}

export class CSSLayout extends React.Component<CSSLayoutProps, {}> {
    public layoutRef: React.RefObject<any>;

    private setLayoutRef = el => {
        this.layoutRef = el;

        if (this.layoutRef) {
            (this.layoutRef as any).onChange = e => {
                this.props.onChange(e);
            };
        }
    };

    render() {
        const newValue: string = Object.entries(this.props.value)
            .map(([key, value]: [string, string]) => {
                return `${key}: ${value};`;
            })
            .reduce((prevValue, currValue) => {
                return prevValue + " " + currValue;
            }, "");

        return (
            <fast-tooling-css-layout
                value={newValue}
                key={this.props.webComponentKey}
                ref={this.setLayoutRef}
            ></fast-tooling-css-layout>
        );
    }
}

export function renderPreviewSwitch(
    switchState: boolean,
    onChangeCallback: (newState: boolean) => void,
    disable: boolean
): React.ReactNode {
    return (
        <fast-switch
            checked={switchState ? true : null}
            disabled={disable ? true : null}
            events={{
                change: (e: React.ChangeEvent): void => {
                    onChangeCallback(!switchState);
                },
            }}
            style={toggleStyle}
        >
            <span>Preview</span>
        </fast-switch>
    );
}
