import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    classNames,
    getDisplayedNodes,
    isHTMLElement,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import { DisplayNamePrefix } from "../utilities";
import {
    TreeViewClassNameContract,
    TreeViewHandledProps,
    TreeViewProps,
    TreeViewUnhandledProps,
} from "./tree-view.props";

interface TreeViewState {
    /**
     * Track if the tree view itself is focusable. It should
     * only be focusable if no items in the tree-view are focusable
     */
    focusable: boolean;

    /**
     * A react reference to the child node that was most previously focused.
     * Tracking this allows us to easily determine which item the tree should re-focus
     * when focus is brought back to the tree
     */
    lastFocused: React.RefObject<HTMLElement> | null;

    /**
     * Track if the tree has nested tree-view-item nodes
     */
    nested: boolean;
}

export interface TreeViewContextValue {
    /**
     * Callback to assign the last-focused item of the TreeView
     */
    setLastFocused: (ref: React.RefObject<HTMLElement>) => void;

    /**
     * Callback to adjust the nested tree item counter
     */
    adjustNestedTreeItemCount: (delta: 1 | -1) => void;

    /**
     * informs consumers the tree is nested
     */
    nested: boolean;
}

export const TreeViewContext: React.Context<TreeViewContextValue> = React.createContext<
    TreeViewContextValue
>({
    setLastFocused: null,
    adjustNestedTreeItemCount: null,
    nested: false,
});

/**
 * Simple state machine to track how many nodes have nested nodes
 */
class ChildNodeCountTracker {
    private _count: number = 0;
    public get count(): number {
        return this._count;
    }

    public adjust(delta: number): void {
        this._count += delta;
    }
}

class TreeView extends Foundation<
    TreeViewHandledProps,
    TreeViewUnhandledProps,
    TreeViewState
> {
    public static displayName: string = `${DisplayNamePrefix}TreeView`;

    public static defaultProps: Partial<TreeViewProps> = {
        managedClasses: {},
    };

    protected handledProps: HandledProps<TreeViewHandledProps> = {
        managedClasses: void 0,
        children: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Track how many tree-items have children
     */
    private nestedTreeItemTracker: ChildNodeCountTracker = new ChildNodeCountTracker();

    constructor(props: TreeViewProps) {
        super(props);

        this.state = {
            focusable: true,
            lastFocused: null,
            nested: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div
                {...this.unhandledProps()}
                role="tree"
                tabIndex={this.state.focusable ? 0 : -1}
                className={this.generateClassNames()}
                ref={this.rootElement}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
            >
                <TreeViewContext.Provider
                    value={{
                        setLastFocused: this.setLastFocused,
                        adjustNestedTreeItemCount: this.adjustNestedTreeItemCount,
                        nested: this.state.nested,
                    }}
                >
                    {this.props.children}
                </TreeViewContext.Provider>
            </div>
        );
    }

    public componentDidUpdate(): void {
        this.ensureFocusability();
    }

    protected generateClassNames(): string {
        return super.generateClassNames(classNames(this.props.managedClasses.treeView));
    }

    private setLastFocused = (ref: React.RefObject<HTMLElement>): void => {
        this.setState({
            lastFocused: ref,
        });
    };

    private adjustNestedTreeItemCount = (delta: 1 | -1): void => {
        this.nestedTreeItemTracker.adjust(delta);

        if (this.nestedTreeItemTracker.count > 0 && !this.state.nested) {
            this.setState({ nested: true });
        } else if (this.nestedTreeItemTracker.count === 0 && this.state.nested) {
            this.setState({ nested: false });
        }
    };

    private handleBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
        const root: HTMLDivElement | null = this.rootElement.current;

        /**
         * If we focus outside of the tree
         */
        if (isHTMLElement(root) && !root.contains(e.relatedTarget as HTMLElement)) {
            this.setState({
                focusable: true,
            });
        }
    };

    private handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
        if (!canUseDOM() || !isHTMLElement(this.rootElement.current)) {
            return;
        }

        const root: HTMLElement | null = this.rootElement.current;
        const lastFocused: { current: HTMLElement | null } | null = this.state
            .lastFocused;

        /**
         * If the tree view is receiving focus
         */
        if (isHTMLElement(root) && root === e.target) {
            // If we have a last focused item, focus it - otherwise check for an initially selected item or focus the first "[role='treeitem']"
            // If there is no "[role='treeitem']" to be focused AND no last-focused, then there are likely no children
            // or children are malformed so keep the tree in the tab-order in the hopes that the author cleans up
            // the children
            const selectedChild: HTMLElement | null = root.querySelector(
                "[aria-selected='true']"
            );

            const toBeFocused: HTMLElement | null = lastFocused
                ? lastFocused.current
                : selectedChild
                ? selectedChild
                : root.querySelector("[role='treeitem']");

            if (isHTMLElement(toBeFocused)) {
                toBeFocused.focus();

                if (this.state.focusable) {
                    this.setState({ focusable: false });
                }
            }
        } else {
            // A child is receiving focus. While focus is within the tree, we simply need to ensure
            // that the tree is not focusable.
            if (this.state.focusable) {
                this.setState({
                    focusable: false,
                });
            }
        }
    };

    /**
     * Verifies that the tree has a focusable child.
     * If it does not, the tree will begin to accept focus
     */
    private ensureFocusability(): void {
        if (
            canUseDOM() &&
            !this.state.focusable &&
            isHTMLElement(this.rootElement.current)
        ) {
            const focusableChild: HTMLElement | null = this.rootElement.current.querySelector(
                "[role='treeitem'][tabindex='0']"
            );

            if (!isHTMLElement(focusableChild)) {
                this.setState({
                    focusable: true,
                });
            }
        }
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        let nodes: HTMLElement[] | void;

        if (canUseDOM()) {
            switch (e.keyCode) {
                case keyCodeHome:
                    nodes = this.getVisibleNodes();

                    if (nodes && nodes.length) {
                        nodes[0].focus();
                    }

                    break;
                case keyCodeEnd:
                    nodes = this.getVisibleNodes();

                    if (nodes && nodes.length) {
                        nodes[nodes.length - 1].focus();
                    }

                    break;
            }
        }
    };

    private getVisibleNodes(): HTMLElement[] | void {
        return canUseDOM()
            ? getDisplayedNodes(this.rootElement.current, "[role='treeitem']")
            : [];
    }
}

export default TreeView;
export * from "./tree-view.props";
export { TreeViewClassNameContract };
