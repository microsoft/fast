import * as React from "react";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import {
    NavigationHandledProps,
    NavigationProps,
    NavigationState,
    NavigationUnhandledProps,
    TreeNavigation,
} from "./navigation.props";
import { getNavigationFromData } from "./navigation.utilities";

export default class Navigation extends Foundation<
    NavigationHandledProps,
    NavigationUnhandledProps,
    NavigationState
> {
    public static displayName: string = "Navigation";

    protected handledProps: HandledProps<NavigationHandledProps> = {
        schema: void 0,
        data: void 0,
        childOptions: void 0,
        onLocationUpdate: void 0,
        managedClasses: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement>;

    constructor(props: NavigationProps) {
        super(props);

        this.state = {
            navigation: getNavigationFromData(
                this.props.data,
                this.props.schema,
                this.props.childOptions
            ),
            openItems: [],
            activeItem: null,
        };

        this.rootElement = React.createRef();
    }

    public render(): React.ReactNode {
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                role={"tree"}
                className={this.props.managedClasses.navigation}
            >
                {this.renderTreeItem(this.state.navigation, 1, 1, 1, 0)}
            </div>
        );
    }

    /**
     * Renders the tree item containing element
     */
    private renderTreeItemContainer(
        navigation: TreeNavigation[],
        level: number
    ): React.ReactNode {
        return (
            <div className={this.props.managedClasses.navigation_itemList} role={"group"}>
                {this.renderTreeItems(navigation, level + 1)}
            </div>
        );
    }

    private renderTreeItem(
        navigation: TreeNavigation,
        level: number,
        navigationLength: number,
        positionInNavigation: number,
        index: number
    ): React.ReactNode {
        if (Array.isArray(navigation.items)) {
            return (
                <div
                    className={this.props.managedClasses.navigation_item}
                    key={index}
                    role={"treeitem"}
                    aria-level={level}
                    aria-setsize={navigationLength}
                    aria-posinset={positionInNavigation}
                    aria-expanded={this.isExpanded(navigation.dataLocation)}
                    onClick={this.handleTreeItemClick(navigation.dataLocation)}
                    onKeyUp={this.handleTreeItemKeyUp(navigation.dataLocation)}
                >
                    <span
                        className={this.getTriggerClassNames(navigation.dataLocation)}
                        onClick={this.handleTreeItemClick(navigation.dataLocation)}
                        onKeyUp={this.handleTreeItemKeyUp(navigation.dataLocation)}
                        tabIndex={0}
                        data-location={navigation.dataLocation}
                    >
                        {navigation.text}
                    </span>
                    {this.renderTreeItemContainer(navigation.items, level)}
                </div>
            );
        }

        return (
            <div
                className={this.props.managedClasses.navigation_item}
                key={index}
                role={"none"}
            >
                <a
                    className={this.getLinkClassNames(navigation.dataLocation)}
                    role={"treeitem"}
                    data-location={navigation.dataLocation}
                    aria-level={level}
                    aria-setsize={navigationLength}
                    aria-posinset={positionInNavigation}
                    href={"#"}
                    onClick={this.handleTreeItemClick(navigation.dataLocation)}
                    onKeyUp={this.handleTreeItemKeyUp(navigation.dataLocation)}
                    tabIndex={0}
                >
                    {navigation.text}
                </a>
            </div>
        );
    }

    /**
     * Renders tree items
     */
    private renderTreeItems(
        navigation: TreeNavigation[],
        level: number
    ): React.ReactNode {
        return navigation.map((navigationItem: TreeNavigation, index: number) => {
            const navigationLength: number = navigation.length;
            const positionInNavigation: number = index + 1;

            return this.renderTreeItem(
                navigationItem,
                level,
                navigationLength,
                positionInNavigation,
                index
            );
        });
    }

    private findCurrentTreeItemIndex(nodes: HTMLElement[], dataLocation: string): number {
        return nodes.findIndex((node: HTMLElement) => {
            return node.dataset.location === dataLocation;
        });
    }

    private focusNextTreeItem(dataLocation: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dataLocation
            );
            const nextIndex: number =
                currentIndex !== -1 && currentIndex !== nodes.length - 1
                    ? currentIndex + 1
                    : nodes.length - 1;
            nodes[nextIndex].focus();
        }
    }

    private focusPreviousTreeItem(dataLocation: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dataLocation
            );
            const previousIndex: number =
                currentIndex !== -1 && currentIndex !== 0 ? currentIndex - 1 : 0;
            nodes[previousIndex].focus();
        }
    }

    private focusFirstTreeItem(): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();

            nodes[0].focus();
        }
    }

    private focusLastTreeItem(): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();

            nodes[nodes.length - 1].focus();
        }
    }

    private focusAndOpenTreeItems(dataLocation: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dataLocation
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.attributes["aria-expanded"].value'
            );

            if (ariaExpanded === "true" && nodes[currentIndex + 1]) {
                nodes[currentIndex + 1].focus();
            } else if (ariaExpanded === "false") {
                this.toggleItems(dataLocation);
            }
        }
    }

    private focusAndCloseTreeItems(dataLocation: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dataLocation
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.attributes["aria-expanded"].value'
            );

            if (
                ariaExpanded === "false" &&
                nodes[currentIndex - 1] &&
                (nodes[currentIndex - 1] === nodes[currentIndex].parentElement ||
                    nodes[currentIndex - 1].parentElement ===
                        get(
                            nodes[currentIndex],
                            "parentElement.parentElement.parentElement"
                        ))
            ) {
                nodes[currentIndex - 1].focus();
            } else if (ariaExpanded === "true") {
                this.toggleItems(dataLocation);
            } else if (ariaExpanded === undefined && nodes[currentIndex - 1]) {
                nodes[currentIndex - 1].focus();
            }
        }
    }

    private getLinkClassNames(dataLocation: string): string {
        let classes: string = get(this.props, "managedClasses.navigation_itemLink", "");

        if (dataLocation === this.state.activeItem) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.navigation_itemLink__active",
                ""
            )}`;
        }

        return classes;
    }

    private getTriggerClassNames(dataLocation: string): string {
        let classes: string = this.props.managedClasses.navigation_itemExpandListTrigger;

        if (dataLocation === this.state.activeItem) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.navigation_itemExpandListTrigger__active",
                ""
            )}`;
        }

        return classes;
    }

    private getTreeItemNodes(): HTMLElement[] {
        const nodes: HTMLElement[] = Array.from(
            this.rootElement.current.querySelectorAll(
                "a[role='treeitem'], div[role='treeitem'] > span"
            )
        );
        return nodes.filter((node: HTMLElement) => node.offsetParent !== null);
    }

    /**
     * Handles key up on a tree item
     */
    private handleTreeItemKeyUp = (
        dataLocation: string
    ): ((e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>) => void) => {
        return (e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                switch (e.keyCode) {
                    case KeyCodes.enter:
                    case KeyCodes.space:
                        if (e.target === e.currentTarget) {
                            this.toggleItems(dataLocation);
                        }
                        break;
                    case KeyCodes.arrowDown:
                        this.focusNextTreeItem(dataLocation);
                        break;
                    case KeyCodes.arrowUp:
                        this.focusPreviousTreeItem(dataLocation);
                        break;
                    case KeyCodes.arrowRight:
                        this.focusAndOpenTreeItems(dataLocation);
                        break;
                    case KeyCodes.arrowLeft:
                        this.focusAndCloseTreeItems(dataLocation);
                        break;
                    case KeyCodes.home:
                        this.focusFirstTreeItem();
                        break;
                    case KeyCodes.end:
                        this.focusLastTreeItem();
                        break;
                    default:
                        break;
                }
            }
        };
    };

    /**
     * Handles clicking on a tree item
     */
    private handleTreeItemClick = (
        dataLocation: string
    ): ((e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void) => {
        return (e: React.MouseEvent<HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                this.toggleItems(dataLocation);
            }
        };
    };

    /**
     * Toggles the items by adding/removing them from the openItems array
     */
    private toggleItems(dataLocation: string): void {
        const isExpanded: boolean = this.isExpanded(dataLocation);

        if (!isExpanded) {
            this.setState({
                openItems: this.state.openItems.concat(dataLocation),
                activeItem: dataLocation,
            });
        } else {
            const updatedOpenItems: string[] = this.state.openItems.filter(
                (openItem: string) => {
                    return openItem.slice(0, dataLocation.length) !== dataLocation;
                }
            );

            this.setState({
                openItems: updatedOpenItems,
                activeItem: dataLocation,
            });
        }

        if (typeof this.props.onLocationUpdate === "function") {
            this.props.onLocationUpdate(dataLocation);
        }
    }

    /**
     * Determines if the tree item should be expanded
     */
    private isExpanded(dataLocation: string): boolean {
        if (
            this.state.openItems.find(
                (openItem: string) =>
                    openItem.slice(0, dataLocation.length) === dataLocation
            ) !== undefined
        ) {
            return true;
        }

        return false;
    }
}
