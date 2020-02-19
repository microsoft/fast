import { ToolbarItemGroupClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames } from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    ToolbarItemGroupHandledProps,
    ToolbarItemGroupProps,
    ToolbarItemGroupUnhandledProps,
} from "./toolbar-item-group.props";
import Tabbable from "tabbable";
import { isNil } from "lodash-es";
import Toolbar from "../toolbar";

export interface ToolbarItemGroupState {
    /**
     *
     */
    validWidgetIndexes: number[] | null;
}

class ToolbarItemGroup extends Foundation<
    ToolbarItemGroupHandledProps,
    ToolbarItemGroupUnhandledProps,
    ToolbarItemGroupState
> {
    public static displayName: string = `${DisplayNamePrefix}ToolbarItemGroup`;

    public static defaultProps: Partial<ToolbarItemGroupProps> = {
        itemPath: [],
        currentFocusPath: "",
        managedClasses: {},
    };

    protected handledProps: HandledProps<ToolbarItemGroupHandledProps> = {
        itemPath: void 0,
        currentFocusPath: void 0,
        managedClasses: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: ToolbarItemGroupProps) {
        super(props);
        this.state = {
            validWidgetIndexes: null,
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
        this.updateValidWidgets();
    }

    public componentDidUpdate(prevProps: ToolbarItemGroupProps): void {
        if (prevProps !== this.props) {
            this.setState({
                validWidgetIndexes: null,
            });
            return;
        }
        if (this.state.validWidgetIndexes === null) {
            this.updateValidWidgets();
        }
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(
            classNames(this.props.managedClasses.toolbarItemGroup)
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
        const thisItemPath = this.props.itemPath.slice(0);
        thisItemPath.push(index);
        const itemPathAsString: string = thisItemPath.toString();

        if (child.type === ToolbarItemGroup) {
            const groupProps: object = {
                currentFocusPath: this.props.currentFocusPath,
                itemPath: thisItemPath,
            };

            groupProps[Toolbar.toolbarItemGroupAttributeName] = itemPathAsString;
            return React.cloneElement(child, groupProps);
        }

        const isValidWidgetIndex: boolean =
            isNil(this.state.validWidgetIndexes) ||
            this.state.validWidgetIndexes.includes(index);

        const itemProps: object = {
            tabIndex: isValidWidgetIndex
                ? this.props.currentFocusPath === itemPathAsString
                    ? 0
                    : -1
                : null,
        };
        itemProps[Toolbar.toolbarItemAttributeName] = isValidWidgetIndex
            ? itemPathAsString
            : null;

        return React.cloneElement(child, itemProps);
    };

    /**
     *
     */
    private updateValidWidgets = (): void => {
        const domChildren: Element[] = this.domChildren();
        const validWidgetIndexes = [];
        domChildren.forEach((element: HTMLElement, index: number) => {
            if (Tabbable.isFocusable(element)) {
                validWidgetIndexes.push(index);
            }
        });
        this.setState({
            validWidgetIndexes: validWidgetIndexes,
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

export default ToolbarItemGroup;
export * from "./toolbar-item-group.props";
export { ToolbarItemGroupClassNameContract };
