import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get, isEqual } from "lodash-es";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    AutoSuggestHandledProps,
    AutoSuggestProps,
    AutoSuggestUnhandledProps,
} from "./auto-suggest.props";
import { ListboxItemProps } from "../listbox-item";
import Listbox from "../listbox";
import TextField, { TextFieldType } from "../text-field";
import { AutoSuggestContext, AutoSuggestContextType } from "./auto-suggest-context";
import { DisplayNamePrefix } from "../utilities";

export interface AutoSuggestState {
    value: string;
    isMenuOpen: boolean;
    focusedItem: ListboxItemProps;
}

class AutoSuggest extends Foundation<
    AutoSuggestHandledProps,
    AutoSuggestUnhandledProps,
    AutoSuggestState
> {
    public static displayName: string = `${DisplayNamePrefix}AutoSuggest`;

    public static defaultProps: Partial<AutoSuggestProps> = {
        initialValue: "",
        disabled: false,
        placeholder: "",
    };

    /**
     * Handled props instantiation
     */
    protected handledProps: HandledProps<AutoSuggestHandledProps> = {
        isMenuOpen: void 0,
        disabled: void 0,
        label: void 0,
        inputRegion: void 0,
        managedClasses: void 0,
        initialValue: void 0,
        value: void 0,
        onValueChange: void 0,
        onInvoked: void 0,
        placeholder: void 0,
        listboxId: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private shouldFocusMenuOnNextRender: boolean = false;

    /**
     * constructor
     */
    constructor(props: AutoSuggestProps) {
        super(props);

        const value: string =
            this.props.value === undefined ? this.props.initialValue : this.props.value;

        this.state = {
            value,
            focusedItem: null,
            isMenuOpen: this.validateMenuState(false),
        };
    }

    public componentDidUpdate(prevProps: AutoSuggestProps): void {
        const updatedMenuVisibility: boolean = this.validateMenuState(
            this.state.isMenuOpen
        );

        if (updatedMenuVisibility !== this.state.isMenuOpen) {
            this.toggleMenu(updatedMenuVisibility);
        }

        if (this.props.value !== prevProps.value) {
            this.setState({
                value: this.props.value,
            });
        }
    }

    public componentDidMount(): void {
        window.addEventListener("click", this.handleWindowClick);
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
                ref={this.rootElement}
                className={this.generateClassNames()}
            >
                <AutoSuggestContext.Provider
                    value={{
                        currentValue: this.state.value,
                    }}
                >
                    {this.renderInputRegion()}
                    {this.renderMenu()}
                </AutoSuggestContext.Provider>
            </div>
        );
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props.managedClasses, "autoSuggest", "");

        if (this.props.disabled) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "autoSuggest__disabled", "")
            );
        }

        if (this.state.isMenuOpen) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "autoSuggest__menuOpen", "")
            );
        }

        return super.generateClassNames(className);
    }

    /**
     * Determine which function to use to render content display (ie. the part of the control that shows when the menu isn't open)
     * and invokes it
     */
    private renderInputRegion(): React.ReactNode {
        if (typeof this.props.inputRegion === "function") {
            return this.props.inputRegion(
                this.props,
                this.state,
                this.handleChange,
                this.handleInputRegionClick,
                this.handleInputRegionKeydown
            );
        } else {
            return this.defaultInputRegionRenderFunction(
                this.props,
                this.state,
                this.handleChange,
                this.handleInputRegionClick,
                this.handleInputRegionKeydown
            );
        }
    }

    /**
     * Determine which function to use to render the menu and invokes it
     */
    private renderMenu(): React.ReactNode {
        const shouldFocusOnMenu: boolean = this.shouldFocusMenuOnNextRender;
        this.shouldFocusMenuOnNextRender = false;

        if (!this.state.isMenuOpen) {
            return;
        }

        const focusedItem: ListboxItemProps[] =
            this.state.focusedItem !== null ? [this.state.focusedItem] : [];
        return (
            <Listbox
                id={this.props.listboxId}
                typeAheadEnabled={false}
                disabled={this.props.disabled}
                focusItemOnMount={shouldFocusOnMenu}
                defaultSelection={focusedItem}
                onSelectedItemsChanged={this.updateFocusedItem}
                onItemInvoked={this.handleItemInvoked}
                onKeyDown={this.handleMenuKeydown}
                managedClasses={{
                    listbox: get(this.props.managedClasses, "autoSuggest_menu", ""),
                    listbox__disabled: get(
                        this.props.managedClasses,
                        "autoSuggest_menuDisabled",
                        ""
                    ),
                }}
            >
                {this.props.children}
            </Listbox>
        );
    }

    /**
     * The default function that renders an unstyled content display
     */
    private defaultInputRegionRenderFunction = (
        props: AutoSuggestProps,
        state: AutoSuggestState,
        onChange: (event: React.ChangeEvent) => void,
        onClick: (event: React.MouseEvent) => void,
        onKeyDown: (event: React.KeyboardEvent) => void
    ): React.ReactNode => {
        const listboxId: string = state.isMenuOpen ? props.listboxId : null;
        const activedescendantId: string =
            state.focusedItem !== null ? state.focusedItem.id : null;
        return (
            <TextField
                disabled={props.disabled}
                onChange={onChange}
                onClick={onClick}
                onKeyDown={onKeyDown}
                value={state.value}
                type={TextFieldType.text}
                role="combobox"
                aria-label={props.label || null}
                aria-autocomplete="both"
                aria-activedescendant={activedescendantId || null}
                aria-owns={listboxId || null}
                aria-controls={listboxId || null}
            />
        );
    };

    /**
     * Updates selection state and associated values
     */
    private updateFocusedItem = (newSelection: ListboxItemProps[]): void => {
        if (newSelection.length === 0) {
            this.setState({
                focusedItem: null,
            });
        } else {
            this.setState({
                focusedItem: newSelection[0],
            });
            this.updateValue(newSelection[0].value);
        }
    };

    /**
     * Handles clicks
     */
    private handleInputRegionClick = (e: React.MouseEvent): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }
        this.toggleMenu(true);
    };

    /**
     * Handles item invoked
     */
    private handleItemInvoked = (item: ListboxItemProps): void => {
        this.invoke(item.value, item);
        this.toggleMenu(false);
    };

    /**
     * Invokes the auto-select component
     */
    private invoke = (value: string, item: ListboxItemProps): void => {
        if (typeof this.props.onInvoked === "function") {
            this.props.onInvoked(value, item);
        }
    };

    /**
     * Handles value changes from input element
     */
    private handleChange = (e: React.ChangeEvent): void => {
        const newValue: string = (e.target as HTMLInputElement).value;
        this.updateValue(newValue);
    };

    /**
     * Update the currentValue of the component
     */
    private updateValue = (newValue: string): void => {
        if (typeof this.props.onValueChange === "function") {
            this.props.onValueChange(newValue);
        }

        if (this.props.value !== undefined || newValue !== this.state.value) {
            this.toggleMenu(true);
            this.setState({
                value: newValue,
            });
        }
    };

    /**
     * Handles input region key events
     */
    private handleInputRegionKeydown = (e: React.KeyboardEvent<Element>): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }

        switch (e.keyCode) {
            case KeyCodes.enter:
                this.invoke(this.state.value, null);
                break;

            case KeyCodes.escape:
                this.toggleMenu(false);
                break;

            case KeyCodes.arrowDown:
                this.focusOnMenu(1);
                e.preventDefault();
                break;

            case KeyCodes.arrowUp:
                this.focusOnMenu(-1);
                e.preventDefault();
                break;

            default:
                if (e.target instanceof HTMLInputElement) {
                    const newValue: string = (e.target as HTMLInputElement).value;
                    this.updateValue(newValue);
                    this.focusOnInput();
                    break;
                }
        }
    };

    /**
     * Handles menu key events
     */
    private handleMenuKeydown = (e: React.KeyboardEvent<Element>): void => {
        if (this.props.disabled || e.defaultPrevented) {
            return;
        }
        switch (e.keyCode) {
            case KeyCodes.escape:
                this.toggleMenu(false);
                break;

            case KeyCodes.arrowDown:
                if (this.checkForMenuEnd(1) === true) {
                    e.preventDefault();
                }
                break;

            case KeyCodes.arrowUp:
                if (this.checkForMenuEnd(-1) === true) {
                    e.preventDefault();
                }
                break;

            default:
                if (this.isValidInput(e)) {
                    this.focusOnInput();
                }
                break;
        }
    };

    /**
     * test if a key press is a valid input
     */
    private isValidInput = (e: React.KeyboardEvent<Element>): boolean => {
        if (
            e.keyCode < 8 ||
            (e.keyCode > 8 && e.keyCode < 48) ||
            (e.keyCode > 90 && e.keyCode < 96) ||
            (e.keyCode > 111 && e.keyCode < 186) ||
            e.keyCode > 222
        ) {
            return false;
        }
        return true;
    };

    /**
     * Passes focus to the input element if focus would bump up against the ends of the menu,
     * return true if result was focusing on input region
     */
    private checkForMenuEnd = (increment: number): boolean => {
        if (this.state.focusedItem === null) {
            return false;
        }

        const childrenAsArray: React.ReactNode[] = React.Children.toArray(
            this.props.children
        );

        const currentItemIndex: number = Listbox.getItemIndexById(
            this.state.focusedItem.id,
            this.props.children
        );

        const startIndex: number = currentItemIndex + increment;

        if (startIndex > childrenAsArray.length - 1 || startIndex < 0) {
            // at the end of the list, focus on input
            this.focusOnInput();
            return true;
        }

        const endIndex: number = increment > -1 ? childrenAsArray.length - 1 : 0;

        const nextFocusableItem: ListboxItemProps = (Listbox.getFirstValidOptionInRange(
            startIndex,
            endIndex,
            childrenAsArray,
            increment
        ) as React.ReactElement<any>).props;

        if (
            nextFocusableItem === null ||
            nextFocusableItem.id === this.state.focusedItem.id
        ) {
            // at the end of the list, focus on input
            this.focusOnInput();
            return true;
        }

        return false;
    };

    /**
     * Opens menu and focuses on first or last valid item
     */
    private focusOnMenu = (increment: number): void => {
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(
            this.props.children
        );

        if (childrenAsArray.length === 0) {
            return;
        }

        const startIndex: number = increment > -1 ? 0 : childrenAsArray.length - 1;
        const endIndex: number = increment > -1 ? childrenAsArray.length - 1 : 0;
        this.focusFirstItemInRange(startIndex, endIndex, childrenAsArray, increment);

        this.toggleMenu(true);
        this.shouldFocusMenuOnNextRender = true;
    };

    /**
     * Gets first child in a range
     */
    private focusFirstItemInRange = (
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
            this.updateFocusedItem([(validOption as React.ReactElement<any>).props]);
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
            if (this.state.isMenuOpen && !updatedIsMenuOpen) {
                this.focusOnInput();
            }
        }
    };

    /**
     * Focus on the input element
     */
    private focusOnInput = (): void => {
        if (this.rootElement.current === null) {
            return;
        }
        const inputElements: HTMLCollectionOf<
            HTMLInputElement
        > = this.rootElement.current.getElementsByTagName("input");
        if (inputElements.length > 0) {
            inputElements[0].focus();
        }
        this.updateFocusedItem([]);
    };

    /**
     * Determine menu state by comparing desired state to props
     */
    private validateMenuState = (desiredMenuState: boolean): boolean => {
        return typeof this.props.isMenuOpen === "boolean"
            ? this.props.isMenuOpen
            : React.Children.count(this.props.children) === 0
                ? false
                : desiredMenuState;
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
}

export default AutoSuggest;
export * from "./auto-suggest.props";
export { AutoSuggestClassNameContract, AutoSuggestContext, AutoSuggestContextType };
