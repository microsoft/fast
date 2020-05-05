import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    classNames,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnter,
    keyCodeEscape,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import { get, isEqual, isNil, uniqueId } from "lodash-es";
import React from "react";
import Listbox from "../listbox";
import { ListboxItemProps } from "../listbox-item";
import { DisplayNamePrefix } from "../utilities";
import ViewportPositioner, {
    ViewportPositionerClassNameContract,
} from "../viewport-positioner";
import { SelectHandledProps, SelectProps, SelectUnhandledProps } from "./select.props";

export interface SelectState {
    value: string | string[];
    displayString: string;
    selectedItems: ListboxItemProps[];
    isMenuOpen: boolean;
    selectedItemIndex: number;
    selectableItemCount: number;
}

class Select extends Foundation<SelectHandledProps, SelectUnhandledProps, SelectState> {
    public static displayName: string = `${DisplayNamePrefix}Select`;

    public static defaultProps: Partial<SelectProps> = {
        multiselectable: false,
        disabled: false,
        defaultSelection: [],
        placeholder: "",
        managedClasses: {},
    };

    private static idPropertyKey: string = "id";
    private static triggerUniqueIdPrefix: string = "selecttrigger-";

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
        menu: void 0,
        required: void 0,
        managedClasses: void 0,
        selectedItems: void 0,
        defaultSelection: void 0,
        onValueChange: void 0,
        placeholder: void 0,
        autoFocus: void 0,
        menuFlyoutConfig: void 0,
        onMenuSelectionChange: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef();

    private triggerId: string = uniqueId(Select.triggerUniqueIdPrefix);

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

        const validOptions: React.ReactNode[] = this.getValidOptions();

        this.state = {
            selectedItems: initialSelection,
            value: this.getValueFromSelection(initialSelection),
            displayString: this.getFormattedDisplayString(initialSelection),
            isMenuOpen: this.validateMenuState(false),
            selectedItemIndex: this.getSelectedItemPosInSet(
                validOptions,
                initialSelection
            ),
            selectableItemCount: validOptions.length,
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
        this.toggleMenu(this.checkPropsForMenuState());
        if (
            this.props.autoFocus &&
            !this.state.isMenuOpen &&
            !this.props.multiselectable
        ) {
            this.focusTriggerElement();
        }
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
        const {
            select,
            select__scaleToFit,
            select__disabled,
            select_menu__open,
            select__multiSelectable,
        }: SelectClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                select,
                [
                    select__scaleToFit,
                    !isNil(this.props.menuFlyoutConfig) &&
                        this.props.menuFlyoutConfig.scaleToFit,
                ],
                [select__disabled, this.props.disabled],
                [select_menu__open, this.state.isMenuOpen],
                [select__multiSelectable, this.props.multiselectable]
            )
        );
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
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    private onSelectValueChange = (event: React.ChangeEvent): void => {
        return null;
    };

    /**
     * Determine which function to use to render the trigger (ie. the part of the control that shows when the menu isn't open)
     * and invokes it
     */
    private renderTrigger(): React.ReactNode {
        if (this.props.trigger !== undefined) {
            return this.props.trigger(this.props, this.state, this.triggerId);
        } else {
            return this.defaultTriggerRenderFunction(
                this.props,
                this.state,
                this.triggerId
            );
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
        const defaultMenu: React.ReactNode = (
            <Listbox
                labelledBy={this.props.labelledBy}
                disabled={this.props.disabled}
                focusItemOnMount={shouldFocusOnMount}
                multiselectable={this.props.multiselectable}
                defaultSelection={this.state.selectedItems}
                selectedItems={this.props.selectedItems}
                onSelectedItemsChanged={this.menuSelectionChange}
                onBlur={this.handleMenuBlur}
                selectOnFocus={false}
                tabIndex={-1}
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

        const customMenu: React.ReactNode =
            typeof this.props.menu === "function"
                ? this.props.menu(this.props, this.state, defaultMenu)
                : defaultMenu;

        if (isNil(this.props.menuFlyoutConfig)) {
            return customMenu;
        } else {
            return (
                <ViewportPositioner
                    anchor={this.rootElement}
                    {...this.props.menuFlyoutConfig}
                    managedClasses={this.generateViewportPositionerClassNames()}
                >
                    {customMenu}
                </ViewportPositioner>
            );
        }
    }

    /**
     * Returns viewport positioner managedclasses for select
     */
    private generateViewportPositionerClassNames(): ViewportPositionerClassNameContract {
        const {
            select__menuPositioningRegion,
            select__menuPositionLeft,
            select__menuPositionRight,
            select__menuPositionTop,
            select__menuPositionBottom,
            select__menuPositionHorizontalInset,
            select__menuPositionVerticalInset,
        }: SelectClassNameContract = this.props.managedClasses;

        return {
            viewportPositioner: select__menuPositioningRegion,
            viewportPositioner__left: select__menuPositionLeft,
            viewportPositioner__right: select__menuPositionRight,
            viewportPositioner__top: select__menuPositionTop,
            viewportPositioner__bottom: select__menuPositionBottom,
            viewportPositioner__horizontalInset: select__menuPositionHorizontalInset,
            viewportPositioner__verticalInset: select__menuPositionVerticalInset,
        };
    }

    /**
     * Handles selection changes from menu
     */
    private menuSelectionChange = (newSelection: ListboxItemProps[]): void => {
        if (typeof this.props.onMenuSelectionChange === "function") {
            this.props.onMenuSelectionChange(newSelection);
        }
        this.updateSelection(newSelection);
    };

    /**
     * Updates selection state and associated values
     */
    private updateSelection = (newSelection: ListboxItemProps[]): void => {
        newSelection = this.trimSelection(newSelection);

        const newValue: string | string[] = this.getValueFromSelection(newSelection);

        if (this.state.value === newValue) {
            // no change, abort
            return;
        }

        const newDisplayString: string = this.getFormattedDisplayString(newSelection);
        if (
            typeof this.props.onValueChange === "function" &&
            !isEqual(newSelection, this.state.selectedItems)
        ) {
            this.props.onValueChange(newValue, newSelection, newDisplayString);
        }

        if (this.props.selectedItems === undefined) {
            const validOptions: React.ReactNode[] = this.getValidOptions();
            this.setState({
                selectedItems: newSelection,
                value: newValue,
                displayString: newDisplayString,
                selectedItemIndex: this.getSelectedItemPosInSet(
                    validOptions,
                    newSelection
                ),
                selectableItemCount: validOptions.length,
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
     * get the index of the provided selection
     * (excludes children that aren't valid options)
     */
    private getSelectedItemPosInSet = (
        options: React.ReactNode[],
        selection: ListboxItemProps[]
    ): number => {
        if (!this.props.multiselectable && selection.length === 1) {
            const selectionId: string = selection[0].id;
            const optionCount: number = options.length;
            for (let i: number = 0; i < optionCount; i++) {
                if (
                    (options[i] as React.ReactElement<any>).props[
                        Select.idPropertyKey
                    ] === selectionId
                ) {
                    return i + 1;
                }
            }
        }
        return 0;
    };

    /**
     * The default function that renders an unstyled content display
     */
    private defaultTriggerRenderFunction = (
        props: SelectProps,
        state: SelectState,
        triggerId: string
    ): React.ReactNode => {
        if (props.multiselectable) {
            return null;
        }
        const labelledBy: string = `${
            isNil(this.props.labelledBy) ? "" : `${this.props.labelledBy} `
        }${triggerId}`;
        return (
            <button
                disabled={props.disabled}
                id={triggerId}
                aria-haspopup="listbox"
                aria-labelledby={labelledBy}
                aria-expanded={state.isMenuOpen}
            >
                {state.displayString}
            </button>
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
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(e);
        }

        if (this.props.disabled || e.defaultPrevented) {
            return;
        }
        e.preventDefault();
        this.toggleMenu(!this.state.isMenuOpen);
        if (this.validateMenuState(!this.state.isMenuOpen) === false) {
            this.focusTriggerElement();
        }
    };

    /**
     * Handles key events
     */
    private handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (typeof this.props.onKeyDown === "function") {
            this.props.onKeyDown(e);
        }

        if (this.props.disabled || e.defaultPrevented) {
            return;
        }

        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                // preventing default here because when we change focus to the trigger the keydown event gets
                // emitted from the button again which otherwise toggles the menu a second time on a single key press
                e.preventDefault();
                this.toggleMenu(!this.state.isMenuOpen);
                if (this.validateMenuState(!this.state.isMenuOpen) === false) {
                    this.focusTriggerElement();
                }
                break;
            case keyCodeEscape:
                e.preventDefault();
                this.toggleMenu(false);
                this.focusTriggerElement();
                break;
            case keyCodeArrowDown:
            case keyCodeArrowRight:
                e.preventDefault();
                if (!this.props.multiselectable && !this.state.isMenuOpen) {
                    this.incrementSelectedOption(+1);
                }
                break;
            case keyCodeArrowUp:
            case keyCodeArrowLeft:
                e.preventDefault();
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
                this.state.selectedItems[0].id,
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
        if (!isNil(validOption)) {
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
     * handle menu blur
     */
    private handleMenuBlur = (event: React.FocusEvent): void => {
        if (
            this.state.isMenuOpen &&
            !this.props.multiselectable &&
            this.rootElement.current !== null &&
            !this.rootElement.current.contains(event.relatedTarget as Element)
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

    /**
     * get valid options
     */
    private getValidOptions = (): React.ReactNode[] => {
        return Listbox.getValidOptions(React.Children.toArray(this.props.children));
    };
}

export default Select;
export * from "./select.props";
export { SelectClassNameContract };
