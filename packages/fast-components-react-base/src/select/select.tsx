import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { SelectHandledProps, SelectProps, SelectUnhandledProps } from "./select.props";
import { ListboxItemData } from "../listbox/listbox-context";
import Listbox from "../listbox";

export interface SelectState {
    value: string;
    selectedItems: ListboxItemData[];
    isMenuOpen: boolean;
}

class Select extends Foundation<SelectHandledProps, SelectUnhandledProps, SelectState> {
    public static displayName: string = "Select";

    public static defaultProps: Partial<SelectProps> = {
        multiselectable: false,
        disabled: false,
        defaultSelection: [],
        placeholder: "",
    };

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<SelectHandledProps> = {
        isMenuOpen: void 0,
        disabled: void 0,
        form: void 0,
        multiselectable: void 0,
        contentDisplayRenderFunction: void 0,
        menuRenderFunction: void 0,
        dataValueFormatterFunction: void 0,
        required: void 0,
        managedClasses: void 0,
        selectedItems: void 0,
        defaultSelection: void 0,
        onValueChange: void 0,
        placeholder: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    /**
     * constructor
     */
    constructor(props: SelectProps) {
        super(props);

        let initialSelection: ListboxItemData[];
        if (this.props.selectedItems !== undefined) {
            initialSelection = Listbox.getListboxItemDataFromIds(
                this.props.selectedItems,
                this.props.children
            );
        } else {
            initialSelection = Listbox.getListboxItemDataFromIds(
                this.props.defaultSelection,
                this.props.children
            );
        }

        if (!this.props.multiselectable && initialSelection.length > 1) {
            initialSelection = initialSelection.slice(0, 1);
        }

        this.state = {
            selectedItems: initialSelection,
            value: this.getFormattedValueString(initialSelection),
            isMenuOpen:
                this.props.isMenuOpen || this.props.multiselectable ? false : true,
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                aria-disabled={this.props.disabled || false}
                className={this.generateClassNames()}
                onKeyDown={this.handleKeydown}
                onClick={this.selectClicked}
            >
                {this.renderContentDisplay()}
                {this.renderHiddenSelectElement()}
                {this.renderMenu()}
            </div>
        );
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props.managedClasses, "select", "");

        if (this.props.disabled) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "select__disabled")
            );
        }

        return super.generateClassNames(className);
    }

    /**
     * Renders a hidden select element which can interact with a
     * form hosting this component
     */
    private renderHiddenSelectElement(): React.ReactNode {
        return (
            <select
                name={this.props.name}
                form={this.props.form}
                value={this.state.value}
                multiple={this.props.multiselectable}
                style={{
                    display: "none",
                }}
            />
        );
    }

    /**
     * Deternmines which function to use to render content display (ie. the part of the control that shows when the menu isn't open)
     * and invokes it
     */
    private renderContentDisplay(): React.ReactNode {
        if (this.props.contentDisplayRenderFunction !== undefined) {
            return this.props.contentDisplayRenderFunction(
                this.state.selectedItems,
                this.state.value
            );
        } else {
            return this.defaultDisplayRenderFunction(
                this.state.selectedItems,
                this.state.value
            );
        }
    }

    /**
     * Deternmines which function to use to render the menu and invokes it
     */
    private renderMenu(): React.ReactNode {
        if (this.state.isMenuOpen) {
            return (
                <Listbox
                    multiselectable={this.props.multiselectable}
                    defaultSelection={this.props.defaultSelection}
                    selectedItems={this.props.selectedItems}
                    onSelectedItemsChanged={this.menuSelectionChanged}
                >
                    {this.props.children}
                </Listbox>
            );
        }
    }

    /**
     * The default function that renders an unstyled content display
     */
    private defaultDisplayRenderFunction = (
        selectedOptions: ListboxItemData[],
        formattedValue: string
    ): React.ReactNode => {
        if (selectedOptions.length === 0) {
            return this.props.placeholder;
        } else {
            const displayStrings: string[] = selectedOptions.map(
                (option: ListboxItemData) => {
                    if (option.displayString !== undefined) {
                        return option.displayString;
                    } else {
                        return option.value;
                    }
                }
            );

            const separator: string = ", ";
            let displayString: string = "";
            displayStrings.forEach((option: string) => {
                if (displayString.length > 0) {
                    displayString = displayString + separator;
                }
                displayString = displayString + option;
            });

            return displayString;
        }
    };

    /**
     * The default function that formats the value string generated based on selection.
     * This implementation should match the default formatting a base html select control applies.
     * Developpers can provide different formatters if desired.
     */
    private defaultDataValueFormatter = (
        selectedValues: string[],
        selectName: string
    ): string => {
        const separator: string = "&";
        const prefix: string = selectName !== undefined ? selectName + "=" : "";
        let formattedValue: string = "";
        selectedValues.forEach((thisValue: string) => {
            if (formattedValue.length > 0) {
                formattedValue = formattedValue + separator;
            }
            formattedValue = formattedValue + prefix + thisValue;
        });
        return formattedValue;
    };

    /**
     * Handles clicks
     */
    private selectClicked = (): void => {
        if (!this.props.disabled && !this.state.isMenuOpen) {
            this.openMenu();
        }
    };

    /**
     * Handles key events
     */
    private handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.defaultPrevented) {
            return;
        }

        switch (e.keyCode) {
            case KeyCodes.enter:
            case KeyCodes.space:
                e.preventDefault();
                this.openMenu();
                break;
            case KeyCodes.escape:
                e.preventDefault();
                this.closeMenu();
                break;
        }
    };

    /**
     * Callback when selection has changed in the menu
     */
    private menuSelectionChanged = (newSelection: ListboxItemData[]): void => {
        const newValue: string = this.getFormattedValueString(newSelection);
        this.setState({
            selectedItems: newSelection,
            value: newValue,
        });
        if (this.props.multiselectable) {
            this.closeMenu();
        } else {
            this.closeMenu();
        }
        if (this.props.onValueChange) {
            this.props.onValueChange(newValue, newSelection);
        }
    };

    /**
     * opens the menu when it is not controlled by props
     */
    private openMenu = (): void => {
        if (this.props.isMenuOpen === undefined) {
            window.addEventListener("click", this.handleWindowClick);
            this.setState({
                isMenuOpen: true,
            });
        }
    };

    /**
     * closes the menu when it is not controlled by props
     */
    private closeMenu = (): void => {
        if (this.props.isMenuOpen === undefined) {
            window.removeEventListener("click", this.handleWindowClick);
            this.setState({
                isMenuOpen: false,
            });
        }
    };

    /**
     * tried to close the menu when when there are clicks outside
     */
    private handleWindowClick = (event: MouseEvent): void => {
        if (!this.rootElement.current.contains(event.target as Element)) {
            this.closeMenu();
        }
    };

    /**
     * Determines what function needs to be called to format the result string and
     * calls it with the appropriate params
     */
    private getFormattedValueString = (selectedOptions: ListboxItemData[]): string => {
        const selectedValues: string[] = selectedOptions.map(
            (option: ListboxItemData) => {
                return option.value;
            }
        );

        return this.props.dataValueFormatterFunction === undefined
            ? this.defaultDataValueFormatter(selectedValues, this.props.name)
            : this.props.dataValueFormatterFunction(selectedValues, this.props.name);
    };
}

export default Select;
export * from "./select.props";
export { SelectClassNameContract };
