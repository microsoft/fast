import {
    Caption,
    Checkbox,
    Divider,
    DividerClassNameContract,
    Label,
    LabelClassNameContract,
    NeutralButton,
    Paragraph,
    Radio,
    Select,
    SelectOption,
} from "@microsoft/fast-components-react-msft";
import {
    DesignSystem,
    DesignSystemDefaults,
    StandardLuminance,
} from "@microsoft/fast-components-styles-msft";
import {
    ComponentStyleSheet,
    DesignSystemProvider,
} from "@microsoft/fast-jss-manager-react";
import React from "react";
import { isSetUIStateMessage } from "../messaging/canvas";
import { isPluginMessageEvent, PluginMessageData } from "../messaging/common";
import {
    REMOVE_DESIGN_SYSTEM_PROPERTY,
    REMOVE_PLUGIN_DATA,
    SET_DESIGN_SYSTEM_PROPERTY,
    SET_FILL_RECIPE,
    SET_STROKE_RECIPE,
    SET_TEXT_FILL_RECIPE,
} from "../messaging/ui";
import { defaultState, PluginUIState } from "./plugin-ui.state";
import { stringById } from "./strings";
import { ListboxItemProps } from "@microsoft/fast-components-react-base";
import { string } from "prop-types";

const designSystem: DesignSystem = { ...DesignSystemDefaults, density: -2 };
const dividerStyleOverrides: ComponentStyleSheet<
    DividerClassNameContract,
    DesignSystem
> = {
    divider: {
        margin: "20px 0 8px 0",
    },
};

const recipeLabelStyleOverrides: ComponentStyleSheet<
    LabelClassNameContract,
    DesignSystem
> = {
    label: {
        margin: "8px 0 2px",
    },
};

/**
 * At this point, this is essentially a controlled component.
 * State will be controlled by the main application and serialized
 * state will be passed to this component to be parsed, set, and rendered
 *
 * There may be some local state we want to track that doesn't concern the primary application,
 * but for now we'll keep all of the app logic in one place and merely make this component
 * reflect that external state.
 */
export class PluginUI extends React.Component<{}, PluginUIState> {
    constructor(props: {}) {
        super(props);

        this.state = { ...defaultState };

        // Register message listener to react to messages from main.ts
        window.onmessage = this.handleOnMessage;
    }

    public render(): JSX.Element {
        const { fills, strokes, textFills }: PluginUIState = this.state;

        return (
            <DesignSystemProvider designSystem={designSystem}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        {fills.length + strokes.length + textFills.length === 0 ? (
                            <Paragraph>No configurable properties on this node</Paragraph>
                        ) : (
                            this.renderEditingUi()
                        )}
                    </div>
                    <div>
                        <Divider jssStyleSheet={dividerStyleOverrides} />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Caption>
                                {this.state.activeNodeType ||
                                    stringById("invalidActiveNodeType")}
                            </Caption>
                            {this.state.activeNodeType ? (
                                <NeutralButton
                                    title={stringById("clearPluginDataTriggerTooltip")}
                                    onClick={this.handleRemoveDataClick}
                                >
                                    {stringById("clearPluginDataTriggerText")}
                                </NeutralButton>
                            ) : null}
                        </div>
                    </div>
                </div>
            </DesignSystemProvider>
        );
    }

    public renderNoValidSelection(): JSX.Element {
        return <Paragraph>{stringById("noValidElementSelected")}</Paragraph>;
    }

    private handleOnMessage = (e: MessageEvent): void => {
        if (!isPluginMessageEvent(e)) {
            return; // Exit if the MessageEvent should not be handled by our UI
        } else {
            const message: PluginMessageData<any> = JSON.parse(e.data.pluginMessage);

            if (isSetUIStateMessage(message)) {
                this.setState(message.value);
            }
        }
    };

    private renderEditingUi(): JSX.Element {
        return (
            <div>
                {this.renderThemeSwitcher()}
                {this.state.fills.length > 0
                    ? this.renderRecipeSelector({
                          label: "Fill",
                          id: "fill",
                          selectOptions: this.state.fills,
                          active: this.state.activeFill,
                          action: SET_FILL_RECIPE,
                      })
                    : null}
                {this.state.strokes.length > 0
                    ? this.renderRecipeSelector({
                          label: "Stroke",
                          id: "stroke",
                          selectOptions: this.state.strokes,
                          active: this.state.activeStroke,
                          action: SET_STROKE_RECIPE,
                      })
                    : null}
                {this.state.textFills.length > 0
                    ? this.renderRecipeSelector({
                          label: "Fill",
                          id: "text-fill",
                          selectOptions: this.state.textFills,
                          active: this.state.activeTextFill,
                          action: SET_TEXT_FILL_RECIPE,
                      })
                    : null}
            </div>
        );
    }

    private renderRecipeSelector<T extends any[]>(options: {
        label: string;
        id: string;
        selectOptions: string[];
        active: string;
        action: any;
    }): JSX.Element {
        return (
            <React.Fragment>
                <Label htmlFor={options.id} jssStyleSheet={recipeLabelStyleOverrides}>
                    {options.label}
                </Label>
                <Select
                    id={options.id}
                    selectedItems={[options.active]}
                    onValueChange={this.dispatch.bind(this, options.action)}
                    displayStringFormatter={this.recipeSelectorDisplayStringFormatter}
                >
                    {options.selectOptions.map(this.renderRecipeOption)}
                </Select>
            </React.Fragment>
        );
    }

    private renderRecipeOption(option: string): JSX.Element {
        return (
            <SelectOption
                id={option}
                key={option}
                value={option}
                children={option === "" ? "-" : option}
            />
        );
    }

    /**
     * Dispatch a message to the host
     * @param type the type field of a the message
     * @param value any value to send along with the type
     */
    private dispatch = (type: string, value?: any): void => {
        parent.postMessage({ pluginMessage: { type, value } }, "*");
    };

    private handleRemoveDataClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        this.dispatch(REMOVE_PLUGIN_DATA);
    };

    private recipeSelectorDisplayStringFormatter(
        selectedOptions: ListboxItemProps[]
    ): string {
        return selectedOptions
            .map((option: ListboxItemProps): string => option.children as string)
            .join(" ");
    }

    private renderThemeSwitcher(): JSX.Element | null {
        if (!this.state.designSystem) {
            return null;
        }

        const { baseLayerLuminance }: Partial<DesignSystem> = this.state.designSystem;
        const themeSet: boolean = typeof baseLayerLuminance === "number";
        const style = {
            marginInlineEnd: "12px",
        };

        return (
            <div>
                <Checkbox
                    inputId={"theme-toggle"}
                    checked={themeSet}
                    onChange={themeSet ? this.removeTheme : this.setLightTheme}
                    style={style}
                >
                    <Label slot="label" htmlFor={"theme-toggle"}>
                        {stringById("toggleThemLabel")}
                    </Label>
                </Checkbox>
                <Radio
                    inputId={"light-theme"}
                    checked={baseLayerLuminance === StandardLuminance.LightMode}
                    disabled={!themeSet}
                    name="theme"
                    onChange={this.setLightTheme}
                    style={style}
                >
                    <Label slot="label" htmlFor={"light-theme"}>
                        {stringById("setLightThemeLabel")}
                    </Label>
                </Radio>
                <Radio
                    inputId={"dark-theme"}
                    checked={baseLayerLuminance === StandardLuminance.DarkMode}
                    disabled={!themeSet}
                    name="theme"
                    onChange={this.setDarkTheme}
                >
                    <Label slot="label" htmlFor={"dark-theme"}>
                        {stringById("setDarkThemeLabel")}
                    </Label>
                </Radio>
            </div>
        );
    }

    private removeTheme = (): void => {
        this.dispatch(REMOVE_DESIGN_SYSTEM_PROPERTY, "baseLayerLuminance");
    };

    private setLightTheme = (): void => {
        this.dispatch(SET_DESIGN_SYSTEM_PROPERTY, {
            baseLayerLuminance: StandardLuminance.LightMode,
        });
    };

    private setDarkTheme = (): void => {
        this.dispatch(SET_DESIGN_SYSTEM_PROPERTY, {
            baseLayerLuminance: StandardLuminance.DarkMode,
        });
    };
}
