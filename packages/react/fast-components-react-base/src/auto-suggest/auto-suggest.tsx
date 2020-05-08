import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    classNames,
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeEnter,
    keyCodeEscape,
    keyCodeTab,
} from "@microsoft/fast-web-utilities";
import React from "react";
import { isNil } from "lodash-es";
import { Listbox, ListboxItemProps, TextField, TextFieldType } from "../index";
import { DisplayNamePrefix } from "../utilities";
import { AutoSuggestContext, AutoSuggestContextType } from "./auto-suggest-context";
import {
    AutoSuggestHandledProps,
    AutoSuggestProps,
    AutoSuggestUnhandledProps,
} from "./auto-suggest.props";

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
        managedClasses: {},
        filterSuggestions: false,
    };

    private static valuePropertyKey: string = "value";

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
        filterSuggestions: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private shouldFocusMenuOnNextRender: boolean = false;

    private storedValueString: string;

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

        this.storedValueString = value;
    }

    public componentDidUpdate(prevProps: AutoSuggestProps): void {
        if (
            !this.state.isMenuOpen &&
            React.Children.count(this.renderChildren(prevProps.children)) === 0 &&
            React.Children.count(this.renderChildren()) > 0 &&
            !isNil(this.rootElement.current) &&
            this.rootElement.current.contains(document.activeElement)
        ) {
            // if the component has focus and a previously empty suggestions list is
            // populated we should open the menu
            this.toggleMenu(true);
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
                onBlurCapture={this.handleBlurCapture}
                className={this.generateClassNames()}
            >
                <AutoSuggestContext.Provider
                    value={{
                        currentValue: this.storedValueString,
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
        const {
            autoSuggest,
            autoSuggest__disabled,
            autoSuggest__menuOpen,
        }: AutoSuggestClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                autoSuggest,
                [autoSuggest__disabled, this.props.disabled],
                [autoSuggest__menuOpen, this.state.isMenuOpen]
            )
        );
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
        const {
            autoSuggest_menu,
            autoSuggest__disabled,
        }: AutoSuggestClassNameContract = this.props.managedClasses;

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
                    listbox: autoSuggest_menu,
                    listbox__disabled: autoSuggest__disabled,
                }}
            >
                {this.renderChildren()}
            </Listbox>
        );
    }

    private renderChildren(alternateChildren?: React.ReactNode): React.ReactNode {
        const children: React.ReactNode = isNil(alternateChildren)
            ? this.props.children
            : alternateChildren;
        if (this.props.filterSuggestions) {
            return React.Children.map(
                children as React.ReactNode,
                (node: React.ReactElement<any>): React.ReactNode | null => {
                    if (!isNil(node.props)) {
                        if (node.props[AutoSuggest.valuePropertyKey] === undefined) {
                            return node;
                        }
                        return this.isMatch(node.props) ? node : null;
                    }
                }
            );
        } else {
            return children;
        }
    }

    /**
     * Determine if a single node is a match
     */
    private isMatch(node: ListboxItemProps): boolean {
        if (!isNil(this.storedValueString)) {
            return node.value
                .toLowerCase()
                .includes(this.storedValueString.toLowerCase());
        }
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
                aria-expanded={state.isMenuOpen}
                aria-owns={listboxId || null}
                aria-controls={listboxId || null}
            />
        );
    };

    /**
     * Handle blur events
     */
    private handleBlurCapture = (event: React.FocusEvent): void => {
        if (
            this.state.isMenuOpen &&
            !isNil(this.rootElement.current) &&
            !this.rootElement.current.contains(event.relatedTarget as Element)
        ) {
            // close the menu when focus moves out of the component
            this.toggleMenu(false);
        }
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
            this.updateValue(newSelection[0].value, true);
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
        this.storedValueString = this.state.value;
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
        this.storedValueString = newValue;
        this.updateValue(newValue, false);
    };

    /**
     * Update the currentValue of the component
     */
    private updateValue = (newValue: string, isFromSuggestedOption: boolean): void => {
        if (typeof this.props.onValueChange === "function") {
            this.props.onValueChange(newValue, isFromSuggestedOption);
        }

        if (isNil(this.props.value) && newValue !== this.state.value) {
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
            case keyCodeEnter:
                this.invoke(this.state.value, null);
                break;

            case keyCodeEscape:
                this.toggleMenu(false);
                break;

            case keyCodeArrowDown:
                this.focusOnMenu(1);
                e.preventDefault();
                break;

            case keyCodeArrowUp:
                this.focusOnMenu(-1);
                e.preventDefault();
                break;

            case keyCodeTab:
                // Prevent default case handling for tab
                break;

            default:
                if (e.target instanceof HTMLInputElement) {
                    const newValue: string = (e.target as HTMLInputElement).value;
                    this.updateValue(newValue, false);
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
            case keyCodeEscape:
                this.toggleMenu(false);
                break;

            case keyCodeArrowDown:
                if (this.checkForMenuEnd(1) === true) {
                    e.preventDefault();
                }
                break;

            case keyCodeArrowUp:
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
            this.renderChildren()
        );

        const currentItemIndex: number = Listbox.getItemIndexById(
            this.state.focusedItem.id,
            this.renderChildren()
        );

        const startIndex: number = currentItemIndex + increment;

        if (startIndex > childrenAsArray.length - 1 || startIndex < 0) {
            this.setState({
                value: this.storedValueString,
            });
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
            this.setState({
                value: this.storedValueString,
            });
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
        this.storedValueString = this.state.value;
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(
            this.renderChildren()
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
                this.setState({
                    value: this.storedValueString,
                });
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
        const inputElements: HTMLCollectionOf<HTMLInputElement> = this.rootElement.current.getElementsByTagName(
            "input"
        );
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
            : React.Children.count(this.renderChildren()) === 0
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
