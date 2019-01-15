import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ListboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ListboxHandledProps,
    ListboxProps,
    ListboxUnhandledProps,
} from "./listbox.props";
import * as React from "react";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { get, inRange, invert } from "lodash-es";
import { canUseDOM } from "exenv-es6";

export interface ListboxState {
    /**
     * The index of the focusable child
     */
    focusIndex: number;
}

export interface TypeAheadDataItem {
    index: number;
    compareString: string;
}

class Listbox extends Foundation<
    ListboxHandledProps,
    ListboxUnhandledProps,
    ListboxState
> {
    public static displayName: string = "Listbox";

    protected handledProps: HandledProps<ListboxHandledProps> = {
        children: void 0,
        managedClasses: void 0,
        typeAheadPropName: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private typeAheadString: string = "";
    private typeAheadTimer: any;
    private typeAheadData: TypeAheadDataItem[] = [];

    constructor(props: ListboxProps) {
        super(props);

        this.state = {
            focusIndex: -1,
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
                role="listbox"
                className={this.generateClassNames()}
                onKeyDown={this.handleMenuKeyDown}
            >
                {this.renderChildren()}
            </div>
        );
    }

    public componentDidMount(): void {
        const children: Element[] = this.domChildren();
        const focusIndex: number = children.findIndex(this.isFocusableElement);

        if (focusIndex !== -1) {
            this.setState({
                focusIndex,
            });
        }
    }

    public componentWillUnmount(): void {
        clearTimeout(this.typeAheadTimer);
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "listbox"));
    }

    /**
     * Render all child elements
     */
    private renderChildren(): React.ReactChild[] {
        this.typeAheadData = [];
        return React.Children.map(this.props.children, this.renderChild);
    }

    /**
     * Render a single child
     */
    private renderChild = (
        child: React.ReactElement<any>,
        index: number
    ): React.ReactChild => {
        if (child.props[this.props.typeAheadPropName] !== undefined) {
            this.typeAheadData.push({
                index,
                compareString: child.props[this.props.typeAheadPropName].toLowerCase(),
            });
        }
        return React.cloneElement(child, {
            tabIndex: index === this.state.focusIndex ? 0 : -1,
        });
    };

    /**
     * Determines if a given element should be focusable by the menu
     */
    private isFocusableElement = (element: Element): element is HTMLElement => {
        return (
            element instanceof HTMLElement && element.getAttribute("role") === "option"
        );
    };

    /**
     * Determines if a given element is disabled
     */
    private isDisabledElement = (element: Element): element is HTMLElement => {
        return (
            element instanceof HTMLElement &&
            element.getAttribute("aria-disabled") === "true"
        );
    };

    /**
     * Return an array of all focusabled elements that are children
     * of the context menu
     */
    private domChildren(): Element[] {
        return canUseDOM() && this.rootElement.current instanceof HTMLElement
            ? Array.from(this.rootElement.current.children)
            : [];
    }

    /**
     * Ensure we always validate our internal state on item focus events, otherwise
     * the component can get out of sync from click events
     */
    private handleMenuItemFocus = (e: React.FocusEvent<HTMLElement>): void => {
        const target: Element = e.currentTarget;
        const focusIndex: number = this.domChildren().indexOf(target);

        if (this.isDisabledElement(target)) {
            target.blur();
            return;
        }

        if (focusIndex !== this.state.focusIndex && focusIndex !== -1) {
            this.setFocus(focusIndex, focusIndex > this.state.focusIndex ? 1 : -1);
        }
    };

    /**
     * Sets focus to the nearest focusable element to the supplied focusIndex.
     * The adjustment controls how the function searches for other focusable elements
     * if the element at the focusIndex is not focusable. A positive number will search
     * towards the end of the children array, whereas a negative number will search towards
     * the beginning of the children array.
     */
    private setFocus(focusIndex: number, adjustment: number): void {
        const children: Element[] = this.domChildren();

        while (inRange(focusIndex, children.length)) {
            const child: Element = children[focusIndex];

            if (this.isFocusableElement(child)) {
                child.focus();

                this.setState({
                    focusIndex,
                });

                break;
            }

            focusIndex += adjustment;
        }
    }

    /**
     * Handle the keydown event of the root menu
     */
    private handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        switch (e.keyCode) {
            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
                e.preventDefault();
                this.setFocus(this.state.focusIndex + 1, 1);

                break;

            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
                e.preventDefault();
                this.setFocus(this.state.focusIndex - 1, -1);

                break;

            case KeyCodes.end:
                e.preventDefault();
                this.setFocus(this.domChildren().length - 1, -1);

                break;

            case KeyCodes.home:
                e.preventDefault();
                this.setFocus(0, 1);

                break;

            default:
                if (!e.ctrlKey) {
                    this.processTypeAhead(e);
                }
        }
    };

    private processTypeAhead = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        const acceptedChars: string[] = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "0",
        ];

        const newChar: string = e.key.toLowerCase();

        if (acceptedChars.indexOf(newChar) === -1) {
            return;
        }

        e.preventDefault();

        clearTimeout(this.typeAheadTimer);

        this.typeAheadString = this.typeAheadString + newChar;
        const children: Element[] = this.domChildren();
        let matchIndex: number = -1;
        this.typeAheadData.some(
            (typeAheadData: TypeAheadDataItem, index: number): boolean => {
                if (typeAheadData.compareString.includes(this.typeAheadString)) {
                    matchIndex = typeAheadData.index;
                    return true;
                }

                return false;
            }
        );

        if (matchIndex !== -1) {
            this.typeAheadTimer = setTimeout((): void => {
                this.typeAheadTimerExpired();
            }, 1000);
            this.setFocus(matchIndex, 1);
        } else {
            this.typeAheadString = "";
        }
    };

    private typeAheadTimerExpired = (): void => {
        this.typeAheadString = "";
        clearTimeout(this.typeAheadTimer);
    };
}

export default Listbox;
export * from "./listbox.props";
export { ListboxClassNameContract };
