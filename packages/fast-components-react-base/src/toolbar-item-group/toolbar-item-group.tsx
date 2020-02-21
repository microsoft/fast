import { ToolbarItemGroupClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames, Orientation } from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    ToolbarItemGroupHandledProps,
    ToolbarItemGroupProps,
    ToolbarItemGroupUnhandledProps,
} from "./toolbar-item-group.props";
import Toolbar from "../toolbar/toolbar";
import { isNil } from "lodash-es";
import { ToolbarContext, ToolbarContextType } from "../toolbar/toolbar-context";

export interface ToolbarItemGroupState {
    /**
     *  the indexes of children of this component that can receive focus
     */
    focusableItemIndexes: number[] | null;
}

class ToolbarItemGroup extends Foundation<
    ToolbarItemGroupHandledProps,
    ToolbarItemGroupUnhandledProps,
    ToolbarItemGroupState
> {
    public static displayName: string = `${DisplayNamePrefix}ToolbarItemGroup`;
    public static contextType: React.Context<ToolbarContextType> = ToolbarContext;

    public static defaultProps: Partial<ToolbarItemGroupProps> = {
        itemPath: [],
        managedClasses: {},
    };

    protected handledProps: HandledProps<ToolbarItemGroupHandledProps> = {
        itemPath: void 0,
        managedClasses: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: ToolbarItemGroupProps) {
        super(props);
        this.state = {
            focusableItemIndexes: null,
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                ref={this.rootElement}
            >
                {this.renderChildren()}
            </div>
        );
    }

    public componentDidMount(): void {
        this.updateFocusableItems();
    }

    public componentDidUpdate(prevProps: ToolbarItemGroupProps): void {
        if (prevProps !== this.props) {
            // when props update we need to reset focusable items so we
            // can mark the correct tabindex values on render
            this.setState({
                focusableItemIndexes: null,
            });
            return;
        }
        if (this.state.focusableItemIndexes === null) {
            this.updateFocusableItems();
        }
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        const {
            toolbarItemGroup,
            toolbarItemGroup__horizontal,
            toolbarItemGroup__vertical,
        }: ToolbarItemGroupClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                toolbarItemGroup,
                [
                    toolbarItemGroup__horizontal,
                    this.context.orientation === Orientation.horizontal,
                ],
                [
                    toolbarItemGroup__vertical,
                    this.context.orientation === Orientation.vertical,
                ]
            )
        );
    }

    /**
     * Render all child elements
     */
    private renderChildren = (): React.ReactChild[] => {
        return React.Children.map(this.props.children, this.renderChild);
    };

    /**
     * Render a single child
     */
    private renderChild = (
        child: React.ReactElement,
        index: number
    ): React.ReactChild => {
        const thisItemPath: number[] = this.props.itemPath.slice(0);
        thisItemPath.push(index);
        const itemPathAsString: string = thisItemPath.toString();

        if (child.type === ToolbarItemGroup) {
            const groupProps: object = {
                itemPath: thisItemPath,
            };

            groupProps[Toolbar.toolbarItemGroupAttributeName] = itemPathAsString;
            return React.cloneElement(child, groupProps);
        }

        const isFocusableItemIndex: boolean =
            isNil(this.state.focusableItemIndexes) ||
            this.state.focusableItemIndexes.includes(index);

        const itemProps: object = {
            tabIndex: isFocusableItemIndex
                ? this.context.currentFocusItemPath === itemPathAsString
                    ? 0
                    : -1
                : null,
        };
        itemProps[Toolbar.toolbarItemAttributeName] = isFocusableItemIndex
            ? itemPathAsString
            : null;

        return React.cloneElement(child, itemProps);
    };

    /**
     *  identifies which children are focusable and sets state
     */
    private updateFocusableItems = (): void => {
        const domChildren: Element[] = this.domChildren();
        const validItemIndexes: number[] = [];
        domChildren.forEach((element: HTMLElement, index: number) => {
            if (Toolbar.isFocusable(element)) {
                validItemIndexes.push(index);
            }
        });
        this.setState({
            focusableItemIndexes: validItemIndexes,
        });
    };

    /**
     *
     */
    private domChildren = (): Element[] => {
        return canUseDOM() && this.rootElement.current instanceof HTMLElement
            ? Array.from(this.rootElement.current.children)
            : [];
    };
}
ToolbarItemGroup.contextType = ToolbarContext;
export default ToolbarItemGroup;
export * from "./toolbar-item-group.props";
export { ToolbarItemGroupClassNameContract };
