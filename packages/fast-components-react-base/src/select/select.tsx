import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get, isEqual } from "lodash-es";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { SelectHandledProps, SelectProps, SelectUnhandledProps } from "./select.props";
import ListboxItem, { ListboxItemProps } from "../listbox-item";
import Listbox from "../listbox";
import Button from "../button";
import { canUseDOM } from "exenv-es6";
import { DisplayNamePrefix } from "../utilities";

export interface SelectState {
    value: string | string[];
    displayString: string;
    selectedItems: ListboxItemProps[];
    isMenuOpen: boolean;
}

class Select extends Foundation<SelectHandledProps, SelectUnhandledProps, SelectState> {
    public static displayName: string = `${DisplayNamePrefix}Select`;

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
        displayStringFormatter: void 0,
        form: void 0,
        labelledBy: void 0,
        multiselectable: void 0,
        trigger: void 0,
        required: void 0,
        managedClasses: void 0,
        selectedItems: void 0,
        defaultSelection: void 0,
        onValueChange: void 0,
        placeholder: void 0,
        autoFocus: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    /**
     * constructor
     */
    constructor(props: SelectProps) {
        super(props);

        let initialSelection: ListboxItemProps[] = this.trimSelection(
            Listbox.getListboxItemDataFromIds(
                this.props.selectedItems !== undefined
                    ? this.props.selectedItems
                    : this.props.defaultSelection,
                this.props.children
            )
        );

        if (!this.props.multiselectable && initialSelection.length > 1) {
            initialSelection = initialSelection.slice(0, 1);
        }

        this.state = {
            selectedItems: initialSelection,
            value: this.getValueFromSelection(initialSelection),
            displayString: this.getFormattedDisplayString(initialSelection),
            isMenuOpen: this.validateMenuState(false),
        };
    }

    public componentDidUpdate(prevProps: SelectProps): void {
        let shouldUpdateSelection: boolean = false;
        let updatedMenuVisibility: boolean = this.state.isMenuOpen;

        if (prevProps.multiselectable !== this.props.multiselectable) {
            shouldUpdateSelection = true;
            updatedMenuVisibility = this.checkPropsForMenuState();
        }

        if (prevProps.isMenuOpen !== this.props.isMenuOpen) {
            updatedMenuVisibility = this.checkPropsForMenuState();
        }

        if (updatedMenuVisibility !== this.state.isMenuOpen) {
            this.toggleMenu(updatedMenuVisibility);
        }

        if (prevProps.selectedItems !== this.props.selectedItems) {
            this.updateSelectionFromProps();
            return;
        }

        if (shouldUpdateSelection) {
            this.updateSelection(
                this.state.selectedItems.map((thisItem: ListboxItemProps) => {
                    return thisItem;
                })
            );
        }
    }

    public componentDidMount(): void {
        window.addEventListener("click", this.handleWindowClick);

        this.toggleMenu(this.checkPropsForMenuState());
        if (
            this.props.autoFocus &&
            !this.state.isMenuOpen &&
            !this.props.multiselectable
        ) {
            this.focusTriggerElement();
        }
    }

    public componentWillUnmount(): void {
        window.removeEventListener("click", this.handleWindowClick);
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                aria-disabled={this.props.disabled || null}
                ref={this.rootElement}
                className={this.generateClassNames()}
                onKeyDown={this.handleKeydown}
                onClick={this.handleClick}
            >
                {this.renderTrigger()}
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
                get(this.props.managedClasses, "select__disabled", "")
            );
        }

        if (this.state.isMenuOpen) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "select_menu__open", "")
            );
        }

        if (this.props.multiselectable) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "select__multiSelectable", "")
            );
        }

        return super.generateClassNames(className);
    }

    /**
     * Determine menu state based on props
     */
    private checkPropsForMenuState = (): boolean => {
        let shouldMenuBeOpen: boolean = false;

        if (this.props.isMenuOpen !== undefined) {
            shouldMenuBeOpen = this.props.isMenuOpen;
        } else if (this.props.multiselectable === true) {
            shouldMenuBeOpen = true;
        }

        return shouldMenuBeOpen;
    };

    /**
     * Renders a hidden select element which can interact with a
     * form hosting this component
     */
    private renderHiddenSelectElement(): React.ReactNode {
        return (
            <select
                required={this.props.required || null}
                name={this.props.name || null}
                form={this.props.form || null}
                value={this.state.value}
                multiple={this.props.multiselectable || null}
                disabled={this.props.disabled || null}
                onChange={this.onSelectValueChange}
                style={{
                    display: "none",
                }}
            />
        );
    }

    /**
     * This exists only to suppress a build warning
     */
    private onSelectValueChange = (event: React.ChangeEvent): void => {
        return null;
    };

    /**
     * Determine which function to use to render the trigger (ie. the part of the control that shows when the menu isn't open)
     * and invokes it
     */
    private renderTrigger(): React.ReactNode {
        if (this.props.trigger !== undefined) {
            return this.props.trigger(this.props, this.state);
        } else {
            return this.defaultTriggerRenderFunction(this.props, this.state);
        }
    }

    /**
     * Determine which function to use to render the menu and invokes it
     */
    private renderMenu(): React.ReactNode {
        if (!this.state.isMenuOpen) {
            return;
        }
        // in single select mode we always focus on an item when menu is opened,
        // multi-select lists only auto focus on an item if explicitly set to do so via props
        let shouldFocusOnMount: boolean = !this.props.multiselectable;
        if (this.props.multiselectable && this.props.autoFocus) {
            shouldFocusOnMount = this.props.multiselectable;
        }
        return (
            <Listbox
                labelledBy={this.props.labelledBy}
                disabled={this.props.disabled}
                focusItemOnMount={shouldFocusOnMount}
                multiselectable={this.props.multiselectable}
                defaultSelection={this.state.selectedItems}
                selectedItems={this.props.selectedItems}
                onSelectedItemsChanged={this.updateSelection}
                managedClasses={{
                    listbox: get(this.props.managedClasses, "select_menu", ""),
                    listbox__disabled: get(
                        this.props.managedClasses,
                        "select_menuDisabled",
                        ""
                    ),
                }}
            >
                {this.props.children}
            </Listbox>
        );
    }

    /**
     * Updates selection state and associated values
     */
    private updateSelection = (newSelection: ListboxItemProps[]): void => {
        newSelection = this.trimSelection(newSelection);

        const newValue: string | string[] = this.getValueFromSelection(newSelection);
        const newDisplayString: string = this.getFormattedDisplayString(newSelection);
        if (
            typeof this.props.onValueChange === "function" &&
            !isEqual(newSelection, this.state.selectedItems)
        ) {
            this.props.onValueChange(newValue, newSelection, newDisplayString);
        }

        if (this.props.selectedItems === undefined) {
            this.setState({
                selectedItems: newSelection,
                value: newValue,
                displayString: newDisplayString,
            });
        }
    };

    /**
     * Updates selection state and associated values from props
     */
    private updateSelectionFromProps = (): void => {
        const controlledSelection: ListboxItemProps[] = this.trimSelection(
            Listbox.getListboxItemDataFromIds(
                this.props.selectedItems,
                this.props.children
            )
        );
        this.setState({
            selectedItems: controlledSelection,
            value: this.getValueFromSelection(controlledSelection),
            displayString: this.getFormattedDisplayString(controlledSelection),
        });
    };

    /**
     * Trims the selection for single item mode
     */
    private trimSelection = (selection: ListboxItemProps[]): ListboxItemProps[] => {
        return this.props.multiselectable === false && selection.length > 1
            ? [this.state.selectedItems[0]]
            : selection;
    };

    /**
     * Extracts values in the correct format (string in single select and string[] in multi-select) from an array of items.
     */
    private getValueFromSelection = (
        newSelection: ListboxItemProps[]
    ): string | string[] => {
        if (this.props.multiselectable) {
            return newSelection.map((thisItem: ListboxItemProps) => {
                return thisItem.value;
            });
        } else {
            if (newSelection.length === 0) {
                return "";
            }
            return newSelection[0].value;
        }
    };

    /**
     * The default function that renders an unstyled content display
     */
    private defaultTriggerRenderFunction = (
        props: SelectProps,
        state: SelectState
    ): React.ReactNode => {
        if (props.multiselectable) {
            return null;
        }
        return (
            <Button
                disabled={props.disabled}
                aria-labelledby={props.labelledBy || null}
                aria-haspopup={true}
                aria-expanded={state.isMenuOpen}
            >
                {state.displayString}
            </Button>
        );
    };

    /**
     * The default function that formats the display string generated based on selection.
     * This implementation should match the default formatting a base html select control applies.
     * Developers can provide an alternate formatter if desired.
     */
    private defaultDisplayStringFormatter = (
        selectedOptions: ListboxItemProps[],
        placeholder: string
    ): string => {
        const optionValues: string[] = selectedOptions.map(
            (selectedOption: ListboxItemProps): string => {
                return selectedOption.displayString || selectedOption.value;
            }
        );

        return selectedOptions.length > 0 ? optionValues.join(", ") : placeholder;
    };

    /**
     * Handles clicks
     */
    private handleClick = (e: React.MouseEvent): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }
        this.toggleMenu(!this.state.isMenuOpen);
    };

    /**
     * Handles key events
     */
    private handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }

        switch (e.keyCode) {
            case KeyCodes.enter:
            case KeyCodes.space:
                // preventing default here because when we change focus to the trigger the keydown event gets
                // emitted from the button again which otherwise toggles the menu a second time on a single key press
                e.preventDefault();
                this.toggleMenu(!this.state.isMenuOpen);
                if (this.validateMenuState(!this.state.isMenuOpen) === false) {
                    this.focusTriggerElement();
                }
                break;
            case KeyCodes.escape:
                this.toggleMenu(false);
                this.focusTriggerElement();
                break;
            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
                if (!this.props.multiselectable && !this.state.isMenuOpen) {
                    this.incrementSelectedOption(+1);
                }
                break;
            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
                if (!this.props.multiselectable && !this.state.isMenuOpen) {
                    this.incrementSelectedOption(-1);
                }
                break;
        }
    };

    /**
     * Increment selection
     */
    private incrementSelectedOption = (increment: number): void => {
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(
            this.props.children
        );

        if (this.state.selectedItems.length === 1) {
            const selectedItemIndex: number = Listbox.getItemIndexById(
                ListboxItem.getItemId(this.state.selectedItems[0]),
                this.props.children
            );
            if (selectedItemIndex !== -1) {
                const startIndex: number = selectedItemIndex + increment;
                const endIndex: number = increment > -1 ? childrenAsArray.length - 1 : 0;
                this.selectItemInRange(startIndex, endIndex, childrenAsArray, increment);
            }
        } else {
            const isLastChild: boolean = increment > -1;
            const lastChildIndex: number = childrenAsArray.length - 1;
            this.selectItemInRange(
                isLastChild ? 0 : lastChildIndex,
                isLastChild ? lastChildIndex : 0,
                childrenAsArray,
                increment
            );
        }
        this.toggleMenu(true);
    };

    /**
     * Select a child in a range
     */
    private selectItemInRange = (
        startIndex: number,
        endIndex: number,
        childrenAsArray: React.ReactNode[],
        increment: number
    ): void => {
        const validOption: React.ReactNode = Listbox.getFirstValidOptionInRange(
            startIndex,
            endIndex,
            childrenAsArray,
            increment
        );
        if (validOption !== null) {
            this.updateSelection([(validOption as React.ReactElement<any>).props]);
        }
    };

    /**
     * Toggles the menu
     */
    private toggleMenu = (desiredMenuState: boolean): void => {
        const updatedIsMenuOpen: boolean = this.validateMenuState(desiredMenuState);
        if (updatedIsMenuOpen !== this.state.isMenuOpen) {
            this.setState({
                isMenuOpen: updatedIsMenuOpen,
            });
        }
    };

    /**
     * Validate desired menu state against props
     */
    private validateMenuState = (desiredMenuState: boolean): boolean => {
        let shouldOpenMenu: boolean = desiredMenuState;
        if (this.props.isMenuOpen !== undefined) {
            shouldOpenMenu = this.props.isMenuOpen;
        } else if (this.props.multiselectable === true) {
            shouldOpenMenu = true;
        }
        return shouldOpenMenu;
    };

    /**
     * Close the menu when when there are clicks outside
     */
    private handleWindowClick = (event: MouseEvent): void => {
        if (
            this.state.isMenuOpen &&
            this.rootElement.current !== null &&
            !this.rootElement.current.contains(event.target as Element)
        ) {
            this.toggleMenu(false);
        }
    };

    /**
     * Determines what function needs to be called to format the result string and
     * calls it with the appropriate params
     */
    private getFormattedDisplayString = (selectedOptions: ListboxItemProps[]): string => {
        return this.props.displayStringFormatter === undefined
            ? this.defaultDisplayStringFormatter(selectedOptions, this.props.placeholder)
            : this.props.displayStringFormatter(selectedOptions, this.props.placeholder);
    };

    /**
     * Return the first child of the select that is a non-disabled button
     */
    private getTriggerButton(): HTMLButtonElement {
        const children: Element[] =
            canUseDOM() && this.rootElement.current instanceof HTMLElement
                ? Array.from(this.rootElement.current.children)
                : [];

        const focusChildIndex: number = children.findIndex(this.isFocusableButton);

        return focusChildIndex !== -1
            ? (children[focusChildIndex] as HTMLButtonElement)
            : null;
    }

    /**
     * Determines if a given element is a focusable button
     */
    private isFocusableButton = (element: Element): element is HTMLElement => {
        return (
            element instanceof HTMLButtonElement &&
            element.getAttribute("aria-disabled") !== "true"
        );
    };

    /**
     * focus on the trigger button
     */
    private focusTriggerElement = (): void => {
        const triggerButton: HTMLButtonElement = this.getTriggerButton();
        if (triggerButton !== null) {
            triggerButton.focus();
        }
    };
}

export default Select;
export * from "./select.props";
export { SelectClassNameContract };
