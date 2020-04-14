import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { TreeViewItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { TreeViewItem as BaseTreeViewItem } from "@microsoft/fast-components-react-base";
import { DisplayNamePrefix } from "../utilities";
import {
    TreeViewItemHandledProps,
    TreeViewItemProps,
    TreeViewItemUnhandledProps,
} from "./tree-view-item.props";

class TreeViewItem extends Foundation<
    TreeViewItemHandledProps,
    TreeViewItemUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}TreeViewItem`;

    public static defaultProps: Partial<TreeViewItemProps> = {
        managedClasses: {},
    };

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
        beforeContent: void 0,
        afterContent: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactNode {
        return (
            <BaseTreeViewItem
                {...this.unhandledProps()}
                titleContent={this.generateTitleContent()}
                dragConnect={this.props.dragConnect}
                expandCollapseGlyph={this.generateExpandCollapseGlyph()}
                managedClasses={this.props.managedClasses}
                selected={this.props.selected}
                defaultExpanded={this.props.defaultExpanded}
                onSelected={this.props.onSelected}
            >
                {this.props.children}
            </BaseTreeViewItem>
        );
    }

    private generateTitleContent(): React.ReactNode {
        return (
            <React.Fragment>
                {this.generateBeforeContent()}
                {this.props.titleContent}
                {this.generateAfterContent()}
            </React.Fragment>
        );
    }

    private generateAfterContent(): React.ReactNode {
        if (typeof this.props.afterContent === "function") {
            return this.props.afterContent(
                this.props.managedClasses.treeViewItem_afterContent
            );
        }
    }

    private generateBeforeContent(): React.ReactNode {
        if (typeof this.props.beforeContent === "function") {
            return this.props.beforeContent(
                this.props.managedClasses.treeViewItem_beforeContent
            );
        }
    }

    private generateExpandCollapseGlyph(): (className?: string) => React.ReactNode {
        const {
            treeViewItem_expandCollapseGlyph,
        }: Partial<TreeViewItemClassNameContract> = this.props.managedClasses;
        return (): React.ReactNode => {
            if (typeof this.props.expandCollapseGlyph === "function") {
                return this.props.expandCollapseGlyph(treeViewItem_expandCollapseGlyph);
            } else {
                return this.generateDefaultExpandCollapseGlyph(
                    treeViewItem_expandCollapseGlyph
                );
            }
        };
    }

    private generateDefaultExpandCollapseGlyph: (
        className?: string
    ) => React.ReactNode = (className?: string): React.ReactNode => {
        return (
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <path d="M4.29 12L12 4.29V12H4.29z" />
            </svg>
        );
    };
}

export default TreeViewItem;
export * from "./tree-view-item.props";
