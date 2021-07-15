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
import Foundation from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import { HoverLocation } from "./navigation.props";
import { DraggableNavigationTreeItem } from "./navigation-tree-item";
import { DragDropItemType } from "./navigation-tree-item.props";
import {
    dataSetName,
    dictionaryLink,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    getLinkedData,
} from "@microsoft/fast-tooling";
import manageJss from "@microsoft/fast-jss-manager-react";
import styles from "./navigation.style";
export const navigationId = "fast-tooling-react::navigation";
class Navigation extends Foundation {
    constructor(props) {
        super(props);
        this.handledProps = {
            messageSystem: void 0,
        };
        /**
         * Handle messages from the message system
         */
        this.handleMessageSystem = e => {
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
                        expandedNavigationConfigItems: this.getUpdatedElementsExpanded(
                            e.data.activeDictionaryId,
                            e.data.activeNavigationConfigId
                        ),
                    });
                    break;
            }
        };
        /**
         * Handler for the beginning of the drag
         * - This method removes the dragging item from the data
         */
        this.handleDragStart = index => {
            return dictionaryId => {
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
                    ].data.filter(value => {
                        return value.id === dictionaryId;
                    }),
                    options: {
                        originatorId: navigationId,
                    },
                });
            };
        };
        this.handleDragEnd = () => {
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
        this.handleDragHover = (
            type,
            dictionaryId,
            navigationConfigId,
            index,
            location
        ) => {
            let parentDictionaryId = dictionaryId;
            let parentDataLocation = this.state.navigationDictionary[0][dictionaryId][0][
                navigationConfigId
            ].relativeDataLocation;
            const isLinkedDataContainer = type === DragDropItemType.linkedDataContainer;
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
        this.handleNavigationItemClick = (dictionaryId, navigationConfigId) => {
            let timer;
            let timesClicked = 0;
            return event => {
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
        this.handleNavigationItemSingleClick = (dictionaryId, navigationConfigId) => {
            this.triggerNavigationUpdate(dictionaryId, navigationConfigId);
        };
        /**
         * Allows editing of the active item
         */
        this.handleNavigationItemDoubleClick = (dictionaryId, navigationConfigId) => {
            if (this.isEditable(dictionaryId, navigationConfigId)) {
                this.triggerNavigationEdit();
            }
        };
        /**
         * Update the active items display text
         */
        this.handleNavigationItemChangeDisplayText = dictionaryId => {
            return e => {
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
        this.handleNavigationItemBlurDisplayTextInput = () => {
            return () => {
                this.setState({
                    activeItemEditable: false,
                });
            };
        };
        /**
         * Handles key up on the active items display text
         */
        this.handleNavigationItemKeyDownDisplayTextInput = () => {
            return e => {
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
        this.handleNavigationItemExpandClick = (dictionaryId, navigationConfigId) => {
            return () => {
                this.triggerExpandCollapse(dictionaryId, navigationConfigId);
            };
        };
        /**
         * Handles key up on a tree item
         */
        this.handleNavigationItemKeyDown = (dictionaryId, navigationConfigId) => {
            return e => {
                e.preventDefault();
                if (e.target === e.currentTarget) {
                    switch (e.keyCode) {
                        case keyCodeEnter:
                        case keyCodeSpace:
                            if (e.target === e.currentTarget) {
                                this.triggerExpandCollapse(
                                    dictionaryId,
                                    navigationConfigId
                                );
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
    render() {
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
    componentWillUnmount() {
        if (this.props.messageSystem !== undefined) {
            this.props.messageSystem.remove(this.messageSystemConfig);
        }
    }
    getActiveConfigIds(activeDictionaryId, activeNavigationConfigId) {
        if (this.state.expandedNavigationConfigItems[activeDictionaryId] === undefined) {
            return new Set([activeNavigationConfigId]);
        } else if (
            this.state.expandedNavigationConfigItems[activeDictionaryId].has(
                activeNavigationConfigId
            )
        ) {
            this.state.expandedNavigationConfigItems[activeDictionaryId].delete(
                activeNavigationConfigId
            );
            return this.state.expandedNavigationConfigItems[activeDictionaryId];
        }
        return this.state.expandedNavigationConfigItems[activeDictionaryId].add(
            activeNavigationConfigId
        );
    }
    renderDictionaryItem(dictionaryId, index) {
        if (dictionaryId !== null) {
            return this.renderNavigationConfig(
                dictionaryId,
                this.state.navigationDictionary[0][dictionaryId][1],
                index
            );
        }
        return null;
    }
    renderNavigationConfig(dictionaryId, navigationConfigId, index) {
        const isDictionaryLink =
            this.state.navigationDictionary[0][dictionaryId] !== undefined &&
            this.state.navigationDictionary[0][dictionaryId][1] === navigationConfigId;
        const isDraggable =
            isDictionaryLink && this.state.navigationDictionary[1] !== dictionaryId; // is linked data and not the root level item
        const isTriggerRenderable = this.shouldTriggerRender(
            dictionaryId,
            navigationConfigId
        );
        const content = this.renderContent(
            dictionaryId,
            navigationConfigId,
            isTriggerRenderable
        );
        const itemType = isDraggable
            ? DragDropItemType.linkedData
            : this.state.navigationDictionary[0][dictionaryId][0][navigationConfigId]
                  .schema[dictionaryLink]
            ? DragDropItemType.linkedDataContainer
            : DragDropItemType.default;
        const trigger = isTriggerRenderable
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
    renderTrigger(
        type,
        text,
        isCollapsible,
        isDraggable,
        isDroppable,
        dictionaryId,
        navigationConfigId,
        index
    ) {
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
    renderContent(dictionaryId, navigationConfigId, isTriggerRendered) {
        const navigationConfig = this.state.navigationDictionary[0][dictionaryId][0][
            navigationConfigId
        ];
        if (Array.isArray(navigationConfig.items) && navigationConfig.items.length > 0) {
            const content = navigationConfig.items.map(
                (navigationConfigItemId, index) => {
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
            const isEmpty =
                content.find(contentItem => {
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
    isEditable(dictionaryId, navigationConfigId) {
        return (
            this.state.activeDictionaryId === dictionaryId &&
            this.state.activeNavigationConfigId === navigationConfigId &&
            this.state.activeNavigationConfigId === ""
        );
    }
    shouldTriggerRender(dictionaryId, navigationConfigId) {
        return (
            !Array.isArray(this.props.types) ||
            this.props.types.includes(
                this.state.navigationDictionary[0][dictionaryId][0][navigationConfigId]
                    .type
            )
        );
    }
    getExpandedState(dictionaryId, navigationConfigId) {
        // assume this is the root level tree item if these are undefined
        if (dictionaryId === undefined && navigationConfigId === undefined) {
            if (this.state.navigationDictionary === null) {
                return false;
            }
            return (
                this.state.expandedNavigationConfigItems[
                    this.state.navigationDictionary[1]
                ] !== undefined &&
                this.state.expandedNavigationConfigItems[
                    this.state.navigationDictionary[1]
                ].has(
                    this.state.navigationDictionary[0][
                        this.state.navigationDictionary[1]
                    ][1]
                )
            );
        }
        return (
            this.state.expandedNavigationConfigItems[dictionaryId] !== undefined &&
            this.state.expandedNavigationConfigItems[dictionaryId].has(navigationConfigId)
        );
    }
    getUpdatedElementsExpanded(dictionaryId, navigationConfigId) {
        return Object.assign(
            Object.assign({}, this.state.expandedNavigationConfigItems),
            this.getParentElement(dictionaryId)
        );
    }
    getParentElement(dictionaryId) {
        if (this.state.dataDictionary[0][dictionaryId].parent) {
            let parentDictionaryItem =
                this.state.expandedNavigationConfigItems[dictionaryId] || new Set([""]);
            const parentDictionaryId = this.state.dataDictionary[0][dictionaryId].parent
                .id;
            const parentDictionaryItemDataLocations = new Set(
                this.state.dataDictionary[0][dictionaryId].parent.dataLocation.split(".")
            );
            return Object.assign(
                {
                    [parentDictionaryId]: new Set([
                        ...parentDictionaryItemDataLocations,
                        ...parentDictionaryItem,
                    ]),
                },
                this.getParentElement(parentDictionaryId)
            );
        }
        return {};
    }
    getDraggableItemClassName(
        isCollapsible,
        isDraggable,
        isDroppable,
        dictionaryId,
        navigationConfigId
    ) {
        let className = this.props.managedClasses.navigation_item;
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
    triggerExpandCollapse(dictionaryId, navigationConfigId) {
        this.setState({
            expandedNavigationConfigItems: Object.assign(
                Object.assign({}, this.state.expandedNavigationConfigItems),
                {
                    [dictionaryId]: this.getActiveConfigIds(
                        dictionaryId,
                        navigationConfigId
                    ),
                }
            ),
        });
    }
    triggerNavigationEdit() {
        this.setState({
            activeItemEditable: true,
        });
    }
    triggerNavigationUpdate(dictionaryId, navigationConfigId) {
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
    findCurrentTreeItemIndex(nodes, dictionaryId, navigationConfigId) {
        return nodes.findIndex(node => {
            return (
                node.dataset.dictionaryid === dictionaryId &&
                node.dataset.navigationconfigid === navigationConfigId
            );
        });
    }
    focusNextTreeItem(dictionaryId, navigationConfigId) {
        if (canUseDOM()) {
            const nodes = this.getTreeItemNodes();
            const currentIndex = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const nextIndex =
                currentIndex !== -1 && currentIndex !== nodes.length - 1
                    ? currentIndex + 1
                    : nodes.length - 1;
            nodes[nextIndex].focus();
        }
    }
    focusPreviousTreeItem(dictionaryId, navigationConfigId) {
        if (canUseDOM()) {
            const nodes = this.getTreeItemNodes();
            const currentIndex = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const previousIndex =
                currentIndex !== -1 && currentIndex !== 0 ? currentIndex - 1 : 0;
            nodes[previousIndex].focus();
        }
    }
    focusFirstTreeItem() {
        if (canUseDOM()) {
            const nodes = this.getTreeItemNodes();
            nodes[0].focus();
        }
    }
    focusLastTreeItem() {
        if (canUseDOM()) {
            const nodes = this.getTreeItemNodes();
            nodes[nodes.length - 1].focus();
        }
    }
    focusAndOpenTreeItems(dictionaryId, navigationConfigId) {
        if (canUseDOM()) {
            const nodes = this.getTreeItemNodes();
            const currentIndex = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const ariaExpanded = get(
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
    focusAndCloseTreeItems(dictionaryId, navigationConfigId) {
        if (canUseDOM()) {
            const nodes = this.getTreeItemNodes();
            const currentIndex = this.findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const ariaExpanded = get(
                nodes[currentIndex],
                'parentElement.parentElement.attributes["aria-expanded"].value'
            );
            if (nodes[currentIndex].tagName === "A") {
                const parent = get(
                    nodes[currentIndex],
                    "parentElement.parentElement.parentElement.parentElement.firstChild"
                );
                if (parent) {
                    parent.querySelector("[data-dictionaryid]").focus();
                }
            } else if (ariaExpanded === "false" && nodes[currentIndex - 1]) {
                nodes[currentIndex - 1].focus();
            } else if (ariaExpanded === "true") {
                this.triggerExpandCollapse(dictionaryId, navigationConfigId);
                this.triggerNavigationUpdate(dictionaryId, navigationConfigId);
            }
        }
    }
    getTreeItemNodes() {
        const nodes = Array.from(
            this.rootElement.current.querySelectorAll(
                "div[role='treeitem'] > a, div[role='treeitem'] > span > [data-dictionaryid]"
            )
        );
        return nodes.filter(node => node.offsetParent !== null);
    }
}
Navigation.displayName = "Navigation";
Navigation.defaultProps = {
    managedClasses: {},
    messageSystem: void 0,
};
export { Navigation };
export default manageJss(styles)(Navigation);
