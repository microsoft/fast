import React from "react";
import { get, omit, uniqueId } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles from "./form-item.dictionary.style";
import {
    FormItemDictionaryClassNameContract,
    FormItemDictionaryProps,
} from "./form-item.dictionary.props";
import FormItemBase from "./form-item.base";
import FormControl from "./form-control";
import { generateExampleData } from "../utilities";

/**
 * Schema form component definition
 * @extends React.Component
 */
class FormItemDictionary extends FormItemBase<
    FormItemDictionaryProps & ManagedClasses<FormItemDictionaryClassNameContract>,
    {}
> {
    public render(): React.ReactNode {
        return (
            <div className={get(this.props.managedClasses, "formItemDictionary")}>
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
                    "formItemDictionary_controlRegion"
                )}
            >
                <div
                    className={get(
                        this.props.managedClasses,
                        "formItemDictionary_control"
                    )}
                >
                    <label
                        className={get(
                            this.props.managedClasses,
                            "formItemDictionary_controlLabel"
                        )}
                    >
                        {this.props.label}
                    </label>
                </div>
                <button
                    className={get(
                        this.props.managedClasses,
                        "formItemDictionary_controlAddTrigger"
                    )}
                    aria-label={"Select to add item"}
                    onClick={this.handleOnAddItem}
                >
                    +
                </button>
            </div>
        );
    }

    private renderItemControl(propertyName: string): React.ReactNode {
        return (
            <div
                className={get(
                    this.props.managedClasses,
                    "formItemDictionary_itemControlRegion"
                )}
            >
                <div
                    className={get(
                        this.props.managedClasses,
                        "formItemDictionary_itemControl"
                    )}
                >
                    <input
                        className={get(
                            this.props.managedClasses,
                            "formItemDictionary_itemControlInput"
                        )}
                        type="text"
                        value={propertyName}
                        onChange={this.handleOnKeyChange(propertyName)}
                    />
                </div>
            </div>
        );
    }

    private renderFormControls(): React.ReactNode {
        return (typeof this.props.data !== "undefined"
            ? Object.keys(this.props.data)
            : []
        )
            .filter((dataKey: string) => {
                return !this.props.enumeratedProperties.includes(dataKey);
            })
            .map((additionalPropertyKey: string, index: number) => {
                return (
                    <div key={index}>
                        {this.renderItemControl(additionalPropertyKey)}
                        <FormControl
                            index={index}
                            untitled={this.props.untitled}
                            label={get(this.props.schema, "title", this.props)}
                            onChange={this.props.onChange}
                            propertyName={additionalPropertyKey}
                            schemaLocation={this.getSchemaLocation(additionalPropertyKey)}
                            dataLocation={this.getDataLocation(additionalPropertyKey)}
                            data={this.getData(additionalPropertyKey)}
                            schema={this.props.schema}
                            onUpdateActiveSection={this.props.onUpdateActiveSection}
                            childOptions={this.props.childOptions}
                            required={this.isRequired(additionalPropertyKey)}
                            invalidMessage={this.props.invalidMessage}
                        />
                    </div>
                );
            });
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

    private handleOnKeyChange = (
        propertyName: string
    ): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>): void => {
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

export { FormItemDictionary };
export default manageJss(styles)(FormItemDictionary);
