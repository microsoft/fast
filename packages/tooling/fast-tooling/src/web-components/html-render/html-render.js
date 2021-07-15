var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "@microsoft/fast-foundation";
import {
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
} from "../../data-utilities/mapping";
import {
    MessageSystemNavigationTypeAction,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemType,
} from "../../message-system";
import { ActivityType } from "../html-render-layer/html-render-layer";
export const HTMLRenderOriginatorId = "fast-tooling::html-renderer";
export class HTMLRender extends FoundationElement {
    constructor() {
        super(...arguments);
        this.layerActivityId = "HTMLRender";
        this.messageOriginatorId = HTMLRenderOriginatorId;
        this.dataDictionaryAttr = "data-datadictionaryid";
        this.tabCounter = 1;
        this.activeDictionaryId = "";
        this.renderLayers = [];
        this.interactiveMode = true;
        this.markupDefinitions = null;
        // Messaging
        this.selectTimeout = null;
        this.handleMessageSystem = e => {
            if (e.data) {
                if (
                    (e.data.type === MessageSystemType.initialize ||
                        e.data.type === MessageSystemType.data) &&
                    (!e.data.options ||
                        e.data.options.originatorId !== this.messageOriginatorId)
                ) {
                    this.dataDictionary = e.data.dataDictionary;
                    this.schemaDictionary = e.data.schemaDictionary;
                    this.currentElement = null;
                    this.updateLayers(
                        this.layerActivityId,
                        ActivityType.clear,
                        "",
                        null,
                        null
                    );
                    this.renderMarkup();
                    if (e.data.activeDictionaryId) {
                        this.activeDictionaryId = e.data.activeDictionaryId;
                        // give everything time to actually render
                        if (this.selectTimeout) {
                            window.clearTimeout(this.selectTimeout);
                        }
                        this.selectTimeout = window.setTimeout(
                            this.selectActiveDictionaryId,
                            50
                        );
                    }
                }
                if (
                    e.data.type === MessageSystemType.navigation &&
                    (!e.data.options ||
                        e.data.options.originatorId !== this.messageOriginatorId)
                ) {
                    if (e.data.action === MessageSystemNavigationTypeAction.update) {
                        this.activeDictionaryId = e.data.activeDictionaryId;
                        if (this.selectTimeout) {
                            window.clearTimeout(this.selectTimeout);
                        }
                        this.selectTimeout = window.setTimeout(
                            this.selectActiveDictionaryId,
                            50
                        );
                    }
                }
                if (
                    e.data.type === MessageSystemType.custom &&
                    e.data.options &&
                    e.data.options.originatorId !== this.messageOriginatorId
                ) {
                    const action = e.data.options.action.split("::");
                    if (action[0] === "displayMode") {
                        this.interactiveMode = action[1] !== "preview";
                        if (this.interactiveMode) {
                            this.updateLayers(
                                this.layerActivityId,
                                ActivityType.releaseFocus,
                                null,
                                null,
                                null
                            );
                            // give everything time to update positions
                            if (this.selectTimeout) {
                                window.clearTimeout(this.selectTimeout);
                            }
                            this.selectTimeout = window.setTimeout(
                                this.selectActiveDictionaryId,
                                100
                            );
                        } else {
                            this.updateLayers(
                                this.layerActivityId,
                                ActivityType.clear,
                                "",
                                null,
                                null
                            );
                            this.updateLayers(
                                this.layerActivityId,
                                ActivityType.takeFocus,
                                null,
                                null,
                                null
                            );
                        }
                    }
                }
                if (
                    e.data.type === MessageSystemType.schemaDictionary &&
                    (!e.data.options ||
                        e.data.options.originatorId !== this.messageOriginatorId)
                ) {
                    if (e.data.action === MessageSystemSchemaDictionaryTypeAction.add) {
                        this.schemaDictionary = e.data.schemaDictionary;
                    }
                }
            }
        };
        this.selectActiveDictionaryId = () => {
            this.selectTimeout = null;
            let el = this.shadowRoot.querySelector(
                `[${this.dataDictionaryAttr}=${this.activeDictionaryId}]`
            );
            while (!el && this.dataDictionary[0][this.activeDictionaryId].parent) {
                this.activeDictionaryId = this.dataDictionary[0][
                    this.activeDictionaryId
                ].parent.id;
                el = this.shadowRoot.querySelector(
                    `[${this.dataDictionaryAttr}=${this.activeDictionaryId}]`
                );
            }
            if (el) {
                this.currentElement = el;
                if (this.interactiveMode) {
                    this.updateLayers(
                        this.layerActivityId,
                        ActivityType.click,
                        this.activeDictionaryId,
                        this.currentElement,
                        null
                    );
                }
            }
        };
        this.layerCallback = (layerActivityId, activityType) => {
            this.updateLayers(layerActivityId, activityType, "", null, null);
        };
        /// Render
        this.renderHtmlResolver = config => {
            htmlResolver(config);
            if (config.dataDictionary[0][config.dictionaryId].data.setAttribute) {
                config.dataDictionary[0][config.dictionaryId].data.setAttribute(
                    this.dataDictionaryAttr,
                    config.dictionaryId
                );
                config.dataDictionary[0][config.dictionaryId].data.setAttribute(
                    "taborder",
                    (this.tabCounter++).toString()
                );
            }
            return config.dataDictionary[0][config.dictionaryId].data;
        };
    }
    layersChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.renderLayers = [];
            if (this.children.length > 0) {
                Array.from(this.children).forEach(value => {
                    if (this.isHtmlRenderLayer(value)) {
                        value.messageSystem = this.messageSystem;
                        value.activityCallback = this.layerCallback;
                        this.renderLayers.push(value);
                    }
                });
            }
        }
    }
    messageSystemChanged() {
        if (this.messageSystem !== undefined) {
            this.tabCounter = 1;
            this.messageSystem.add({ onMessage: this.handleMessageSystem });
            this.renderLayers.forEach(value => {
                value.messageSystem = this.messageSystem;
            });
        }
    }
    updateLayers(layerActivityId, activityType, dictionaryId, elementRef, event) {
        if (this.renderLayers) {
            this.renderLayers.forEach(value => {
                value.elementActivity(
                    layerActivityId,
                    activityType,
                    dictionaryId,
                    elementRef,
                    event
                );
            });
        }
    }
    /// Mouse Handlers
    getTargetElementFromMouseEvent(e) {
        let pathIndex = 0;
        const path = e.composedPath();
        let el = path[pathIndex];
        let dataId = el.getAttribute(this.dataDictionaryAttr);
        while (dataId === null && pathIndex < path.length) {
            el = path[pathIndex++];
            if (el.getAttribute) {
                dataId = el.getAttribute(this.dataDictionaryAttr);
            }
        }
        return { dataId, el };
    }
    hoverHandler(e) {
        if (!this.interactiveMode) {
            return true;
        }
        const targetEl = this.getTargetElementFromMouseEvent(e);
        if (
            targetEl.dataId !== null &&
            !(
                this.currentElement &&
                targetEl.dataId ===
                    this.currentElement.getAttribute(this.dataDictionaryAttr)
            )
        ) {
            this.updateLayers(
                this.layerActivityId,
                ActivityType.hover,
                targetEl.dataId,
                targetEl.el,
                null
            );
        }
        return false;
    }
    blurHandler(e) {
        if (!this.interactiveMode) {
            return true;
        }
        this.updateLayers(this.layerActivityId, ActivityType.blur, "", null, null);
        return false;
    }
    selectElement(el, dataId) {
        this.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: dataId,
            options: {
                originatorId: this.messageOriginatorId,
            },
            activeNavigationConfigId: "",
        });
        this.activeDictionaryId = dataId;
        this.currentElement = el;
        this.updateLayers(this.layerActivityId, ActivityType.click, dataId, el, null);
    }
    clearElement() {
        this.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: "",
            options: {
                originatorId: this.messageOriginatorId,
            },
            activeNavigationConfigId: "",
        });
        this.activeDictionaryId = null;
        this.currentElement = null;
        this.updateLayers(this.layerActivityId, ActivityType.clear, "", null, null);
    }
    clickHandler(e) {
        if (!this.interactiveMode) {
            return true;
        }
        const targetEl = this.getTargetElementFromMouseEvent(e);
        if (targetEl.dataId !== null) {
            this.selectElement(targetEl.el, targetEl.dataId);
            e.stopPropagation();
            return false;
        }
    }
    dblClickHandler(e) {
        if (!this.interactiveMode) {
            return true;
        }
        // Get the element of the double click event
        const targetEl = this.getTargetElementFromMouseEvent(e);
        if (
            targetEl.dataId !== null &&
            this.dataDictionary[0][targetEl.dataId].data["Slot"] &&
            this.dataDictionary[0][targetEl.dataId].data["Slot"].length > 0
        ) {
            let textNode = null;
            let childIndex = -1;
            // Find the actuall text node that was double clicked
            if (targetEl.el.childNodes.length > 0) {
                let i = 0;
                while (i < targetEl.el.childNodes.length && textNode === null) {
                    if (targetEl.el.childNodes[i].nodeType === 3) {
                        const range = document.createRange();
                        range.selectNode(targetEl.el.childNodes[i]);
                        const rect = range.getBoundingClientRect();
                        if (
                            e.clientX >= rect.left &&
                            e.clientX <= rect.right &&
                            e.clientY >= rect.top &&
                            e.clientY <= rect.bottom
                        ) {
                            textNode = targetEl.el.childNodes[i];
                            childIndex = i;
                        }
                    }
                    i++;
                }
            }
            if (childIndex === -1) {
                return false;
            }
            // The childNode index should be the same as the dictionary index.
            const newDataId = this.dataDictionary[0][targetEl.dataId].data["Slot"][
                childIndex
            ].id;
            // Navigate to the text node
            this.messageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: newDataId,
                options: {
                    originatorId: this.messageOriginatorId,
                },
                activeNavigationConfigId: "",
            });
            // Update the layers
            this.updateLayers(
                this.layerActivityId,
                ActivityType.doubleClick,
                newDataId,
                textNode,
                e
            );
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    keyUpHandler(e) {
        if (!this.interactiveMode) {
            return true;
        }
        if (e.key === "Tab") {
            const currTab = this.currentElement
                ? Number(this.currentElement.getAttribute("taborder"))
                : e.shiftKey
                ? 0
                : this.tabCounter;
            const nextTab = e.shiftKey ? currTab + 1 : currTab - 1;
            if (nextTab > 0 && nextTab < this.tabCounter) {
                const tabElements = Array.from(
                    e.composedPath()[0].getElementsByTagName("*")
                );
                tabElements.every(el => {
                    if (Number(el.getAttribute("taborder")) === nextTab) {
                        const dataId = el.getAttribute(this.dataDictionaryAttr);
                        this.selectElement(el, dataId);
                        return false;
                    }
                    return true;
                });
                e.preventDefault();
                e.stopPropagation();
                return false;
            } else {
                this.clearElement();
                e.composedPath()[0].blur();
            }
        }
        return true;
    }
    keyDownHandler(e) {
        if (!this.interactiveMode) {
            return true;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    containerClickHandler(e) {
        if (!this.interactiveMode) {
            return true;
        }
        this.clearElement();
        e.stopPropagation();
        return false;
    }
    renderMarkup() {
        if (this.markupDefinitions !== null) {
            this.markup = mapDataDictionary({
                dataDictionary: this.dataDictionary,
                schemaDictionary: this.schemaDictionary,
                mapper: htmlMapper({
                    version: 1,
                    tags: Object.entries(
                        Object.assign({}, this.markupDefinitions)
                    ).reduce((previousValue, currentValue) => {
                        if (Array.isArray(currentValue[1].tags)) {
                            return previousValue.concat(currentValue[1].tags);
                        }
                        return previousValue;
                    }, []),
                }),
                resolver: this.renderHtmlResolver,
            });
        }
    }
    isHtmlRenderLayer(el) {
        return isHTMLElement(el) && el.getAttribute("role") === "htmlrenderlayer";
    }
}
__decorate([observable], HTMLRender.prototype, "interactiveMode", void 0);
__decorate([observable], HTMLRender.prototype, "markup", void 0);
__decorate([observable], HTMLRender.prototype, "markupDefinitions", void 0);
__decorate([observable], HTMLRender.prototype, "layers", void 0);
__decorate([observable], HTMLRender.prototype, "messageSystem", void 0);
