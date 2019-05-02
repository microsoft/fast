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
    InputConfig,
} from "./property-editor.props";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { getCSSPropertyConfig } from "./property-editor.utilities";

export default class CSSPropertyEditor extends Foundation<
    CSSPropertyEditorHandledProps,
    CSSPropertyEditorUnhandledProps,
    CSSPropertyEditorState
> {
    public static displayName: string = "CSSPropertyEditor";

    public static getDerivedStateFromProps(
        props: CSSPropertyEditorProps
    ): Partial<CSSPropertyEditorState> | null {
        return { data: getCSSPropertyConfig(props.data) };
    }

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
            data: getCSSPropertyConfig(this.props.data),
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

    private renderCurrentProperties(): React.ReactNode {
        if (!this.state.data) {
            return;
        }

        return Object.keys(this.state.data).map(
            (cssKey: string, index: number): React.ReactNode => {
                return this.renderPropertyInput(cssKey, this.state.data[cssKey], index);
            }
        );
    }

    private renderNewProperty(): React.ReactNode {
        const newPropertyConfig: CSSPropertiesConfig = getCSSPropertyConfig({
            [this.state.key]: this.state.value,
        });

        return this.renderNewPropertyInput(newPropertyConfig[this.state.key]);
    }

    private renderPropertyInput(
        key: string,
        config: CSSPropertyConfig,
        index: number
    ): React.ReactNode {
        return (
            <div key={index}>
                {this.renderInput({
                    className: this.generateKeyClassNames(),
                    onChange: this.handlePropertyKeyChange(key),
                    value: key,
                    style: { width: `${config.keyWidth}px` },
                })}
                :
                {this.renderInput({
                    className: this.generateValueClassNames(),
                    onChange: this.handlePropertyValueChange(key),
                    value: config.value,
                    style: { width: `${config.valueWidth}px` },
                })}
                ;
            </div>
        );
    }

    private renderNewPropertyInput(config: CSSPropertyConfig): React.ReactNode {
        return (
            <div>
                {this.renderInput({
                    className: this.generateKeyClassNames(),
                    onChange: this.handleNewPropertyKeyChange,
                    value: this.state.key,
                    style: { width: `${config.keyWidth}px` },
                    ref: this.keyInputRef,
                })}
                :
                {this.renderInput({
                    className: this.generateValueClassNames(),
                    onChange: this.handleNewPropertyValueChange,
                    onKeyDown: this.handleNewPropertyValueKeyDown,
                    value: this.state.value,
                    style: { width: `${config.valueWidth}px` },
                })}
                ;
            </div>
        );
    }

    private renderInput(config: InputConfig): React.ReactNode {
        return <input type={"text"} {...config} />;
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

    private handleClick = (e: React.MouseEvent<HTMLPreElement>): void => {
        if ((e.target as HTMLElement).nodeName !== "INPUT") {
            this.keyInputRef.current.focus();
        }
    };

    private handlePropertyKeyChange(
        oldKey: string
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            const newData: CSSProperties = {};

            // The reason this is iterated over in this manner is to preserve
            // the location of keys in the CSS object
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
            this.handleCSSUpdate({ ...this.props.data, ...{ [key]: e.target.value } });
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
