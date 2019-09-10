import React from "react";
import { get, uniqueId } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./control.dictionary.style";
import {
    DictionaryFormControlClassNameContract,
    DictionaryFormControlProps,
    DictionaryFormControlState,
} from "./control.dictionary.props";
import BaseFormControl from "./template.control.abstract";
import FormControlSwitch from "../form-control-switch";
import { generateExampleData } from "../utilities";

/**
 * Schema form component definition
 * @extends React.Component
 */
class DictionaryFormControl extends BaseFormControl<
    DictionaryFormControlProps & ManagedClasses<DictionaryFormControlClassNameContract>,
    DictionaryFormControlState
> {
    public static displayName: string = "DictionaryFormControl";

    constructor(props: DictionaryFormControlProps) {
        super(props);

        this.state = {
            focusedPropertyKey: null,
            focusedPropertyKeyValue: null,
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={get(this.props.managedClasses, "dictionaryFormControl")}>
                {this.renderControl()}
                {this.renderFormControls()}
            </div>
        );
    }

    private renderControl(): React.ReactNode {
        return (
            <div
                className={get(
                    this.props.managedClasses,
                    "dictionaryFormControl_controlRegion"
                )}
            >
                <div
                    className={get(
                        this.props.managedClasses,
                        "dictionaryFormControl_control"
                    )}
                >
                    <label
                        className={get(
                            this.props.managedClasses,
                            "dictionaryFormControl_controlLabel"
                        )}
                    >
                        {this.props.label}
                    </label>
                </div>
                <button
                    className={get(
                        this.props.managedClasses,
                        "dictionaryFormControl_controlAddTrigger"
                    )}
                    aria-label={"Select to add item"}
                    onClick={this.handleOnAddItem}
                />
            </div>
        );
    }

    private renderItemControl(propertyName: string): React.ReactNode {
        return (
            <div
                className={get(
                    this.props.managedClasses,
                    "dictionaryFormControl_itemControlRegion"
                )}
            >
                <div
                    className={get(
                        this.props.managedClasses,
                        "dictionaryFormControl_itemControl"
                    )}
                >
                    <label
                        className={get(
                            this.props.managedClasses,
                            "dictionaryFormControl_itemControlLabel"
                        )}
                    >
                        {this.props.schema.propertyTitle || "Property key"}
                    </label>
                    <input
                        className={get(
                            this.props.managedClasses,
                            "dictionaryFormControl_itemControlInput"
                        )}
                        type="text"
                        value={
                            this.state.focusedPropertyKey === propertyName
                                ? this.state.focusedPropertyKeyValue
                                : propertyName
                        }
                        onFocus={this.handleKeyFocus(propertyName)}
                        onBlur={this.handleKeyBlur(propertyName)}
                        onChange={this.handleKeyChange(propertyName)}
                    />
                    <button
                        className={get(
                            this.props.managedClasses,
                            "dictionaryFormControl_itemControlRemoveTrigger"
                        )}
                        onClick={this.handleOnRemoveItem(propertyName)}
                    />
                </div>
            </div>
        );
    }

    private renderFormControls(): React.ReactNode {
        return (typeof this.props.data !== "undefined"
            ? Object.keys(this.props.data)
            : []
        ).reduce(
            (
                accumulator: React.ReactNode,
                currentKey: string,
                index: number
            ): React.ReactNode => {
                if (!this.props.enumeratedProperties.includes(currentKey)) {
                    return (
                        <React.Fragment>
                            {accumulator}
                            <div key={index}>
                                {this.renderItemControl(currentKey)}
                                <FormControlSwitch
                                    index={index}
                                    untitled={this.props.untitled}
                                    label={get(this.props.schema, "title", this.props)}
                                    onChange={this.props.onChange}
                                    propertyName={currentKey}
                                    schemaLocation={this.getSchemaLocation(currentKey)}
                                    dataLocation={this.getDataLocation(currentKey)}
                                    data={this.getData(currentKey)}
                                    schema={this.props.schema}
                                    onUpdateActiveSection={
                                        this.props.onUpdateActiveSection
                                    }
                                    childOptions={this.props.childOptions}
                                    required={this.isRequired(currentKey)}
                                    invalidMessage={this.props.invalidMessage}
                                    softRemove={false}
                                />
                            </div>
                        </React.Fragment>
                    );
                }
            },
            null
        );
    }

    private handleOnAddItem = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const key: string = uniqueId("example");

        if (typeof this.props.default !== "undefined") {
            this.props.onChange(
                `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                this.props.default
            );
        } else if (Array.isArray(this.props.schema.examples)) {
            this.props.onChange(
                `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                this.props.schema.examples[0]
            );
        } else {
            this.props.onChange(
                `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                generateExampleData(this.props.schema, "")
            );
        }
    };

    private handleOnRemoveItem = (
        propertyName: string
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.props.onChange(
                `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${propertyName}`,
                void 0
            );
        };
    };

    private handleKeyChange = (
        propertyName: string
    ): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({
                focusedPropertyKeyValue: e.target.value,
            });
        };
    };

    private handleKeyFocus = (
        propertyName: string
    ): ((e: React.FocusEvent<HTMLInputElement>) => void) => {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            this.setState({
                focusedPropertyKey: propertyName,
                focusedPropertyKeyValue: propertyName,
            });
        };
    };

    private handleKeyBlur = (
        propertyName: string
    ): ((e: React.FocusEvent<HTMLInputElement>) => void) => {
        return (e: React.FocusEvent<HTMLInputElement>): void => {
            const dataKeys: string[] =
                typeof this.props.data === "undefined"
                    ? []
                    : Object.keys(this.props.data);
            const data: any = {};

            dataKeys.forEach((dataKey: string) => {
                data[
                    dataKey === propertyName ? e.target.value : dataKey
                ] = this.props.data[dataKey];
            });

            this.props.onChange(this.props.dataLocation, data);

            this.setState({
                focusedPropertyKey: null,
                focusedPropertyKeyValue: null,
            });
        };
    };

    private getSchemaLocation(propertyName: string): string {
        return `${
            this.props.schemaLocation === "" ? "" : `${this.props.schemaLocation}.`
        }additionalProperties.${propertyName}`;
    }

    private getDataLocation(propertyName: string): string {
        return `${
            this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
        }${propertyName}`;
    }

    private getData(propertyName: string): any {
        return this.props.data[propertyName];
    }

    private isRequired(propertyName: string): any {
        return (
            Array.isArray(this.props.schema.required) &&
            this.props.schema.required.includes(propertyName)
        );
    }
}

export { DictionaryFormControl };
export default manageJss(styles)(DictionaryFormControl);
