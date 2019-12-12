import React from "react";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeEnter,
    keyCodeHome,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import { cloneDeep, get, set, unset } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import {
    NavigationDataType,
    NavigationHandledProps,
    NavigationProps,
    NavigationState,
    TreeNavigation,
} from "./navigation.props";
import { getNavigationFromData, getUpdatedData } from "./navigation.utilities";
import { getDataWithDuplicate } from "../data-utilities/duplicate";
import { isInArray } from "../data-utilities/array";
import { DraggableNavigationTreeItem, NavigationTreeItem } from "./navigation-tree-item";
import {
    NavigationTreeItemProps,
    VerticalDragDirection,
} from "./navigation-tree-item.props";
import { normalizeDataLocationToDotNotation } from "../data-utilities/location";

export default class Navigation extends Foundation<
    NavigationHandledProps,
    {},
    NavigationState
> {
    public static displayName: string = "Navigation";

    public static getDerivedStateFromProps(
        props: NavigationProps,
        state: NavigationState
    ): Partial<NavigationState> {
        const updatedState: Partial<NavigationState> = {};
        const updatedNavigation: TreeNavigation = getNavigationFromData(
            props.data,
            props.schema,
            props.childOptions
        );

        if (props.dataLocation !== state.activeItem && props.dataLocation !== undefined) {
            updatedState.activeItem = props.dataLocation;

            // openItems is cast as any due to missing type on string array
            if (
                typeof props.dataLocation === "string" &&
                !(state.openItems as any).includes(props.dataLocation)
            ) {
                updatedState.openItems = state.openItems;
                updatedState.openItems.push(props.dataLocation);
            }
        }

        if (updatedNavigation !== state.navigation) {
            updatedState.navigation = updatedNavigation;
        }

        return updatedState;
    }

    protected handledProps: HandledProps<NavigationHandledProps> = {
        schema: void 0,
        data: void 0,
        dragAndDropReordering: void 0,
        childOptions: void 0,
        onChange: void 0,
        onLocationUpdate: void 0,
        dataLocation: void 0,
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
            openItems:
                this.props.dataLocation !== undefined ? [this.props.dataLocation] : [],
            activeItem:
                this.props.dataLocation !== undefined ? this.props.dataLocation : null,
            dragHoverDataLocation: null,
            dragHoverAfterDataLocation: null,
            dragHoverBeforeDataLocation: null,
            dragHoverCenterDataLocation: null,
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
                {this.renderTreeItem(this.state.navigation, 1, 1, 0)}
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

    /**
     * Renders a tree item
     */
    private renderTreeItem(
        navigation: TreeNavigation,
        level: number,
        navigationLength: number,
        index: number
    ): React.ReactNode {
        const dataLocation: string = navigation.dataLocation;
        const dataType: NavigationDataType = navigation.type;
        const isRootDataLocation: boolean = dataLocation === "";
        const props: NavigationTreeItemProps = {
            className: this.getItemClassName(dataType),
            contentClassName: this.getItemContentClassName(dataLocation),
            expandTriggerClassName: this.getItemExpandTriggerClassName(),
            getContentDragHoverClassName: this.getItemContentDragHoverClassName,
            dataLocation,
            dragHover:
                !isRootDataLocation && dataLocation === this.state.dragHoverDataLocation,
            dragHoverBefore:
                !isRootDataLocation &&
                dataLocation === this.state.dragHoverBeforeDataLocation,
            dragHoverAfter:
                !isRootDataLocation &&
                dataLocation === this.state.dragHoverAfterDataLocation,
            expanded: this.isExpanded(dataLocation),
            handleClick: this.handleTreeItemClick(dataLocation, dataType),
            handleKeyDown: this.handleTreeItemKeyDown(dataLocation, dataType),
            handleSelectionClick: this.handleTreeItemSelectionClick(dataLocation),
            handleCloseDraggingItem: this.handleCloseDraggingTreeItem,
            text: navigation.text,
            type: dataType,
            onChange: this.handleChange,
            onDragHover: this.handleDragHover,
        };
        const children: React.ReactNode =
            Array.isArray(navigation.items) && navigationLength > 0
                ? this.renderTreeItemContainer(navigation.items, level)
                : void 0;

        // Directly nest React children which use the "children" property
        if (dataLocation === "children" || dataLocation.endsWith("props.children")) {
            if (Array.isArray(navigation.items) && navigationLength > 0) {
                return this.renderTreeItems(navigation.items, level + 1);
            }
        }

        if (this.props.dragAndDropReordering) {
            return (
                <DraggableNavigationTreeItem {...props} key={index}>
                    {children}
                </DraggableNavigationTreeItem>
            );
        }

        return (
            <NavigationTreeItem {...props} key={index}>
                {children}
            </NavigationTreeItem>
        );
    }

    /**
     * Handles a data update from dragging
     */
    private handleChange = (
        sourceDataLocation: string,
        targetDataLocation: string,
        type: NavigationDataType,
        direction?: VerticalDragDirection
    ): void => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(
                getUpdatedData({
                    targetDataLocation,
                    sourceDataLocation,
                    direction,
                    type,
                    data: this.props.data,
                })
            );
        }
    };

    /**
     * Handles the hovering of an element when dragging
     */
    private handleDragHover = (
        dragHoverDataLocation: string,
        direction?: VerticalDragDirection
    ): void => {
        const state: Partial<NavigationState> = {
            dragHoverDataLocation,
            dragHoverBeforeDataLocation:
                direction === VerticalDragDirection.up ? dragHoverDataLocation : null,
            dragHoverAfterDataLocation:
                direction === VerticalDragDirection.down ? dragHoverDataLocation : null,
            dragHoverCenterDataLocation:
                direction === VerticalDragDirection.center ? dragHoverDataLocation : null,
        };

        if (
            this.state.dragHoverDataLocation !== state.dragHoverDataLocation ||
            this.state.dragHoverAfterDataLocation !== state.dragHoverAfterDataLocation ||
            this.state.dragHoverBeforeDataLocation !==
                state.dragHoverBeforeDataLocation ||
            this.state.dragHoverCenterDataLocation !== state.dragHoverCenterDataLocation
        ) {
            this.setState(state as NavigationState);
        }
    };

    /**
     * Renders tree items
     */
    private renderTreeItems(
        navigation: TreeNavigation[],
        level: number
    ): React.ReactNode {
        // Sort items so that childrenItems are weighted towards the top
        const sortedNavigation: TreeNavigation[] = navigation.sort(
            (a: TreeNavigation, b: TreeNavigation) => {
                return a.type === NavigationDataType.children &&
                    b.type === NavigationDataType.children
                    ? 0
                    : a.type === NavigationDataType.children
                        ? 1
                        : b.type !== NavigationDataType.children
                            ? 0
                            : -1;
            }
        );

        return sortedNavigation.map((navigationItem: TreeNavigation, index: number) => {
            const navigationLength: number = navigation.length;

            return this.renderTreeItem(navigationItem, level, navigationLength, index);
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

    private focusAndOpenTreeItems(dataLocation: string, type: NavigationDataType): void {
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
                this.toggleItems(dataLocation, type);
            }
        }
    }

    private focusAndCloseTreeItems(dataLocation: string, type: NavigationDataType): void {
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
                this.toggleItems(dataLocation, type);
            } else if (ariaExpanded === undefined && nodes[currentIndex - 1]) {
                nodes[currentIndex - 1].focus();
            }
        }
    }

    private getItemClassName(
        dataType: NavigationDataType
    ): (dragging: boolean) => string {
        return (dragging: boolean): string => {
            let classes: string = this.props.managedClasses.navigation_item;

            if (
                dataType === NavigationDataType.component ||
                dataType === NavigationDataType.primitiveChild
            ) {
                classes = `${classes} ${get(
                    this.props,
                    `managedClasses.navigation_item__${dataType}`,
                    ""
                )}`;

                if (this.props.dragAndDropReordering) {
                    classes = `${classes} ${get(
                        this.props,
                        "managedClasses.navigation_item__draggable",
                        ""
                    )}`;

                    if (dragging) {
                        classes = `${classes} ${get(
                            this.props,
                            "managedClasses.navigation_item__dragging",
                            ""
                        )}`;
                    }
                }
            }

            return classes;
        };
    }

    private getItemExpandTriggerClassName(): string {
        return get(this.props, "managedClasses.navigation_itemExpandTrigger", "");
    }

    private getItemContentClassName(dataLocation: string): string {
        let classes: string = this.props.managedClasses.navigation_itemContent;

        if (dataLocation === this.state.activeItem) {
            classes = `${classes} ${get(
                this.props,
                "managedClasses.navigation_itemContent__active",
                ""
            )}`;
        }

        return classes;
    }

    private getItemContentDragHoverClassName = (
        type: NavigationDataType,
        verticalDragDirection?: VerticalDragDirection
    ): string => {
        let classNames: string = "";

        if (
            verticalDragDirection === VerticalDragDirection.center &&
            (type === NavigationDataType.children ||
                type === NavigationDataType.component ||
                type === NavigationDataType.primitiveChild)
        ) {
            classNames += `${get(
                this.props,
                "managedClasses.navigation_itemContent__dragHover",
                ""
            )}`;
        } else if (
            typeof verticalDragDirection !== "undefined" &&
            verticalDragDirection !== VerticalDragDirection.center
        ) {
            classNames += ` ${
                verticalDragDirection === VerticalDragDirection.up
                    ? this.getItemContentDragHoverBeforeClassName()
                    : this.getItemContentDragHoverAfterClassName()
            }`;
        }

        return classNames;
    };

    private getItemContentDragHoverBeforeClassName = (): string => {
        return `${get(
            this.props,
            "managedClasses.navigation_itemContent__dragHoverBefore",
            ""
        )}`;
    };

    private getItemContentDragHoverAfterClassName = (): string => {
        return `${get(
            this.props,
            "managedClasses.navigation_itemContent__dragHoverAfter",
            ""
        )}`;
    };

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
    private handleTreeItemKeyDown = (
        dataLocation: string,
        type: NavigationDataType
    ): ((e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>) => void) => {
        return (e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                switch (e.keyCode) {
                    case keyCodeEnter:
                    case keyCodeSpace:
                        if (e.target === e.currentTarget) {
                            this.toggleItems(dataLocation, type);
                        }
                        break;
                    case keyCodeArrowDown:
                        this.focusNextTreeItem(dataLocation);
                        break;
                    case keyCodeArrowUp:
                        this.focusPreviousTreeItem(dataLocation);
                        break;
                    case keyCodeArrowRight:
                        this.focusAndOpenTreeItems(dataLocation, type);
                        break;
                    case keyCodeArrowLeft:
                        this.focusAndCloseTreeItems(dataLocation, type);
                        break;
                    case keyCodeHome:
                        this.focusFirstTreeItem();
                        break;
                    case keyCodeEnd:
                        this.focusLastTreeItem();
                        break;

                    default:
                        if (e.key.toLowerCase() === "d" && e.ctrlKey) {
                            e.preventDefault();
                            this.duplicateCurrentItem(dataLocation, type);
                        }
                        break;
                }
            }
        };
    };

    /**
     * Handles clicking on a tree item
     */
    private handleTreeItemClick = (
        dataLocation: string,
        type: NavigationDataType
    ): ((e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void) => {
        return (e: React.MouseEvent<HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                this.toggleItems(dataLocation, type);
            }
        };
    };

    private handleTreeItemSelectionClick = (
        dataLocation: string
    ): ((e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void) => {
        return (e: React.MouseEvent<HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                this.selectItem(dataLocation);
            }
        };
    };

    private handleCloseDraggingTreeItem = (
        dataLocation: string,
        type: NavigationDataType
    ): void => {
        const updatedState: Partial<NavigationState> = {};

        updatedState.openItems = this.state.openItems.filter((openItem: string) => {
            return openItem.slice(0, dataLocation.length) !== dataLocation;
        });

        this.setState(updatedState as NavigationState);

        if (
            typeof this.props.onLocationUpdate === "function" &&
            type !== NavigationDataType.children
        ) {
            this.props.onLocationUpdate(dataLocation);
        }
    };

    /**
     * Toggles the items by adding/removing them from the openItems array
     */
    private toggleItems(dataLocation: string, type: NavigationDataType): void {
        const isExpanded: boolean = this.isExpanded(dataLocation);
        const updatedState: Partial<NavigationState> = {};

        if (!isExpanded) {
            updatedState.openItems = this.state.openItems.concat(dataLocation);
        } else {
            updatedState.openItems = this.state.openItems.filter((openItem: string) => {
                return openItem.slice(0, dataLocation.length) !== dataLocation;
            });
        }

        if (this.props.dataLocation === undefined) {
            updatedState.activeItem = dataLocation;
        }

        this.setState(updatedState as NavigationState);

        if (
            typeof this.props.onLocationUpdate === "function" &&
            type !== NavigationDataType.children
        ) {
            this.props.onLocationUpdate(dataLocation);
        }
    }

    private selectItem(dataLocation: string): void {
        this.setState({
            activeItem: dataLocation,
        });

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

    /**
     * Duplicates the item
     */
    private duplicateCurrentItem = (
        dataLocation: string,
        type: NavigationDataType
    ): void => {
        if (
            type !== NavigationDataType.component &&
            type !== NavigationDataType.primitiveChild
        ) {
            return;
        }

        if (typeof this.props.onChange === "function") {
            const isPrimitive: boolean = type === NavigationDataType.primitiveChild;
            const dataLocationAsDotNotation: string = normalizeDataLocationToDotNotation(
                dataLocation
            );
            const dataLocationSegments: string[] = dataLocationAsDotNotation.split(".");
            dataLocationSegments.pop();
            // The root data location ensures that if the data location includes ".props" as part
            // of its path, this is ignored so that a full component object is copied
            const rootDataLocation: string = isInArray(
                this.props.data,
                dataLocationAsDotNotation.endsWith("props")
                    ? dataLocationSegments.join(".")
                    : dataLocationAsDotNotation
            )
                ? dataLocationSegments.join(".")
                : isPrimitive
                    ? `${dataLocationAsDotNotation}[0]`
                    : `${dataLocationSegments.join(".")}[0]`;

            this.props.onChange(
                getDataWithDuplicate(
                    isPrimitive ? dataLocation : rootDataLocation,
                    this.props.data
                ),
                rootDataLocation
            );
        }
    };
}
