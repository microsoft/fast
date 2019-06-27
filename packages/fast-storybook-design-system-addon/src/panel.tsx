import {
    DesignSystem,
    DesignSystemDefaults,
    neutralLayerL1,
    neutralLayerL1Alt,
    neutralLayerL2,
    neutralLayerL3,
    neutralLayerL4,
    NeutralPaletteDarkModeLayers,
    NeutralPaletteLightModeLayers,
    createColorPalette,
} from "@microsoft/fast-components-styles-msft";
import { API } from "@storybook/api";
import { Global, Theme, styled, css } from "@storybook/theming";
import { merge } from "lodash-es";
import React from "react";
import { REQUEST_DESIGN_SYSTEM_EVENT, UPDATE_DESIGN_SYSTEM_EVENT } from "./constants";
import { ColorRGBA64, parseColor } from "@microsoft/fast-colors";

interface DesignSystemPanelProps {
    api: API;
    active: boolean;
}

enum Background {
    L1 = "L1",
    L1Alt = "L1Alt",
    L2 = "L2",
    L3 = "L3",
    L4 = "L4",
}

enum ColorModes {
    light = "light",
    dark = "dark",
}

interface DesignSystemPanelState {
    colorMode: ColorModes;
    designSystem: DesignSystem;
    background: Background;
}

interface SwatchProps {
    color: string;
    selected: boolean;
    value: Background;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    labelledby: string;
}

class Swatch extends React.Component<SwatchProps> {
    render(): JSX.Element {
        const shadow: string = `0 0 .8px 0px #000`;
        const Inner: any = styled.div(({ theme }) => ({
            width: 36,
            height: 36,
            backgroundColor: this.props.color,
            display: "inline-block",
            margin: "0 8px 8px 0",
            outline: "none",
            boxShadow: this.props.selected
                ? `0 0 0 4px inset ${theme.barSelectedColor}, ${shadow}`
                : shadow,
        }));

        return (
            <Inner
                tabIndex={0}
                data-value={this.props.value}
                onClick={this.props.onClick}
                aria-checked={this.props.selected}
                aria-labelledby={this.props.labelledby}
            />
        );
    }
}

function Radio(props: React.InputHTMLAttributes<HTMLInputElement>): React.ReactElement {
    const inner: React.ReactNode = styled.input(({ theme }) => ({
        width: 16,
        height: 16,
        marginRight: 20,
        verticalAlign: "bottom",
    }));

    return React.createElement(inner as any, Object.assign({}, props, { type: "radio" }));
}

export class DesignSystemPanel extends React.Component<
    DesignSystemPanelProps,
    DesignSystemPanelState
> {
    private backgroundLabel: string = "background-label";
    constructor(props: DesignSystemPanelProps) {
        super(props);

        this.state = {
            colorMode: ColorModes.light,
            background: Background.L1,
            designSystem: DesignSystemDefaults,
        };
    }

    public render() {
        return (
            <React.Fragment>
                <Global
                    styles={(theme: Theme) => ({
                        [`#storybook-preview-background`]: {
                            background: `${this.state.designSystem.backgroundColor}`,
                        },
                    })}
                />
                {this.props.active ? this.renderForm() : null}
            </React.Fragment>
        );
    }

    private renderForm(): JSX.Element {
        return (
            <div style={{ padding: "12px" }}>
                <fieldset>
                    <legend>Colors</legend>
                    <p id={this.backgroundLabel} style={{ margin: "0 0 8px" }}>
                        Background
                    </p>
                    {this.renderSwatch(Background.L1)}
                    {this.renderSwatch(Background.L1Alt)}
                    {this.renderSwatch(Background.L2)}
                    {this.renderSwatch(Background.L3)}
                    {this.renderSwatch(Background.L4)}
                    <label style={{ display: "block" }}>
                        Accent base color
                        <input
                            type="color"
                            defaultValue={this.state.designSystem.accentBaseColor}
                            style={{ marginLeft: 8 }}
                            onChange={this.createChangeHandler(
                                this.handleAccentBaseChange
                            )}
                        />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Mode</legend>
                    <label>
                        light&nbsp;
                        <Radio
                            name="colorMode"
                            value={ColorModes.light}
                            defaultChecked={this.state.colorMode === ColorModes.light}
                            onChange={this.createChangeHandler(this.handleThemeChange)}
                        />
                    </label>
                    <label>
                        dark&nbsp;
                        <Radio
                            name="colorMode"
                            value={ColorModes.dark}
                            onChange={this.createChangeHandler(this.handleThemeChange)}
                            defaultChecked={this.state.colorMode === ColorModes.dark}
                        />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Document direction</legend>
                    <label>
                        ltr&nbsp;
                        <Radio
                            name="direction"
                            value="ltr"
                            defaultChecked={this.state.designSystem.direction === "ltr"}
                            onChange={this.createChangeHandler(
                                this.handleDirectionChange
                            )}
                        />
                    </label>
                    <label>
                        rtl&nbsp;
                        <Radio
                            name="direction"
                            value="rtl"
                            defaultChecked={this.state.designSystem.direction === "rtl"}
                            onChange={this.createChangeHandler(
                                this.handleDirectionChange
                            )}
                        />
                    </label>
                </fieldset>
            </div>
        );
    }

    public componentDidMount(): void {
        this.props.api
            .getChannel()
            .addListener(REQUEST_DESIGN_SYSTEM_EVENT, this.emitDesignSystemUpdate);
    }

    public componentWillUnmount(): void {
        this.props.api
            .getChannel()
            .removeListener(REQUEST_DESIGN_SYSTEM_EVENT, this.emitDesignSystemUpdate);
    }

    private renderSwatch(background: Background): JSX.Element {
        return (
            <Swatch
                selected={this.state.background === background}
                value={background}
                color={
                    this.state.designSystem.neutralPalette[
                        this.state.colorMode === ColorModes.dark
                            ? NeutralPaletteDarkModeLayers[background]
                            : NeutralPaletteLightModeLayers[background]
                    ]
                }
                onClick={this.createChangeHandler(this.handleBackgroundChange)}
                labelledby={this.backgroundLabel}
            />
        );
    }

    private createChangeHandler<T>(fn: (e: T) => Partial<DesignSystem>): (e: T) => void {
        return (e: T): void => {
            const event: T = e;
            const updates: Partial<DesignSystem> = fn(event);

            this.setState(
                {
                    designSystem: merge({}, this.state.designSystem, updates),
                },
                () => {
                    this.emitDesignSystemUpdate();
                }
            );
        };
    }

    private emitDesignSystemUpdate = (): void => {
        this.props.api.emit(UPDATE_DESIGN_SYSTEM_EVENT, this.state.designSystem);
    };

    private handleDirectionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): Partial<DesignSystem> => {
        return { direction: e.target.value as any };
    };

    private handleBackgroundChange = (
        e: React.MouseEvent<HTMLDivElement>
    ): Partial<DesignSystem> => {
        if (e.target instanceof HTMLDivElement) {
            const value: string = e.target.getAttribute("data-value");
            this.setState({
                background: Background[value],
            });

            return {
                backgroundColor: this.state.designSystem.neutralPalette[
                    this.isDarkMode()
                        ? NeutralPaletteDarkModeLayers[value] ||
                          NeutralPaletteDarkModeLayers.L1
                        : NeutralPaletteLightModeLayers[value] ||
                          NeutralPaletteLightModeLayers.L1
                ],
            };
        }

        return {};
    };

    private handleThemeChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): Partial<DesignSystem> => {
        const mode: ColorModes =
            e.target.value === ColorModes.dark ? ColorModes.dark : ColorModes.light;
        this.setState({
            colorMode: mode,
        });

        return {
            backgroundColor: this.state.designSystem.neutralPalette[
                mode === ColorModes.dark
                    ? NeutralPaletteDarkModeLayers[this.state.background] ||
                      NeutralPaletteDarkModeLayers.L1
                    : NeutralPaletteLightModeLayers[this.state.background] ||
                      NeutralPaletteLightModeLayers.L1
            ],
        };
    };

    private isDarkMode(): boolean {
        return this.state.colorMode === ColorModes.dark;
    }

    private handleAccentBaseChange(
        e: React.ChangeEvent<HTMLInputElement>
    ): Partial<DesignSystem> {
        const value: string = e.target.value;
        const parsed: ColorRGBA64 | null = parseColor(value);

        return parsed !== null
            ? {
                  accentBaseColor: value,
                  accentPalette: createColorPalette(parsed),
              }
            : {};
    }
}
