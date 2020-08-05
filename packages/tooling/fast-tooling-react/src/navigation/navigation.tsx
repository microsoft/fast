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
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import {
    HoverLocation,
    NavigationHandledProps,
    NavigationProps,
    NavigationState,
} from "./navigation.props";
import { DraggableNavigationTreeItem } from "./navigation-tree-item";
import { DragDropItemType } from "./navigation-tree-item.props";
import {
    dictionaryLink,
    LinkedData,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    Register,
    TreeNavigationItem,
    getLinkedData,
} from "@microsoft/fast-tooling";
import manageJss, { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import styles, { NavigationClassNameContract } from "./navigation.style";

class Navigation extends Foundation<
    NavigationHandledProps & ManagedClasses<NavigationClassNameContract>,
    {},
    NavigationState
> {
    public static displayName: string = "Navigation";

    public static defaultProps: NavigationHandledProps &
        ManagedClasses<NavigationClassNameContract> = {
        managedClasses: {},
        messageSystem: void 0,
    };

    protected handledProps: HandledProps<NavigationHandledProps> = {
        messageSystem: void 0,
    };

    private messageSystemConfig: Register;

    private rootElement: React.RefObject<HTMLDivElement>;

    constructor(props: NavigationProps) {
        super(props);

        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
        };

        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
        }

        this.state = {
            navigationDictionary: null,
            dataDictionary: null,
            activeItem: null,
            expandedNavigationConfigItems: {},
            linkedData: void 0,
            linkedDataLocation: null,
            hoveredItem: null,
        };

        this.rootElement = React.createRef();
    }

    public render(): React.ReactNode {
        return (
            <div
                ref={this.rootElement}
                role={"tree"}
                className={this.props.managedClasses.navigation}
            >
                <div
                    role={"treeitem"}
                    className={this.props.managedClasses.navigation_item}
                    aria-expanded={this.getExpandedState()}
                >
                    {this.renderDictionaryItem(
                        this.state.navigationDictionary !== null
                            ? this.state.navigationDictionary[1]
                            : null,
                        0
                    )}
                </div>
            </div>
        );
    }

    public componentWillUnmount(): void {
        if (this.props.messageSystem !== undefined) {
            this.props.messageSystem.remove(this.messageSystemConfig);
        }
    }

    /**
     * Handle messages from the message system
     */
    private handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.setState({
                    navigationDictionary: e.data.navigationDictionary,
                    dataDictionary: e.data.dataDictionary,
                    activeItem: [
                        e.data.navigationDictionary[1],
                        e.data.navigationDictionary[0][e.data.navigationDictionary[1]][1],
                    ],
                });

                break;
            case MessageSystemType.data:
                this.setState({
                    navigationDictionary: e.data.navigationDictionary,
                    dataDictionary: e.data.dataDictionary,
                    activeItem: [
                        e.data.activeDictionaryId,
                        e.data.activeNavigationConfigId,
                    ],
                });
                break;
            case MessageSystemType.navigation:
                const dictionaryActiveConfigIds: string[] = !Array.isArray(
                    this.state.expandedNavigationConfigItems[e.data.activeDictionaryId]
                )
                    ? [e.data.activeNavigationConfigId]
                    : this.state.expandedNavigationConfigItems[
                          e.data.activeDictionaryId
                      ].includes(e.data.activeNavigationConfigId)
                    ? this.state.expandedNavigationConfigItems[
                          e.data.activeDictionaryId
                      ].filter((navigationConfigItem: string) => {
                          return navigationConfigItem !== e.data.activeNavigationConfigId;
                      })
                    : this.state.expandedNavigationConfigItems[
                          e.data.activeDictionaryId
                      ].concat([e.data.activeNavigationConfigId]);

                this.setState({
                    activeItem: [
                        e.data.activeDictionaryId,
                        e.data.activeNavigationConfigId,
                    ],
                    expandedNavigationConfigItems: {
                        ...this.state.expandedNavigationConfigItems,
                        [e.data.activeDictionaryId]: dictionaryActiveConfigIds,
                    },
                });
                break;
        }
    };

    private renderDictionaryItem(
        dictionaryId: string | null,
        index: number
    ): React.ReactNode {
        if (dictionaryId !== null) {
            return this.renderNavigationConfig(
                dictionaryId,
                this.state.navigationDictionary[0][dictionaryId][1],
                index
            );
        }

        return null;
    }

    private renderNavigationConfig(
        dictionaryId: string,
        navigationConfigId: string,
        index: number
    ): React.ReactNode {
        const isDictionaryLink: boolean =
            this.state.navigationDictionary[0][dictionaryId] !== undefined &&
            this.state.navigationDictionary[0][dictionaryId][1] === navigationConfigId;
        const isDraggable: boolean =
            isDictionaryLink && this.state.navigationDictionary[1] !== dictionaryId; // is linked data and not the root level item
        const content: React.ReactNode = this.renderContent(
            dictionaryId,
            navigationConfigId
        );
        const wrappedContent: React.ReactNode =
            content !== null ? (
                <div
                    role={"group"}
                    key={"content"}
                    className={this.props.managedClasses.navigation_itemList}
                >
                    {content}
                </div>
            ) : null;
        const itemType: DragDropItemType = isDraggable
            ? DragDropItemType.linkedData
            : this.state.navigationDictionary[0][dictionaryId][0][navigationConfigId]
                  .schema[dictionaryLink]
            ? DragDropItemType.linkedDataContainer
            : DragDropItemType.default;

        return (
            <div
                role={"treeitem"}
                className={this.props.managedClasses.navigation_item}
                aria-expanded={this.getExpandedState(dictionaryId, navigationConfigId)}
                key={dictionaryId + navigationConfigId}
            >
                <React.Fragment key={"trigger"}>
                    {this.renderTrigger(
                        itemType,
                        this.state.navigationDictionary[0][dictionaryId][0][
                            navigationConfigId
                        ].text,
                        content !== null,
                        isDraggable,
                        itemType !== DragDropItemType.default,
                        dictionaryId,
                        navigationConfigId,
                        index
                    )}
                </React.Fragment>
                {wrappedContent}
            </div>
        );
    }

    private renderTrigger(
        type: DragDropItemType,
        text: string,
        isCollapsible: boolean,
        isDraggable: boolean,
        isDroppable: boolean,
        dictionaryId: string,
        navigationConfigId: string,
        index: number
    ): React.ReactNode {
        return (
            <DraggableNavigationTreeItem
                type={type}
                index={index}
                isCollapsible={isCollapsible}
                className={this.getDraggableItemClassName(
                    isCollapsible,
                    isDraggable,
                    isDroppable,
                    dictionaryId,
                    navigationConfigId
                )}
                handleClick={this.handleNavigationItemClick(
                    dictionaryId,
                    navigationConfigId
                )}
                handleKeyDown={this.handleNavigationItemKeyDown(
                    dictionaryId,
                    navigationConfigId
                )}
                dictionaryId={dictionaryId}
                navigationConfigId={navigationConfigId}
                dragStart={this.handleDragStart(index)}
                dragEnd={this.handleDragEnd}
                dragHover={this.handleDragHover}
            >
                {text}
            </DraggableNavigationTreeItem>
        );
    }

    private renderContent(
        dictionaryId: string,
        navigationConfigId: string
    ): React.ReactNode {
        const navigationConfig: TreeNavigationItem = this.state.navigationDictionary[0][
            dictionaryId
        ][0][navigationConfigId];

        if (Array.isArray(navigationConfig.items) && navigationConfig.items.length > 0) {
            return navigationConfig.items.map(
                (navigationConfigItemId: string, index: number) => {
                    if (
                        navigationConfig.schema[dictionaryLink] &&
                        Array.isArray(navigationConfig.data) &&
                        navigationConfig.data[index]
                    ) {
                        return this.renderDictionaryItem(
                            navigationConfig.data[index].id,
                            index
                        );
                    }

                    return this.renderNavigationConfig(
                        dictionaryId,
                        navigationConfigItemId,
                        index
                    );
                }
            );
        }

        return null;
    }

    private getExpandedState(
        dictionaryId?: string,
        navigationConfigId?: string
    ): boolean {
        // assume this is the root level tree item if these are undefined
        if (dictionaryId === undefined && navigationConfigId === undefined) {
            if (this.state.navigationDictionary === null) {
                return false;
            }

            return (
                Array.isArray(
                    this.state.expandedNavigationConfigItems[
                        this.state.navigationDictionary[1]
                    ]
                ) &&
                this.state.expandedNavigationConfigItems[
                    this.state.navigationDictionary[1]
                ].includes(
                    this.state.navigationDictionary[0][
                        this.state.navigationDictionary[1]
                    ][1]
                )
            );
        }

        return (
            Array.isArray(this.state.expandedNavigationConfigItems[dictionaryId]) &&
            this.state.expandedNavigationConfigItems[dictionaryId].includes(
                navigationConfigId
            )
        );
    }

    private getDraggableItemClassName(
        isCollapsible: boolean,
        isDraggable: boolean,
        isDroppable: boolean,
        dictionaryId: string,
        navigationConfigId: string
    ): string {
        let className: string = this.props.managedClasses.navigation_itemTrigger;

        if (isCollapsible) {
            className += ` ${this.props.managedClasses.navigation_itemTrigger__expandable}`;
        }

        if (
            this.state.activeItem[0] === dictionaryId &&
            this.state.activeItem[1] === navigationConfigId
        ) {
            className += ` ${this.props.managedClasses.navigation_itemTrigger__active}`;
        }

        if (isDraggable) {
            className += ` ${this.props.managedClasses.navigation_itemTrigger__draggable}`;
        }

        if (isDroppable) {
            className += ` ${this.props.managedClasses.navigation_itemTrigger__droppable}`;
        }

        if (
            this.state.hoveredItem !== null &&
            this.state.hoveredItem[1] === dictionaryId &&
            this.state.hoveredItem[2] === navigationConfigId
        ) {
            if (this.state.hoveredItem[0] === DragDropItemType.linkedDataContainer) {
                className += ` ${this.props.managedClasses.navigation_itemTrigger__hover}`;
            } else if (this.state.hoveredItem[0] === DragDropItemType.linkedData) {
                if (this.state.hoveredItem[3] === HoverLocation.after) {
                    className += ` ${this.props.managedClasses.navigation_itemTrigger__hoverAfter}`;
                } else {
                    className += ` ${this.props.managedClasses.navigation_itemTrigger__hoverBefore}`;
                }
            }
        }

        return className;
    }

    /**
     * Handler for the beginning of the drag
     * - This method removes the dragging item from the data
     */
    private handleDragStart = (index: number): ((dictionaryId: string) => void) => {
        return (dictionaryId: string): void => {
            this.setState({
                linkedData: getLinkedData(this.state.dataDictionary, [dictionaryId]),
                linkedDataLocation: [
                    this.state.navigationDictionary[0][dictionaryId][0][
                        this.state.navigationDictionary[0][dictionaryId][1]
                    ].parentDictionaryItem.id,
                    this.state.navigationDictionary[0][dictionaryId][0][
                        this.state.navigationDictionary[0][dictionaryId][1]
                    ].parentDictionaryItem.dataLocation,
                    index,
                ],
            });

            this.props.messageSystem.postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                dictionaryId: this.state.navigationDictionary[0][dictionaryId][0][
                    this.state.navigationDictionary[0][dictionaryId][1]
                ].parentDictionaryItem.id,
                dataLocation: this.state.navigationDictionary[0][dictionaryId][0][
                    this.state.navigationDictionary[0][dictionaryId][1]
                ].parentDictionaryItem.dataLocation,
                linkedData: this.state.navigationDictionary[0][
                    this.state.navigationDictionary[0][dictionaryId][0][
                        this.state.navigationDictionary[0][dictionaryId][1]
                    ].parentDictionaryItem.id
                ][0][
                    this.state.navigationDictionary[0][dictionaryId][0][
                        this.state.navigationDictionary[0][dictionaryId][1]
                    ].parentDictionaryItem.dataLocation
                ].data.filter((value: LinkedData) => {
                    return value.id === dictionaryId;
                }),
            });
        };
    };

    private handleDragEnd = (): void => {
        this.props.messageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.addLinkedData,
            linkedData: this.state.linkedData,
            dictionaryId: this.state.linkedDataLocation[0],
            dataLocation: this.state.linkedDataLocation[1],
            index: this.state.linkedDataLocation[2],
        });

        this.setState({
            hoveredItem: null,
        });
    };

    private handleDragHover = (
        type: DragDropItemType,
        dictionaryId: string,
        navigationConfigId: string,
        index: number,
        location: HoverLocation
    ): void => {
        let parentDictionaryId: string = dictionaryId;
        let parentDataLocation: string = this.state.navigationDictionary[0][
            dictionaryId
        ][0][navigationConfigId].relativeDataLocation;
        const isLinkedDataContainer: boolean =
            type === DragDropItemType.linkedDataContainer;

        if (
            !isLinkedDataContainer &&
            this.state.navigationDictionary[0][dictionaryId][0][navigationConfigId]
                .parentDictionaryItem !== undefined
        ) {
            parentDataLocation = this.state.navigationDictionary[0][dictionaryId][0][
                navigationConfigId
            ].parentDictionaryItem.dataLocation;
            parentDictionaryId = this.state.navigationDictionary[0][dictionaryId][0][
                navigationConfigId
            ].parentDictionaryItem.id;
        }

        if (
            this.state.hoveredItem === null ||
            dictionaryId !== this.state.hoveredItem[1] ||
            navigationConfigId !== this.state.hoveredItem[2] ||
            location !== this.state.hoveredItem[3]
        ) {
            this.setState({
                hoveredItem: [type, dictionaryId, navigationConfigId, location],
                linkedDataLocation: [
                    parentDictionaryId,
                    parentDataLocation,
                    isLinkedDataContainer
                        ? undefined
                        : location === HoverLocation.before
                        ? index
                        : index + 1,
                ],
            });
        }
    };

    /**
     * Update the active item
     */
    private handleNavigationItemClick = (
        dictionaryId: string,
        navigationConfigId: string
    ): (() => void) => {
        return (): void => {
            this.triggerNavigationUpdate(dictionaryId, navigationConfigId);
        };
    };

    private triggerNavigationUpdate(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        this.props.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: dictionaryId,
            activeNavigationConfigId: navigationConfigId,
        });
    }

    private findCurrentTreeItemIndex(
        nodes: HTMLElement[],
        dictionaryId: string,
        navigationConfigId: string
    ): number {
        return nodes.findIndex((node: HTMLElement) => {
            return (
                node.dataset.dictionaryid === dictionaryId &&
                node.dataset.navigationconfigid === navigationConfigId
            );
        });
    }

    private focusNextTreeItem(dictionaryId: string, navigationConfigId: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const nextIndex: number =
                currentIndex !== -1 && currentIndex !== nodes.length - 1
                    ? currentIndex + 1
                    : nodes.length - 1;
            nodes[nextIndex].focus();
        }
    }

    private focusPreviousTreeItem(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
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

    private focusAndOpenTreeItems(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.attributes["aria-expanded"].value'
            );

            if (
                nodes[currentIndex].tagName !== "A" &&
                ariaExpanded === "true" &&
                nodes[currentIndex + 1]
            ) {
                nodes[currentIndex + 1].focus();
            } else if (ariaExpanded === "false") {
                this.triggerNavigationUpdate(dictionaryId, navigationConfigId);
            }
        }
    }

    private focusAndCloseTreeItems(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.attributes["aria-expanded"].value'
            );

            if (nodes[currentIndex].tagName === "A") {
                const parent: HTMLElement = get(
                    nodes[currentIndex],
                    "parentElement.parentElement.firstChild"
                );

                parent.focus();
            } else if (ariaExpanded === "false") {
                nodes[currentIndex - 1].focus();
            } else if (ariaExpanded === "true") {
                this.triggerNavigationUpdate(dictionaryId, navigationConfigId);
            }
        }
    }

    private getTreeItemNodes(): HTMLElement[] {
        const nodes: HTMLElement[] = Array.from(
            this.rootElement.current.querySelectorAll(
                "div[role='treeitem'] > a, div[role='treeitem'] > span"
            )
        );
        return nodes.filter((node: HTMLElement) => node.offsetParent !== null);
    }

    /**
     * Handles key up on a tree item
     */
    private handleNavigationItemKeyDown = (
        dictionaryId: string,
        navigationConfigId: string
    ): ((e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>) => void) => {
        return (e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                switch (e.keyCode) {
                    case keyCodeEnter:
                    case keyCodeSpace:
                        if (e.target === e.currentTarget) {
                            this.triggerNavigationUpdate(
                                dictionaryId,
                                navigationConfigId
                            );
                        }
                        break;
                    case keyCodeArrowDown:
                        this.focusNextTreeItem(dictionaryId, navigationConfigId);
                        break;
                    case keyCodeArrowUp:
                        this.focusPreviousTreeItem(dictionaryId, navigationConfigId);
                        break;
                    case keyCodeArrowRight:
                        this.focusAndOpenTreeItems(dictionaryId, navigationConfigId);
                        break;
                    case keyCodeArrowLeft:
                        this.focusAndCloseTreeItems(dictionaryId, navigationConfigId);
                        break;
                    case keyCodeHome:
                        this.focusFirstTreeItem();
                        break;
                    case keyCodeEnd:
                        this.focusLastTreeItem();
                        break;
                }
            }
        };
    };
}

export { Navigation };
export default manageJss(styles)(Navigation);
