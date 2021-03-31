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
    keyCodeTab,
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
    dataSetName,
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

export const navigationId = "fast-tooling-react::navigation";

interface NavigationRegisterConfig {
    displayTextDataLocation: string;
}

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

    private messageSystemConfig: Register<NavigationRegisterConfig>;

    private rootElement: React.RefObject<HTMLDivElement>;

    constructor(props: NavigationProps) {
        super(props);

        this.messageSystemConfig = {
            onMessage: this.handleMessageSystem,
            config: {
                displayTextDataLocation: dataSetName,
            },
        };

        if (props.messageSystem !== undefined) {
            props.messageSystem.add(this.messageSystemConfig);
        }

        this.state = {
            navigationDictionary: null,
            dataDictionary: null,
            activeDictionaryId: "",
            activeNavigationConfigId: "",
            activeItemEditable: false,
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

    private getActiveConfigIds(
        activeDictionaryId: string,
        activeNavigationConfigId: string
    ): string[] {
        return !Array.isArray(
            this.state.expandedNavigationConfigItems[activeDictionaryId]
        )
            ? [activeNavigationConfigId]
            : this.state.expandedNavigationConfigItems[activeDictionaryId].includes(
                  activeNavigationConfigId
              )
            ? this.state.expandedNavigationConfigItems[activeDictionaryId].filter(
                  (navigationConfigItem: string) => {
                      return navigationConfigItem !== activeNavigationConfigId;
                  }
              )
            : this.state.expandedNavigationConfigItems[activeDictionaryId].concat([
                  activeNavigationConfigId,
              ]);
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
                    activeDictionaryId: e.data.activeDictionaryId
                        ? e.data.activeDictionaryId
                        : e.data.navigationDictionary[1],
                    activeNavigationConfigId: e.data.activeNavigationConfigId
                        ? e.data.activeNavigationConfigId
                        : e.data.navigationDictionary[0][
                              e.data.navigationDictionary[1]
                          ][1],
                });

                break;
            case MessageSystemType.data:
                this.setState({
                    navigationDictionary: e.data.navigationDictionary,
                    dataDictionary: e.data.dataDictionary,
                    activeDictionaryId: e.data.activeDictionaryId
                        ? e.data.activeDictionaryId
                        : this.state.activeDictionaryId,
                    activeNavigationConfigId: e.data.activeNavigationConfigId
                        ? e.data.activeNavigationConfigId
                        : this.state.activeNavigationConfigId,
                });

                break;
            case MessageSystemType.navigation:
                this.setState({
                    activeDictionaryId: e.data.activeDictionaryId,
                    activeNavigationConfigId: e.data.activeNavigationConfigId,
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
        const isTriggerRenderable: boolean = this.shouldTriggerRender(
            dictionaryId,
            navigationConfigId
        );
        const content: React.ReactNode = this.renderContent(
            dictionaryId,
            navigationConfigId,
            isTriggerRenderable
        );
        const itemType: DragDropItemType = isDraggable
            ? DragDropItemType.linkedData
            : this.state.navigationDictionary[0][dictionaryId][0][navigationConfigId]
                  .schema[dictionaryLink]
            ? DragDropItemType.linkedDataContainer
            : DragDropItemType.default;

        const trigger: React.ReactNode = isTriggerRenderable
            ? this.renderTrigger(
                  itemType,
                  this.state.navigationDictionary[0][dictionaryId][0][navigationConfigId]
                      .text,
                  content !== null,
                  isDraggable,
                  itemType !== DragDropItemType.default,
                  dictionaryId,
                  navigationConfigId,
                  index
              )
            : null;

        if (trigger === null && content === null) {
            return null;
        }

        return (
            <div
                role={"treeitem"}
                className={this.props.managedClasses.navigation_itemRegion}
                aria-expanded={this.getExpandedState(dictionaryId, navigationConfigId)}
                key={index}
            >
                {trigger}
                {content}
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
                key={index}
                isCollapsible={isCollapsible}
                isEditable={
                    this.state.activeItemEditable &&
                    this.isEditable(dictionaryId, navigationConfigId)
                }
                className={this.getDraggableItemClassName(
                    isCollapsible,
                    isDraggable,
                    isDroppable,
                    dictionaryId,
                    navigationConfigId
                )}
                expandTriggerClassName={
                    this.props.managedClasses.navigation_itemExpandTrigger
                }
                contentClassName={this.props.managedClasses.navigation_itemContent}
                displayTextInputClassName={
                    this.props.managedClasses.navigation_itemDisplayTextInput
                }
                handleExpandClick={this.handleNavigationItemExpandClick(
                    dictionaryId,
                    navigationConfigId
                )}
                handleClick={this.handleNavigationItemClick(
                    dictionaryId,
                    navigationConfigId
                )}
                handleInputChange={this.handleNavigationItemChangeDisplayText(
                    dictionaryId
                )}
                handleInputBlur={this.handleNavigationItemBlurDisplayTextInput()}
                handleInputKeyDown={this.handleNavigationItemKeyDownDisplayTextInput()}
                handleKeyDown={this.handleNavigationItemKeyDown(
                    dictionaryId,
                    navigationConfigId
                )}
                dictionaryId={dictionaryId}
                navigationConfigId={navigationConfigId}
                dragStart={this.handleDragStart(index)}
                dragEnd={this.handleDragEnd}
                dragHover={this.handleDragHover}
                text={text}
            />
        );
    }

    private renderContent(
        dictionaryId: string,
        navigationConfigId: string,
        isTriggerRendered: boolean
    ): React.ReactNode {
        const navigationConfig: TreeNavigationItem = this.state.navigationDictionary[0][
            dictionaryId
        ][0][navigationConfigId];

        if (Array.isArray(navigationConfig.items) && navigationConfig.items.length > 0) {
            const content: React.ReactNode[] = navigationConfig.items.map(
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
            const isEmpty: boolean =
                content.find((contentItem: React.ReactNode) => {
                    return contentItem !== null;
                }) === undefined;

            if (!isEmpty) {
                if (isTriggerRendered) {
                    return (
                        <div
                            role={"group"}
                            key={"content"}
                            className={this.props.managedClasses.navigation_itemList}
                        >
                            {content}
                        </div>
                    );
                }

                return content;
            }
        }

        return null;
    }

    private isEditable(dictionaryId?: string, navigationConfigId?: string): boolean {
        return (
            this.state.activeDictionaryId === dictionaryId &&
            this.state.activeNavigationConfigId === navigationConfigId &&
            this.state.activeNavigationConfigId === ""
        );
    }

    private shouldTriggerRender(
        dictionaryId: string,
        navigationConfigId: string
    ): boolean {
        return (
            !Array.isArray(this.props.types) ||
            this.props.types.includes(
                this.state.navigationDictionary[0][dictionaryId][0][navigationConfigId]
                    .type
            )
        );
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
        let className: string = this.props.managedClasses.navigation_item;

        if (isCollapsible) {
            className += ` ${this.props.managedClasses.navigation_item__expandable}`;
        }

        if (
            this.state.activeDictionaryId === dictionaryId &&
            this.state.activeNavigationConfigId === navigationConfigId
        ) {
            className += ` ${this.props.managedClasses.navigation_item__active}`;
        }

        if (isDraggable) {
            className += ` ${this.props.managedClasses.navigation_item__draggable}`;
        }

        if (isDroppable) {
            className += ` ${this.props.managedClasses.navigation_item__droppable}`;
        }

        if (
            this.state.hoveredItem !== null &&
            this.state.hoveredItem[1] === dictionaryId &&
            this.state.hoveredItem[2] === navigationConfigId
        ) {
            if (this.state.hoveredItem[0] === DragDropItemType.linkedDataContainer) {
                className += ` ${this.props.managedClasses.navigation_item__hover}`;
            } else if (this.state.hoveredItem[0] === DragDropItemType.linkedData) {
                if (this.state.hoveredItem[3] === HoverLocation.after) {
                    className += ` ${this.props.managedClasses.navigation_item__hoverAfter}`;
                } else {
                    className += ` ${this.props.managedClasses.navigation_item__hoverBefore}`;
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
                options: {
                    originatorId: navigationId,
                },
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
            options: {
                originatorId: navigationId,
            },
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
     * Handle clicks on a navigation item
     */
    private handleNavigationItemClick = (
        dictionaryId: string,
        navigationConfigId: string
    ): ((event: React.MouseEvent<HTMLElement>) => void) => {
        let timer;
        let timesClicked = 0;

        return (event: React.MouseEvent<HTMLElement>): void => {
            clearTimeout(timer);
            timesClicked += 1;

            setTimeout(() => {
                if (timesClicked === 1) {
                    this.handleNavigationItemSingleClick(
                        dictionaryId,
                        navigationConfigId
                    );
                } else if (timesClicked === 2) {
                    this.handleNavigationItemDoubleClick(
                        dictionaryId,
                        navigationConfigId
                    );
                }

                timesClicked = 0;
            }, 200);
        };
    };

    /**
     * Update the active item
     */
    private handleNavigationItemSingleClick = (
        dictionaryId: string,
        navigationConfigId: string
    ): void => {
        this.triggerNavigationUpdate(dictionaryId, navigationConfigId);
    };

    /**
     * Allows editing of the active item
     */
    private handleNavigationItemDoubleClick = (
        dictionaryId: string,
        navigationConfigId: string
    ): void => {
        if (this.isEditable(dictionaryId, navigationConfigId)) {
            this.triggerNavigationEdit();
        }
    };

    /**
     * Update the active items display text
     */
    private handleNavigationItemChangeDisplayText = (
        dictionaryId: string
    ): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            this.props.messageSystem.postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dictionaryId,
                dataLocation: dataSetName,
                data: e.target.value,
                options: {
                    originatorId: navigationId,
                },
            });
        };
    };

    /**
     * Update the active items display text focus state
     */
    private handleNavigationItemBlurDisplayTextInput = (): ((
        e: React.FocusEvent<HTMLInputElement>
    ) => void) => {
        return () => {
            this.setState({
                activeItemEditable: false,
            });
        };
    };

    /**
     * Handles key up on the active items display text
     */
    private handleNavigationItemKeyDownDisplayTextInput = (): ((
        e: React.KeyboardEvent<HTMLInputElement>
    ) => void) => {
        return (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.target === e.currentTarget) {
                switch (e.keyCode) {
                    case keyCodeEnter:
                        this.setState({
                            activeItemEditable: false,
                        });
                }
            }
        };
    };

    /**
     * Update an items expandable state
     */
    private handleNavigationItemExpandClick = (
        dictionaryId: string,
        navigationConfigId: string
    ): (() => void) => {
        return (): void => {
            this.triggerExpandCollapse(dictionaryId, navigationConfigId);
        };
    };

    private triggerExpandCollapse(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        this.setState({
            expandedNavigationConfigItems: {
                ...this.state.expandedNavigationConfigItems,
                [dictionaryId]: this.getActiveConfigIds(dictionaryId, navigationConfigId),
            },
        });
    }

    private triggerNavigationEdit(): void {
        this.setState({
            activeItemEditable: true,
        });
    }

    private triggerNavigationUpdate(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        this.setState(
            {
                activeItemEditable: false,
            },
            () => {
                this.props.messageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: dictionaryId,
                    activeNavigationConfigId: navigationConfigId,
                    options: {
                        originatorId: navigationId,
                    },
                });
            }
        );
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
                'parentElement.parentElement.attributes["aria-expanded"].value'
            );

            if (
                nodes[currentIndex].tagName !== "A" &&
                ariaExpanded === "true" &&
                nodes[currentIndex + 1]
            ) {
                nodes[currentIndex + 1].focus();
            } else if (ariaExpanded === "false") {
                this.triggerExpandCollapse(dictionaryId, navigationConfigId);
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
                'parentElement.parentElement.attributes["aria-expanded"].value'
            );

            if (nodes[currentIndex].tagName === "A") {
                const parent: HTMLElement = get(
                    nodes[currentIndex],
                    "parentElement.parentElement.parentElement.parentElement.firstChild"
                );

                if (parent) {
                    (parent.querySelector("[data-dictionaryid]") as HTMLElement).focus();
                }
            } else if (ariaExpanded === "false" && nodes[currentIndex - 1]) {
                nodes[currentIndex - 1].focus();
            } else if (ariaExpanded === "true") {
                this.triggerExpandCollapse(dictionaryId, navigationConfigId);
                this.triggerNavigationUpdate(dictionaryId, navigationConfigId);
            }
        }
    }

    private getTreeItemNodes(): HTMLElement[] {
        const nodes: HTMLElement[] = Array.from(
            this.rootElement.current.querySelectorAll(
                "div[role='treeitem'] > a, div[role='treeitem'] > span > [data-dictionaryid]"
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
                            this.triggerExpandCollapse(dictionaryId, navigationConfigId);
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
