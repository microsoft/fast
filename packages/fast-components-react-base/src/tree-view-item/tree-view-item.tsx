import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TreeViewItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    classNames,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnter,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import { getDisplayedNodes, isHTMLElement } from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import { TreeViewContext, TreeViewContextValue } from "../tree-view/tree-view";
import { DisplayNamePrefix } from "../utilities";
import {
    TreeViewItemHandledProps,
    TreeViewItemProps,
    TreeViewItemUnhandledProps,
} from "./tree-view-item.props";

export interface TreeViewItemState {
    /**
     * Track whether the item is focusable
     */
    focusable: boolean;

    /**
     * The expanded state of the tree
     */
    expanded: boolean;
}

class TreeViewItem extends Foundation<
    TreeViewItemHandledProps,
    TreeViewItemUnhandledProps,
    TreeViewItemState
> {
    public static displayName: string = `${DisplayNamePrefix}TreeViewItem`;
    public static defaultProps: Partial<TreeViewItemProps> = {
        defaultExpanded: false,
        managedClasses: {},
    };

    public static contextType: React.Context<TreeViewContextValue> = TreeViewContext;

    protected handledProps: HandledProps<TreeViewItemHandledProps> = {
        dragConnect: void 0,
        expandCollapseGlyph: void 0,
        titleContent: void 0,
        children: void 0,
        managedClasses: void 0,
        selected: void 0,
        defaultExpanded: void 0,
        onExpandedChange: void 0,
        onSelected: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private expandCollapseButton: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: TreeViewItemProps) {
        super(props);

        this.state = {
            focusable: false,
            expanded: this.hasChildNodes() ? this.props.defaultExpanded : undefined,
        };
    }

    public componentDidMount(): void {
        if (this.hasChildNodes()) {
            this.adjustNestedTreeItemCount(1);

            if (this.hasSelectedChild() && !this.state.expanded) {
                this.setExpanded(true);
            }
        }
    }

    public componentDidUpdate(prevProps: TreeViewItemProps): void {
        // if we become selected, call the selected callback
        if (this.props.selected && !prevProps.selected) {
            this.handleSelected();
        }

        const hadChildNodes: boolean = this.hasChildNodes(prevProps);
        const hasChildNodes: boolean = this.hasChildNodes();

        if (hasChildNodes && !hadChildNodes) {
            // if defaultExpanded is false and a child node is selected, set expanded (triggers callback)
            // if not, set expanded state to this.props.defaultExpanded
            this.props.defaultExpanded === false && this.hasSelectedChild()
                ? this.setExpanded(true)
                : this.setState({ expanded: this.props.defaultExpanded });
            this.adjustNestedTreeItemCount(1);
        } else if (hadChildNodes && !hasChildNodes) {
            this.adjustNestedTreeItemCount(-1);
        }
    }

    public componentWillUnmount(): void {
        if (this.hasChildNodes()) {
            this.adjustNestedTreeItemCount(-1);
        }
    }

    public render(): React.ReactNode {
        return (
            <div
                {...this.unhandledProps()}
                role="treeitem"
                aria-expanded={this.state.expanded}
                aria-selected={!!this.props.selected}
                tabIndex={this.state.focusable ? 0 : -1}
                className={this.generateClassNames()}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
                ref={this.rootElement}
            >
                {this.renderItem()}
                {this.renderChildNodes()}
            </div>
        );
    }

    protected generateClassNames(): string {
        const {
            treeViewItem,
            treeViewItem__expanded,
            treeViewItem__nested,
            treeViewItem__selected,
        }: TreeViewItemClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                treeViewItem,
                [treeViewItem__expanded, this.state.expanded],
                [treeViewItem__nested, this.context.nested],
                [treeViewItem__selected, this.props.selected]
            )
        );
    }

    private renderItem(): React.ReactElement<HTMLDivElement> {
        const {
            treeViewItem_contentRegion,
            treeViewItem_innerContentRegion,
        }: TreeViewItemClassNameContract = this.props.managedClasses;

        const node: React.ReactElement<HTMLDivElement> = (
            <div
                className={classNames(treeViewItem_contentRegion)}
                onClick={this.handleContentContainerClick}
            >
                <div className={classNames(treeViewItem_innerContentRegion)}>
                    {this.renderExpandCollapseButton()}
                    {this.props.titleContent}
                </div>
            </div>
        );

        return typeof this.props.dragConnect === "function"
            ? this.props.dragConnect(node)
            : node;
    }

    private adjustNestedTreeItemCount(count: 1 | -1): void {
        if (typeof this.context.adjustNestedTreeItemCount === "function") {
            this.context.adjustNestedTreeItemCount(count);
        }
    }

    /**
     * Handles the focus event of the root element
     */
    private handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
        // Only change focusability if the event is on the node itself
        // and not a child node
        if (e.target === e.currentTarget) {
            this.setState({ focusable: true });

            // Notify the parent TreeView component that a new item has been focused,
            // and should tree this item as the last-focused item
            if (typeof this.context.setLastFocused === "function") {
                this.context.setLastFocused(this.rootElement);
            }
        }
    };

    /**
     * Handles the blur event on the root element
     */
    private handleBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
        // Ignore the event if the event happened on a child node
        if (!canUseDOM() || e.target !== e.currentTarget) {
            return;
        }

        this.setState({ focusable: false });
    };

    /**
     * handles the keydown event of the tree view item
     */
    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.target !== e.currentTarget) {
            return;
        }

        switch (e.keyCode) {
            case keyCodeArrowLeft:
                this.handleArrowLeft();
                break;
            case keyCodeArrowRight:
                this.handleArrowRight();
                break;
            case keyCodeArrowDown:
                // Prevent scrolling
                e.preventDefault();
                this.focusNextNode(1);
                break;
            case keyCodeArrowUp:
                // Prevent scrolling
                e.preventDefault();
                this.focusNextNode(-1);
                break;
            case keyCodeEnter:
                this.handleSelected(e);
                break;
            case keyCodeSpace:
                this.handleSpaceBar();
                break;
        }
    };

    /**
     * Determines if the item has sub-items and should be collapse/expandable
     */
    private hasChildNodes(props: TreeViewItemProps = this.props): boolean {
        return !!props.children;
    }

    /**
     * Determines if the item has sub-items which are selected
     */
    private hasSelectedChild(): boolean | void {
        const currentNode: HTMLElement = this.rootElement.current;

        if (!isHTMLElement(currentNode) || !canUseDOM()) {
            return null;
        }

        return !!currentNode.querySelector("[aria-selected='true'");
    }

    /**
     * Handles when the left arrow is pressed
     */
    private handleArrowLeft(): void {
        if (this.state.expanded) {
            this.setExpanded(false);
        } else if (
            canUseDOM() &&
            isHTMLElement(this.rootElement.current) &&
            isHTMLElement(this.rootElement.current.parentElement)
        ) {
            const parentElement: HTMLElement = this.rootElement.current.parentElement;

            if (isHTMLElement(parentElement)) {
                const parentNode: Element = parentElement.closest("[role='treeitem']");

                if (isHTMLElement(parentNode)) {
                    (parentNode as HTMLElement).focus();
                }
            }
        }
    }

    /**
     * Handles when the space bar is pressed
     */
    private handleSpaceBar(): void {
        if (typeof this.state.expanded !== "boolean") {
            return;
        }

        this.setExpanded(!this.state.expanded);
    }

    /**
     * Handles when the right arrow is pressed
     */
    private handleArrowRight(): void {
        if (typeof this.state.expanded !== "boolean") {
            return;
        }

        if (!this.state.expanded) {
            this.setExpanded(true);
        } else {
            this.focusNextNode(1);
        }
    }

    private focusNextNode(delta: number): void {
        if (!canUseDOM()) {
            return;
        }

        const visibleNodes: HTMLElement[] | void = this.getVisibleNodes();

        if (!visibleNodes) {
            return;
        }

        const currentIndex: number = visibleNodes.indexOf(this.rootElement.current);

        if (currentIndex !== -1) {
            const nextElement: HTMLElement = visibleNodes[currentIndex + delta];

            if (isHTMLElement(nextElement)) {
                nextElement.focus();
            }
        }
    }

    /**
     * Returns an array of all tree item nodes that are
     * currently visible (not hidden under a collapsed node)
     */
    private getVisibleNodes(): HTMLElement[] | void {
        return canUseDOM()
            ? getDisplayedNodes(this.getTreeRoot(), "[role='treeitem']")
            : [];
    }

    /**
     * Get the root element of the tree. This will always be the
     * closest element with [role='tree']
     */
    private getTreeRoot(): HTMLElement | null {
        const currentNode: HTMLElement = this.rootElement.current;

        if (!isHTMLElement(currentNode) || !canUseDOM()) {
            return null;
        }

        return currentNode.closest("[role='tree']") as HTMLElement;
    }

    private wrapChildOnSelected(
        childOnSelected?: (
            props: TreeViewItemProps,
            e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
        ) => void
    ): (
        props: TreeViewItemProps,
        e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => void {
        return (
            props: TreeViewItemProps,
            e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
        ): void => {
            if (childOnSelected) {
                childOnSelected(props, e);
            }
            this.setExpanded(true);
        };
    }

    private wrapChildOnExpandedChange(
        childOnExpandedChange: TreeViewItemHandledProps["onExpandedChange"]
    ): TreeViewItemHandledProps["onExpandedChange"] {
        return (childExpanded: boolean, childProps: TreeViewItemProps): void => {
            if (childOnExpandedChange) {
                childOnExpandedChange(childExpanded, childProps);
            }
            if (childExpanded) {
                this.setExpanded(true);
            }
        };
    }

    private renderChildNodes(): React.ReactNode {
        return this.hasChildNodes() ? (
            <div
                role="group"
                className={classNames(
                    this.props.managedClasses.treeViewItem_childNodeRegion
                )}
            >
                {React.Children.map(this.props.children, (child: React.ReactChild) => {
                    if (!React.isValidElement<TreeViewItemProps>(child) || !child.props) {
                        return child;
                    }
                    return React.cloneElement<TreeViewItemProps>(child, {
                        ...child.props,
                        onSelected: this.wrapChildOnSelected(child.props.onSelected),
                        onExpandedChange: this.wrapChildOnExpandedChange(
                            child.props.onExpandedChange
                        ),
                    });
                })}
            </div>
        ) : null;
    }

    private renderExpandCollapseButton(): React.ReactNode {
        const {
            treeViewItem_expandCollapseButton,
            treeViewItem_expandCollapseGlyph,
        }: TreeViewItemClassNameContract = this.props.managedClasses;

        return this.hasChildNodes() ? (
            // This really should render a button but Narrator sometimes still brings it focus
            // in scan-mode, so making this a div
            <div
                aria-hidden={true}
                className={classNames(treeViewItem_expandCollapseButton)}
                onClick={this.handleExpandCollapseButtonClick}
                ref={this.expandCollapseButton}
            >
                {typeof this.props.expandCollapseGlyph === "function"
                    ? this.props.expandCollapseGlyph(treeViewItem_expandCollapseGlyph)
                    : null}
            </div>
        ) : null;
    }

    /**
     * Sets the expanded state of the component if necessary and
     * notifies listeners of the state change.
     */
    private setExpanded(expanded: boolean): void {
        if (this.hasChildNodes()) {
            this.setState(
                {
                    expanded,
                },
                (): void => {
                    if (typeof this.props.onExpandedChange === "function") {
                        this.props.onExpandedChange(expanded, this.props);
                    }
                }
            );
        }
    }

    /**
     * Click handler for expand/collapse button
     */
    private handleExpandCollapseButtonClick = (): void => {
        this.setExpanded(!this.state.expanded);
    };

    /**
     * Call the onSelected callback if it exists
     */
    private handleSelected = (
        e?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void => {
        if (typeof this.props.onSelected === "function") {
            this.props.onSelected(this.props, e);
        }
    };

    /**
     * Handles the click event of the tree view item, except for the expand/collapse button
     */
    private handleContentContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const expandButton: HTMLElement | null = this.expandCollapseButton.current;
        if (
            !isHTMLElement(expandButton) ||
            (isHTMLElement(expandButton) && expandButton !== e.target)
        ) {
            this.handleSelected(e);
        }
    };
}

export default TreeViewItem;
export * from "./tree-view-item.props";
export { TreeViewItemClassNameContract };
