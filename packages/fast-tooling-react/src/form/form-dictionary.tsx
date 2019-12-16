import React from "react";
import { isPlainObject, uniqueId } from "lodash-es";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import styles, { FormDictionaryClassNameContract } from "./form-dictionary.style";
import { FormDictionaryProps, FormDictionaryState } from "./form-dictionary.props";
import FormControlSwitch from "./form-control-switch";
import { generateExampleData, getErrorFromDataLocation } from "./utilities";

/**
 * Form control definition
 */
class FormDictionary extends React.Component<
    FormDictionaryProps & ManagedClasses<FormDictionaryClassNameContract>,
    FormDictionaryState
> {
    public static displayName: string = "FormDictionary";

    private rootElementRef: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: FormDictionaryProps) {
        super(props);

        this.state = {
            focusedPropertyKey: null,
            focusedPropertyKeyValue: null,
        };
    }

    public render(): React.ReactNode {
        return (
            <div
                className={this.props.managedClasses.formDictionary}
                ref={this.rootElementRef}
            >
                {this.renderControl()}
                {this.renderFormControls()}
            </div>
        );
    }

    public componentDidMount(): void {
        this.updateValidity();
    }

    public componentDidUpdate(): void {
        this.updateValidity();
    }

    private updateValidity(): void {
        if (this.props.additionalProperties === false) {
            const {
                formDictionary_itemControlInput,
            }: FormDictionaryClassNameContract = this.props.managedClasses;

            this.rootElementRef.current
                .querySelectorAll<HTMLInputElement>(`.${formDictionary_itemControlInput}`)
                .forEach((itemControlInput: HTMLInputElement) => {
                    itemControlInput.setCustomValidity(
                        "should NOT have additional properties"
                    );
                });
        }
    }

    private renderControl(): React.ReactNode {
        const {
            formDictionary_controlAddTrigger,
            formDictionary_controlLabel,
            formDictionary_control,
            formDictionary_controlRegion,
        }: FormDictionaryClassNameContract = this.props.managedClasses;

        if (isPlainObject(this.props.additionalProperties)) {
            return (
                <div className={formDictionary_controlRegion}>
                    <div className={formDictionary_control}>
                        <label className={formDictionary_controlLabel}>
                            {this.props.label}
                        </label>
                    </div>
                    <button
                        className={formDictionary_controlAddTrigger}
                        aria-label={"Select to add item"}
                        onClick={this.handleOnAddItem}
                    />
                </div>
            );
        }
    }

    private renderItemControl(propertyName: string): React.ReactNode {
        const {
            formDictionary_itemControlRegion,
            formDictionary_itemControl,
            formDictionary_itemControlLabel,
            formDictionary_itemControlInput,
            formDictionary_itemControlRemoveTrigger,
        }: FormDictionaryClassNameContract = this.props.managedClasses;

        return (
            <div className={formDictionary_itemControlRegion}>
                <div className={formDictionary_itemControl}>
                    <label className={formDictionary_itemControlLabel}>
                        {this.props.propertyLabel}
                    </label>
                    <input
                        className={formDictionary_itemControlInput}
                        type={"text"}
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
                        className={formDictionary_itemControlRemoveTrigger}
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
                    const invalidMessage: string = getErrorFromDataLocation(
                        `${this.props.dataLocation}${
                            this.props.dataLocation !== "" ? "." : ""
                        }${currentKey}`,
                        this.props.validationErrors
                    );

                    return (
                        <React.Fragment>
                            {accumulator}
                            <div key={this.props.schemaLocation + index}>
                                {this.renderItemControl(currentKey)}
                                <FormControlSwitch
                                    index={index}
                                    controls={this.props.controls}
                                    controlPlugins={this.props.controlPlugins}
                                    label={this.props.label}
                                    onChange={this.props.onChange}
                                    propertyName={currentKey}
                                    schemaLocation={this.getSchemaLocation(currentKey)}
                                    dataLocation={this.getDataLocation(currentKey)}
                                    data={this.getData(currentKey)}
                                    schema={this.props.additionalProperties}
                                    disabled={this.props.additionalProperties === false}
                                    onUpdateSection={this.props.onUpdateSection}
                                    childOptions={this.props.childOptions}
                                    required={this.isRequired(currentKey)}
                                    invalidMessage={invalidMessage}
                                    softRemove={false}
                                />
                            </div>
                        </React.Fragment>
                    );
                }
                return accumulator;
            },
            null
        );
    }

    private handleOnAddItem = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const key: string = uniqueId("example");

        if (typeof this.props.default !== "undefined") {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                value: this.props.default,
            });
        } else if (Array.isArray(this.props.examples) && this.props.examples.length > 0) {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                value: this.props.examples[0],
            });
        } else {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${key}`,
                value: generateExampleData(this.props.additionalProperties, ""),
            });
        }
    };

    private handleOnRemoveItem = (
        propertyName: string
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.props.onChange({
                dataLocation: `${
                    this.props.dataLocation === "" ? "" : `${this.props.dataLocation}.`
                }${propertyName}`,
                value: void 0,
            });
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

            this.props.onChange({ dataLocation: this.props.dataLocation, value: data });

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
            Array.isArray(this.props.required) &&
            this.props.required.includes(propertyName)
        );
    }
}

export { FormDictionary };
export default manageJss(styles)(FormDictionary);
