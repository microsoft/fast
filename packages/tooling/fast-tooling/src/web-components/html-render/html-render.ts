import { customElement, FASTElement, observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import {
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
    ResolverConfig,
} from "../../data-utilities/mapping";
import {
    WebComponentDefinition,
    WebComponentDefinitionTag,
} from "../../data-utilities/web-component";
import {
    DataDictionary,
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    SchemaDictionary,
} from "../../message-system";
import { ActivityType, HTMLRenderLayer, HTMLRenderLayerCallbackType } from "../html-render-layer/html-render-layer";
import { HTMLRenderStyles } from "./html-render.styles";
import { HTMLRenderTemplate } from "./html-render.template";

export const HTMLRenderOriginatorId = "fast-tooling::html-renderer";

@customElement({
    name: "fast-tooling-html-render",
    template: HTMLRenderTemplate,
    styles: HTMLRenderStyles,
})
export class HTMLRender extends FASTElement {

    private layerActivityId: string = "HTMLRender";

    private dataDictionary: DataDictionary<unknown>;

    private schemaDictionary: SchemaDictionary;

    private messageOriginatorId: string = HTMLRenderOriginatorId;

    private dataDictionaryAttr: string = "data-datadictionaryid";

    private tabCounter: number = 1;

    private currentElement: HTMLElement;

    private activeDictionaryId: string = "";

    private renderLayers: HTMLRenderLayer[] = [];

    @observable
    public markup: HTMLElement;

    @observable
    public markupDefinitions: WebComponentDefinition[] = null;

    @observable
    public layers: HTMLSlotElement;
    private layersChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            this.renderLayers = [];
            if (this.children.length > 0) {
                Array.from(this.children).forEach((value: HTMLRenderLayer) => {
                    if (this.isHtmlRenderLayer(value)) {
                        value.messageSystem = this.messageSystem;
                        value.activityCallback = this.layerCallback;
                        this.renderLayers.push(value);
                    }
                });
            }
        }
    }

    @observable
    public messageSystem: MessageSystem;
    private messageSystemChanged(): void {
        if (this.messageSystem !== undefined) {
            this.tabCounter = 1;
            this.messageSystem.add({ onMessage: this.handleMessageSystem });
            this.renderLayers.forEach((value: HTMLRenderLayer) => {
                value.messageSystem = this.messageSystem;
            });
        }
    }

    // Messaging

    private handleMessageSystem = (e: MessageEvent): void => {
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
                this.updateLayers(this.layerActivityId, ActivityType.clear, "", null, null);
                this.renderMarkup();
                if (e.data.activeDictionaryId) {
                    this.activeDictionaryId = e.data.activeDictionaryId;
                    // give everything time to actually render
                    window.setTimeout(this.selectActiveDictionaryId, 50);
                }
            }
            if (
                e.data.type === MessageSystemType.navigation &&
                (!e.data.options ||
                    e.data.options.originatorId !== this.messageOriginatorId)
            ) {
                if (e.data.action === MessageSystemNavigationTypeAction.update) {
                    this.activeDictionaryId = e.data.activeDictionaryId;
                    const el: HTMLElement = this.shadowRoot.querySelector(
                        "[" +
                            this.dataDictionaryAttr +
                            "=" +
                            this.activeDictionaryId +
                            "]"
                    );
                    if (el) {
                        this.currentElement = el;
                        this.updateLayers(
                            this.layerActivityId, 
                            ActivityType.click,
                            this.activeDictionaryId,
                            el,
                            null
                        );
                    }
                }
            }
        }
    };

    private selectActiveDictionaryId = () => {
        const el: HTMLElement = this.shadowRoot.querySelector(
            "[" + this.dataDictionaryAttr + "=" + this.activeDictionaryId + "]"
        );
        if (el) {
            this.currentElement = el;
            this.updateLayers(
                this.layerActivityId, 
                ActivityType.click,
                this.activeDictionaryId,
                this.currentElement,
                null
            );
        }
    };

    private updateLayers(
        layerActivityId: string,
        activityType: ActivityType,
        dictionaryId: string,
        elementRef: HTMLElement,
        event: Event
    ) {
        if (this.renderLayers) {
            this.renderLayers.forEach(value => {
                value.elementActivity(layerActivityId, activityType, dictionaryId, elementRef, event);
            });
        }
    }

    private layerCallback = (layerActivityId: string) =>
    {
        this.updateLayers(layerActivityId, ActivityType.update, "", null, null);
    }

    /// Mouse Handlers

    private getTargetElementFromMouseEvent(e: MouseEvent) {
        let pathIndex = 0;
        const path: EventTarget[] = e.composedPath();
        let el: HTMLElement = path[pathIndex] as HTMLElement;
        let dataId = el.getAttribute(this.dataDictionaryAttr);
        while (dataId === null && pathIndex < path.length) {
            el = path[pathIndex++] as HTMLElement;
            if (el.getAttribute) {
                dataId = el.getAttribute(this.dataDictionaryAttr);
            }
        }
        return { dataId, el };
    }

    public hoverHandler(e: MouseEvent): boolean {
        const targetEl = this.getTargetElementFromMouseEvent(e);
        if (
            targetEl.dataId !== null &&
            !(
                this.currentElement &&
                targetEl.dataId ===
                    this.currentElement.getAttribute(this.dataDictionaryAttr)
            )
        ) {
            this.updateLayers(this.layerActivityId, ActivityType.hover, targetEl.dataId, targetEl.el, null);
        }
        return false;
    }

    public blurHandler(e: MouseEvent): boolean {
        this.updateLayers(this.layerActivityId, ActivityType.blur, "", null, null);
        return false;
    }

    private selectElement(el: HTMLElement, dataId: string) {
        this.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: dataId,
            options: {
                originatorId: this.messageOriginatorId,
            },
            activeNavigationConfigId: "",
        });
        this.currentElement = el;
        this.updateLayers(this.layerActivityId, ActivityType.click, dataId, el, null);
    }

    private clearElement() {
        this.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: "",
            options: {
                originatorId: this.messageOriginatorId,
            },
            activeNavigationConfigId: "",
        });
        this.currentElement = null;
        this.updateLayers(this.layerActivityId, ActivityType.clear, "", null, null);
    }

    public clickHandler(e: MouseEvent): boolean {
        const targetEl = this.getTargetElementFromMouseEvent(e);
        if (targetEl.dataId !== null) {
            this.selectElement(targetEl.el, targetEl.dataId);
            e.stopPropagation();
            return false;
        }
    }

    public dblClickHandler(e: MouseEvent): boolean {
        const targetEl = this.getTargetElementFromMouseEvent(e);
        if (targetEl.dataId !== null && this.dataDictionary[0][targetEl.dataId].data["Slot"].length>0) {
            const newDataId: string = this.dataDictionary[0][targetEl.dataId].data["Slot"][0].id;
            this.messageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: newDataId,
                options: {
                    originatorId: this.messageOriginatorId,
                },
                activeNavigationConfigId: "",
            });
    
            this.updateLayers(this.layerActivityId, ActivityType.doubleClick, newDataId, targetEl.el, e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    public keyUpHandler(e: KeyboardEvent): boolean {
        if (e.key === "Tab") {
            const currTab: number = this.currentElement
                ? Number(this.currentElement.getAttribute("taborder"))
                : e.shiftKey
                ? 0
                : this.tabCounter;
            const nextTab: number = e.shiftKey ? currTab + 1 : currTab - 1;

            if (nextTab > 0 && nextTab < this.tabCounter) {
                const tabElements: Array<Element> = Array.from(
                    (e.composedPath()[0] as HTMLElement).getElementsByTagName("*")
                );
                tabElements.every((el: HTMLElement) => {
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
                (e.composedPath()[0] as HTMLElement).blur();
            }
        }
        return true;
    }

    public keyDownHandler(e: KeyboardEvent): boolean {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    public containerClickHandler(e: MouseEvent): boolean {
        this.clearElement();
        e.stopPropagation();
        return false;
    }

    /// Render

    private renderHtmlResolver = (config: ResolverConfig<any>): HTMLElement | Text => {
        htmlResolver(config);
        if (
            (config.dataDictionary[0][config.dictionaryId].data as HTMLElement)
                .setAttribute
        ) {
            (config.dataDictionary[0][config.dictionaryId]
                .data as HTMLElement).setAttribute(
                this.dataDictionaryAttr,
                config.dictionaryId
            );
            (config.dataDictionary[0][config.dictionaryId]
                .data as HTMLElement).setAttribute(
                "taborder",
                (this.tabCounter++).toString()
            );
        }
        return config.dataDictionary[0][config.dictionaryId].data;
    };

    public renderMarkup(): void {
        if (this.markupDefinitions !== null) {
            this.markup = mapDataDictionary({
                dataDictionary: this.dataDictionary,
                schemaDictionary: this.schemaDictionary,
                mapper: htmlMapper({
                    version: 1,
                    tags: Object.entries({
                        ...this.markupDefinitions,
                    }).reduce(
                        (
                            previousValue: WebComponentDefinitionTag[],
                            currentValue: [string, WebComponentDefinition]
                        ) => {
                            if (Array.isArray(currentValue[1].tags)) {
                                return previousValue.concat(currentValue[1].tags);
                            }

                            return previousValue;
                        },
                        []
                    ),
                }),
                resolver: this.renderHtmlResolver,
            });
        }
    }

    private isHtmlRenderLayer(el: Element): el is HTMLElement {
        return (
            isHTMLElement(el) && (el.getAttribute("role") as string) === "htmlrenderlayer"
        );
    }
}
