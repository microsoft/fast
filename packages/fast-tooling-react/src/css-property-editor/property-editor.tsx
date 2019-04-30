import React from "react";
import { get, pick } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    CSSProperties,
    CSSPropertiesConfig,
    CSSPropertyConfig,
    CSSPropertyEditorHandledProps,
    CSSPropertyEditorProps,
    CSSPropertyEditorState,
    CSSPropertyEditorUnhandledProps,
} from "./property-editor.props";
import { KeyCodes } from "@microsoft/fast-web-utilities";

export default class CSSPropertyEditor extends Foundation<
    CSSPropertyEditorHandledProps,
    CSSPropertyEditorUnhandledProps,
    CSSPropertyEditorState
> {
    public static displayName: string = "CSSPropertyEditor";

    protected handledProps: HandledProps<CSSPropertyEditorHandledProps> = {
        data: void 0,
        onChange: void 0,
        managedClasses: void 0,
    };

    private propertyEditorRef: React.RefObject<HTMLPreElement>;

    private keyInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: CSSPropertyEditorProps) {
        super(props);

        this.keyInputRef = React.createRef();
        this.propertyEditorRef = React.createRef();

        this.state = {
            key: "",
            value: "",
            data: this.getCSSPropertyConfig(this.props.data),
        };
    }

    public render(): React.ReactNode {
        return (
            <pre
                className={this.props.managedClasses.cssPropertyEditor}
                onClick={this.handleClick}
                ref={this.propertyEditorRef}
            >
                <div
                    className={this.props.managedClasses.cssPropertyEditor_propertyRegion}
                >
                    {this.renderCurrentProperties()}
                    {this.renderNewProperty()}
                </div>
            </pre>
        );
    }

    public componentDidUpdate(prevProps: CSSPropertyEditorProps): void {
        if (prevProps.data !== this.props.data) {
            this.setState({ data: this.getCSSPropertyConfig(this.props.data) });
        }
    }

    private renderCurrentProperties(): React.ReactNode {
        if (!this.state.data) {
            return;
        }

        return Object.keys(this.state.data).map(
            (cssKey: string, index: number): React.ReactNode => {
                return this.renderPropertyInput(
                    cssKey,
                    this.state.data[cssKey].value,
                    this.state.data[cssKey].keyWidth,
                    this.state.data[cssKey].valueWidth,
                    index
                );
            }
        );
    }

    private renderNewProperty(): React.ReactNode {
        const newPropertyConfig: CSSPropertiesConfig = this.getCSSPropertyConfig({
            [this.state.key]: this.state.value,
        });

        return this.renderNewPropertyInput(
            newPropertyConfig[this.state.key].keyWidth,
            newPropertyConfig[this.state.key].valueWidth
        );
    }

    private renderPropertyInput(
        key: string,
        value: string,
        keyWidth: number,
        valueWidth: number,
        index: number
    ): React.ReactNode {
        return (
            <div key={index}>
                <input
                    type={"text"}
                    className={this.generateKeyClassNames()}
                    onChange={this.handlePropertyKeyChange(key)}
                    value={key}
                    style={{ width: `${keyWidth}px` }}
                />
                :
                <input
                    type={"text"}
                    className={this.generateValueClassNames()}
                    onChange={this.handlePropertyValueChange(key)}
                    value={value}
                    style={{ width: `${valueWidth}px` }}
                />
                ;
            </div>
        );
    }

    private renderNewPropertyInput(
        keyWidth: number,
        valueWidth: number
    ): React.ReactNode {
        return (
            <div>
                <input
                    type={"text"}
                    className={this.generateKeyClassNames()}
                    onChange={this.handleNewPropertyKeyChange}
                    value={this.state.key}
                    style={{ width: `${keyWidth}px` }}
                    ref={this.keyInputRef}
                />
                :
                <input
                    type={"text"}
                    className={this.generateValueClassNames()}
                    onChange={this.handleNewPropertyValueChange}
                    onKeyDown={this.handleNewPropertyValueKeyDown}
                    value={this.state.value}
                    style={{ width: `${valueWidth}px` }}
                />
                ;
            </div>
        );
    }

    private generateKeyClassNames(): string {
        return `${this.props.managedClasses.cssPropertyEditor_input} ${
            this.props.managedClasses.cssPropertyEditor_inputKey
        }`;
    }

    private generateValueClassNames(): string {
        return `${this.props.managedClasses.cssPropertyEditor_input} ${
            this.props.managedClasses.cssPropertyEditor_inputValue
        }`;
    }

    private getCSSPropertyConfig(data: CSSProperties): CSSPropertiesConfig {
        const dataConfig: CSSPropertiesConfig = {};

        if (!data) {
            return dataConfig;
        }

        Object.keys(data).map(
            (dataKey: string): void => {
                dataConfig[dataKey] = {
                    value: data[dataKey],
                    keyWidth: 6.6 * dataKey.length,
                    valueWidth: 6.6 * data[dataKey].length,
                };
            }
        );

        return dataConfig;
    }

    private handleClick = (e: React.MouseEvent<HTMLPreElement>): void => {
        if ((e.target as HTMLElement).nodeName !== "INPUT") {
            this.keyInputRef.current.focus();
        }

        e.stopPropagation();
    };

    private handlePropertyKeyChange(
        oldKey: string
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const newData: CSSProperties = {};

            Object.keys(this.props.data).forEach((key: string) => {
                if (key === oldKey) {
                    newData[e.target.value] = this.props.data[key];
                } else {
                    newData[key] = this.props.data[key];
                }
            });

            this.handleCSSUpdate(newData);
        };
    }

    private handlePropertyValueChange(
        key: string
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const newData: CSSProperties = Object.assign({}, this.props.data);
            newData[key] = e.target.value;

            this.handleCSSUpdate(newData);
        };
    }

    private handleNewPropertyKeyChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.setState({
            key: e.target.value,
        });
    };

    private handleNewPropertyValueChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        this.setState({
            value: e.target.value,
        });
    };

    private handleNewPropertyValueKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        if (e.keyCode === KeyCodes.tab) {
            if (this.state.key !== "" && this.state.value !== "") {
                e.preventDefault();

                this.handleCSSUpdate(
                    Object.assign({}, this.props.data, {
                        [this.state.key]: this.state.value,
                    })
                );

                this.keyInputRef.current.focus();
            }

            this.setState({
                key: "",
                value: "",
            });
        }
    };

    private handleCSSUpdate = <D extends {}>(updatedCSS: D): void => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(updatedCSS);
        }
    };
}
