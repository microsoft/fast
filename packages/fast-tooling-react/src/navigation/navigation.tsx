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
import { cloneDeep, get, set, uniqueId } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import {
    NavigationHandledProps,
    NavigationProps,
    NavigationState,
} from "./navigation.props";
import { dictionaryLink } from "@microsoft/fast-tooling";
import { DraggableNavigationTreeItem, NavigationTreeItem } from "./navigation-tree-item";
import { DragDropItemType, NavigationTreeItemProps } from "./navigation-tree-item.props";
import { Register } from "../message-system/message-system.props";
import { MessageSystemType } from "../message-system";
import {
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
} from "../message-system/message-system.utilities.props";
import { DataDictionary, LinkedData, Parent } from "../message-system/data.props";
import { Data } from "../message-system/data.props";
import { TreeNavigationConfigDictionary } from "../message-system/navigation.props";
import { getNavigationDictionary } from "../message-system/navigation";
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
        dragAndDropReordering: void 0,
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
            updatedNavigationDictionary: null,
            dataDictionary: null,
            activeItem: null,
            expandedNavigationConfigItems: {},
            isDragging: false,
            linkedData: void 0,
            originalLinkedDataLocation: null,
            updatedLinkedDataLocation: null,
            schemaDictionary: {},
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
                {this.renderDictionaryItem(
                    this.getNavigationDictionary()
                        ? this.getNavigationDictionary()[1]
                        : null
                )}
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
                    updatedNavigationDictionary: e.data.navigationDictionary,
                    dataDictionary: e.data.dataDictionary,
                    schemaDictionary: e.data.schemaDictionary,
                    activeItem: [
                        e.data.navigationDictionary[1],
                        e.data.navigationDictionary[0][e.data.navigationDictionary[1]][1],
                    ],
                });

                break;
            case MessageSystemType.data:
                this.setState({
                    navigationDictionary: this.state.isDragging
                        ? this.state.navigationDictionary
                        : e.data.navigationDictionary,
                    updatedNavigationDictionary: e.data.navigationDictionary,
                    dataDictionary: e.data.dataDictionary,
                    activeItem: [
                        e.data.activeDictionaryId,
                        e.data.activeNavigationConfigId,
                    ],
                });
                break;
            case MessageSystemType.navigation:
                this.setState({
                    activeItem: [
                        e.data.activeDictionaryId,
                        e.data.activeNavigationConfigId,
                    ],
                });
                break;
        }
    };

    private renderDictionaryItem(dictionaryKey: string | null): React.ReactNode {
        if (this.getNavigationDictionary() !== null) {
            return this.renderNavigationConfig(
                dictionaryKey,
                this.getNavigationDictionary()[0][dictionaryKey][1]
            );
        }

        return null;
    }

    private renderNavigationConfig(
        dictionaryKey: string,
        navigationConfigKey: string
    ): React.ReactNode {
        const isDictionaryLink: boolean =
            this.getNavigationDictionary()[0][dictionaryKey] !== undefined &&
            this.getNavigationDictionary()[0][dictionaryKey][1] === navigationConfigKey;
        const isDraggable: boolean =
            isDictionaryLink && this.getNavigationDictionary()[1] !== dictionaryKey; // is linked data and not the root level item
        const isParentDictionaryLink: boolean =
            this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                .parent !== null &&
            !!this.getNavigationDictionary()[0][dictionaryKey][0][
                this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                    .parent
            ].schema[dictionaryLink];
        const hasContent: boolean =
            (Array.isArray(
                this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                    .items
            ) &&
                this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                    .items.length > 0) ||
            (isDictionaryLink &&
                this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                    .data);
        const navigationProps: NavigationTreeItemProps = {
            type: isDraggable
                ? DragDropItemType.linkedData
                : this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                      .schema[dictionaryLink]
                    ? DragDropItemType.linkedDataContainer
                    : DragDropItemType.default,
            linkClassName: this.getItemLinkClassName(dictionaryKey, navigationConfigKey),
            isDragging: this.state.isDragging,
            isDraggable,
            isCurrentDragItem:
                Array.isArray(this.state.updatedLinkedDataLocation) &&
                dictionaryKey !== this.state.updatedLinkedDataLocation[0],
            contentClassName: this.getItemContentClassName(),
            item: this.getNavigationDictionary()[0][dictionaryKey][0][
                navigationConfigKey
            ],
            expanded: this.getExpandedState(dictionaryKey, navigationConfigKey),
            handleClick: this.handleNavigationItemClick(
                dictionaryKey,
                navigationConfigKey
            ),
            handleKeyDown: this.handleTreeItemKeyDown(dictionaryKey, navigationConfigKey),
            dictionaryId: dictionaryKey,
            navigationConfigId: navigationConfigKey,
            moveDragItem: this.handleMoveDragItem,
            dropDragItem: this.handleDropDragItem,
            dragStart: this.handleDragStart,
            dragEnd: this.handleDragEnd,
        };
        const navigationTreeItemLinkedData: React.ReactNode = [
            this.renderNavigationConfigTrigger(
                dictionaryKey,
                navigationConfigKey,
                hasContent
            ),
            this.renderNavigationConfigContent(
                dictionaryKey,
                navigationConfigKey,
                hasContent,
                isParentDictionaryLink
            ),
        ];

        if (this.props.dragAndDropReordering && isDraggable) {
            return (
                <DraggableNavigationTreeItem
                    key={dictionaryKey + navigationConfigKey}
                    {...navigationProps}
                >
                    {navigationTreeItemLinkedData}
                </DraggableNavigationTreeItem>
            );
        }

        if (!isParentDictionaryLink) {
            if (
                this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                    .schema[dictionaryLink]
            ) {
                return (
                    <DraggableNavigationTreeItem
                        key={dictionaryKey + navigationConfigKey}
                        {...navigationProps}
                    >
                        {navigationTreeItemLinkedData}
                    </DraggableNavigationTreeItem>
                );
            }

            return (
                <NavigationTreeItem
                    key={dictionaryKey + navigationConfigKey}
                    {...navigationProps}
                >
                    {navigationTreeItemLinkedData}
                </NavigationTreeItem>
            );
        }
    }

    private renderNavigationConfigTrigger(
        dictionaryKey: string,
        navigationConfigKey: string,
        hasContent: boolean
    ): React.ReactNode {
        if (
            typeof this.getNavigationDictionary()[0][dictionaryKey][0][
                navigationConfigKey
            ].data !== "undefined" &&
            this.getNavigationDictionary()[0][dictionaryKey][0][navigationConfigKey]
                .schema[dictionaryLink]
        ) {
            return (
                <React.Fragment key={dictionaryKey + navigationConfigKey}>
                    <span
                        className={this.getItemDisplayTextClassName(
                            dictionaryKey,
                            navigationConfigKey
                        )}
                        onKeyDown={this.handleTreeItemKeyDown(
                            dictionaryKey,
                            navigationConfigKey
                        )}
                        data-dictionaryid={dictionaryKey}
                        data-navigationconfigid={navigationConfigKey}
                        tabIndex={0}
                    >
                        <button
                            className={this.getItemExpandTriggerClassName()}
                            onClick={this.handleToggleNavigationItem(
                                dictionaryKey,
                                navigationConfigKey
                            )}
                        />
                        <span
                            onClick={this.handleNavigationItemClick(
                                dictionaryKey,
                                navigationConfigKey
                            )}
                        >
                            {
                                this.getNavigationDictionary()[0][dictionaryKey][0][
                                    navigationConfigKey
                                ].text
                            }
                        </span>
                    </span>
                    {this.renderLinkedDataItems(dictionaryKey, navigationConfigKey)}
                </React.Fragment>
            );
        }

        if (hasContent) {
            return (
                <span
                    key={"trigger"}
                    className={this.getItemDisplayTextClassName(
                        dictionaryKey,
                        navigationConfigKey
                    )}
                    onKeyDown={this.handleTreeItemKeyDown(
                        dictionaryKey,
                        navigationConfigKey
                    )}
                    data-dictionaryid={dictionaryKey}
                    data-navigationconfigid={navigationConfigKey}
                    tabIndex={0}
                >
                    <button
                        className={this.getItemExpandTriggerClassName()}
                        onClick={this.handleToggleNavigationItem(
                            dictionaryKey,
                            navigationConfigKey
                        )}
                    />
                    <span
                        onClick={this.handleNavigationItemClick(
                            dictionaryKey,
                            navigationConfigKey
                        )}
                    >
                        {
                            this.getNavigationDictionary()[0][dictionaryKey][0][
                                navigationConfigKey
                            ].text
                        }
                    </span>
                </span>
            );
        }

        return (
            <span
                key={"trigger"}
                className={this.getItemDisplayTextClassName(
                    dictionaryKey,
                    navigationConfigKey
                )}
            >
                {
                    this.getNavigationDictionary()[0][dictionaryKey][0][
                        navigationConfigKey
                    ].text
                }
            </span>
        );
    }

    private renderLinkedDataItems(
        dictionaryKey: string,
        navigationConfigKey: string
    ): React.ReactNode {
        return this.getNavigationDictionary()[0][dictionaryKey][0][
            navigationConfigKey
        ].data.map((dictionaryItem: Parent, index: number) => {
            return (
                <div
                    className={this.props.managedClasses.navigation_itemList}
                    key={dictionaryItem.id + index}
                >
                    {this.renderDictionaryItem(dictionaryItem.id)}
                </div>
            );
        });
    }

    private renderNavigationConfigContent(
        dictionaryKey: string,
        navigationConfigKey: string,
        hasContent: boolean,
        isParentDictionaryLink: boolean
    ): React.ReactNode {
        if (hasContent && !isParentDictionaryLink) {
            return (
                <div
                    key={"content"}
                    className={this.props.managedClasses.navigation_itemList}
                    role={"group"}
                    aria-expanded={true}
                >
                    {this.getNavigationDictionary()[0][dictionaryKey][0][
                        navigationConfigKey
                    ].items.map((navigationConfigItemKey: string) => {
                        return this.renderNavigationConfig(
                            dictionaryKey,
                            navigationConfigItemKey
                        );
                    })}
                </div>
            );
        }

        return [];
    }

    /**
     * Handler for moving the dragged item
     * - When hovering items, temporarily add this dictionary item to the location to show where the item should show up
     * with opacity 0.
     */
    private handleMoveDragItem = (
        type: DragDropItemType,
        dictionaryId: string,
        navigationConfigId: string
    ): void => {
        if (
            this.state.updatedLinkedDataLocation === null ||
            (this.state.updatedLinkedDataLocation[0] !== dictionaryId ||
                this.state.updatedLinkedDataLocation[1] !== navigationConfigId)
        ) {
            // This handles the move for the linked data containers
            if (type === DragDropItemType.linkedDataContainer) {
                const dataDictionary: DataDictionary<unknown> = cloneDeep(
                    this.state.dataDictionary
                );

                // add the linkedData to the dictionary
                const id: string = uniqueId("fast");
                dataDictionary[0][id] = this.state.linkedData;
                const linkedDataRefs: LinkedData[] = [{ id }];
                const linkedDataLocation: string = `[0][${dictionaryId}].data${
                    navigationConfigId !== "" ? "." : ""
                }${navigationConfigId}`;
                // update the parent to include the added linkedData
                let currentLinkedDataRefs: LinkedData[] | void = get(
                    dataDictionary,
                    linkedDataLocation
                );

                if (Array.isArray(currentLinkedDataRefs)) {
                    currentLinkedDataRefs = currentLinkedDataRefs.concat(linkedDataRefs);
                } else {
                    currentLinkedDataRefs = linkedDataRefs;
                }

                set(dataDictionary, linkedDataLocation, currentLinkedDataRefs);

                this.setState({
                    updatedNavigationDictionary: getNavigationDictionary(
                        this.state.schemaDictionary,
                        dataDictionary
                    ),
                    updatedLinkedDataLocation: [
                        dictionaryId,
                        navigationConfigId, // This assumes this is the data location
                    ],
                });
            } else {
                /* tslint:disable */
                /**
                 * TODO: Allow drag and drop onto linked data
                 *
                 * Case 1: If the hovered linked data is in a different array,
                 * then splice the item at its current index
                 * hover 0, it becomes 0, and the item at 0 now moves to 1
                 * hover 3 becomes 3, and the item at 3 moves to 4,
                 *
                 * Case 2: If the hovered linked data is in the same array,
                 * hovering over any of the items should swap the indexs
                 */
            }
        }
    };

    /**
     * Handler for dropping the dragged item
     * - This method adds the dragging item back into the data at the desired point
     */
    private handleDropDragItem = (type: DragDropItemType): void => {
        // if there is no good updated linked data location, use the original one
        // during the drag end
        if (
            this.state.updatedLinkedDataLocation !== null &&
            type === DragDropItemType.linkedDataContainer
        ) {
            // Update the drop item linked data with new dictionary id and data location
            const updatedLinkedData: Data<unknown> = this.state.linkedData;
            updatedLinkedData.parent.id = this.state.updatedLinkedDataLocation[0];
            updatedLinkedData.parent.dataLocation = this.state.updatedLinkedDataLocation[1];

            this.props.messageSystem.postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData: [updatedLinkedData],
                dictionaryId: this.state.updatedLinkedDataLocation[0],
                dataLocation: this.state.updatedLinkedDataLocation[1],
            });
        }
    };

    /**
     * Handler for the beginning of the drag
     * - This method removes the dragging item from the data
     */
    private handleDragStart = (dictionaryId: string): void => {
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

        this.setState({
            isDragging: true,
            linkedData: this.state.dataDictionary[0][dictionaryId],
            updatedNavigationDictionary: this.state.navigationDictionary,
            originalLinkedDataLocation: [
                this.state.navigationDictionary[0][dictionaryId][0][
                    this.state.navigationDictionary[0][dictionaryId][1]
                ].parentDictionaryItem.id,
                this.state.navigationDictionary[0][dictionaryId][0][
                    this.state.navigationDictionary[0][dictionaryId][1]
                ].parentDictionaryItem.dataLocation,
            ],
            updatedLinkedDataLocation: null,
        });
    };

    private handleDragEnd = (): void => {
        // no drop has occured due to no updated linked data location
        if (this.state.updatedLinkedDataLocation === null) {
            this.props.messageSystem.postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                linkedData: [this.state.linkedData],
                dictionaryId: this.state.originalLinkedDataLocation[0],
                dataLocation: this.state.originalLinkedDataLocation[1],
            });
        }

        this.setState({
            isDragging: false,
        });
    };

    /**
     * Toggles the items by adding/removing them from the openItems array
     */
    private handleToggleNavigationItem = (
        dictionaryKey: string,
        navigationConfigKey: string
    ): (() => void) => {
        return (): void => {
            const isNavigationConfigItemExpanded: boolean =
                this.state.expandedNavigationConfigItems[dictionaryKey] &&
                this.state.expandedNavigationConfigItems[dictionaryKey].findIndex(
                    (value: string) => {
                        return value === navigationConfigKey;
                    }
                ) !== -1;
            const updatedNavigationConfigItems: { [key: string]: string[] } = this.state
                .expandedNavigationConfigItems;

            if (!isNavigationConfigItemExpanded) {
                if (Array.isArray(updatedNavigationConfigItems[dictionaryKey])) {
                    updatedNavigationConfigItems[dictionaryKey] = [
                        navigationConfigKey,
                    ].concat(updatedNavigationConfigItems[dictionaryKey]);
                } else {
                    updatedNavigationConfigItems[dictionaryKey] = [navigationConfigKey];
                }
            } else {
                updatedNavigationConfigItems[
                    dictionaryKey
                ] = updatedNavigationConfigItems[dictionaryKey].filter(
                    (value: string) => {
                        return value !== navigationConfigKey;
                    }
                );
            }

            this.setState({
                expandedNavigationConfigItems: updatedNavigationConfigItems,
            });
        };
    };

    /**
     * Update the active item
     */
    private handleNavigationItemClick = (
        dictionaryKey: string,
        navigationConfigKey: string
    ): (() => void) => {
        return (): void => {
            this.props.messageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: dictionaryKey,
                activeNavigationConfigId: navigationConfigKey,
            });
        };
    };

    private getExpandedState(
        dictionaryKey: string,
        navigationConfigKey: string
    ): boolean {
        return !!(
            this.state.expandedNavigationConfigItems[dictionaryKey] &&
            this.state.expandedNavigationConfigItems[dictionaryKey].findIndex(
                (value: string) => {
                    return navigationConfigKey === value;
                }
            ) !== -1
        );
    }

    private getNavigationDictionary(): TreeNavigationConfigDictionary | null {
        return this.state.isDragging
            ? this.state.updatedNavigationDictionary
            : this.state.navigationDictionary;
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

    private focusNextTreeItem(dictionaryKey: string, navigationConfigKey: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
            );
            const nextIndex: number =
                currentIndex !== -1 && currentIndex !== nodes.length - 1
                    ? currentIndex + 1
                    : nodes.length - 1;
            nodes[nextIndex].focus();
        }
    }

    private focusPreviousTreeItem(
        dictionaryKey: string,
        navigationConfigKey: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
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
        dictionaryKey: string,
        navigationConfigKey: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
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
                this.handleToggleNavigationItem(dictionaryKey, navigationConfigKey)();
            }
        }
    }

    private focusAndCloseTreeItems(
        dictionaryKey: string,
        navigationConfigKey: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = this.getTreeItemNodes();
            const currentIndex: number = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryKey,
                navigationConfigKey
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
                this.handleToggleNavigationItem(dictionaryKey, navigationConfigKey)();
            }
        }
    }

    private getItemLinkClassName(
        dictionaryKey: string,
        navigationConfigKey: string
    ): (dragging: boolean, canDrag: boolean) => string {
        return (dragging: boolean, canDrag: boolean): string => {
            let classes: string = this.props.managedClasses.navigation_item;

            if (
                this.state.activeItem[0] === dictionaryKey &&
                this.state.activeItem[1] === navigationConfigKey
            ) {
                classes = `${classes} ${
                    this.props.managedClasses.navigation_itemText__active
                }`;
            }

            if (this.props.dragAndDropReordering && canDrag) {
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

            return classes;
        };
    }

    private getItemContentClassName(): (dragging: boolean, canDrag: boolean) => string {
        return (dragging: boolean, canDrag: boolean): string => {
            let classes: string = this.props.managedClasses.navigation_item;

            if (this.props.dragAndDropReordering && canDrag) {
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

            return classes;
        };
    }

    private getItemExpandTriggerClassName(): string {
        return get(this.props, "managedClasses.navigation_itemExpandTrigger", "");
    }

    private getItemDisplayTextClassName(
        dictionaryKey: string,
        navigationConfigKey: string
    ): string {
        let classes: string = this.props.managedClasses.navigation_itemText;

        if (
            dictionaryKey === this.state.activeItem[0] &&
            navigationConfigKey === this.state.activeItem[1]
        ) {
            classes = `${classes} ${
                this.props.managedClasses.navigation_itemText__active
            }`;
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
    private handleTreeItemKeyDown = (
        dictionaryKey: string,
        navigationConfigKey: string
    ): ((e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>) => void) => {
        return (e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                switch (e.keyCode) {
                    case keyCodeEnter:
                    case keyCodeSpace:
                        if (e.target === e.currentTarget) {
                            this.handleToggleNavigationItem(
                                dictionaryKey,
                                navigationConfigKey
                            )();
                            this.handleNavigationItemClick(
                                dictionaryKey,
                                navigationConfigKey
                            )();
                        }
                        break;
                    case keyCodeArrowDown:
                        this.focusNextTreeItem(dictionaryKey, navigationConfigKey);
                        break;
                    case keyCodeArrowUp:
                        this.focusPreviousTreeItem(dictionaryKey, navigationConfigKey);
                        break;
                    case keyCodeArrowRight:
                        this.focusAndOpenTreeItems(dictionaryKey, navigationConfigKey);
                        break;
                    case keyCodeArrowLeft:
                        this.focusAndCloseTreeItems(dictionaryKey, navigationConfigKey);
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
