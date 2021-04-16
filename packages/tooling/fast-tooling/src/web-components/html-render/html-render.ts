import {
    customElement,
    FASTElement,
    observable,
} from "@microsoft/fast-element";
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
import { HTMLRenderStyles } from "./html-render.styles";
import { HTMLRenderTemplate } from "./html-render.template";
//import { nativeElementDefinitions } from "../../../../../../sites/site-utilities/src/definitions";

class OverylayPosition {
    public top: number;
    public left: number;
    public width: number;
    public height: number;

    constructor(top:number, left:number, width:number, height:number){
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}

@customElement({
    name: "fast-tooling-html-render",
    template: HTMLRenderTemplate,
    styles: HTMLRenderStyles
})
export class HTMLRender extends FASTElement {
    private dataDictionary: DataDictionary<unknown>;

    private schemaDictionary: SchemaDictionary;

    private navigationConfigId:string = "fast-tooling::html-renderer";

    private dataDictionaryAttr:string = "data-datadictionaryid";

    private tabCounter:number = 1;

    private currentElement:HTMLElement;

    @observable
    public markup: HTMLElement;

    @observable
    public messageSystem: MessageSystem;
    private messageSystemChanged(): void {
        if (this.messageSystem !== undefined) {
            this.tabCounter = 1;
            this.messageSystem.add({ onMessage: this.handleMessageSystem });
        }
    }

    @observable
    public hoverPosition: OverylayPosition = new OverylayPosition(0,0,0,0);

    @observable
    public clickPosition: OverylayPosition = new OverylayPosition(0,0,0,0);

    @observable
    public hoverClassName: string = "";

    @observable
    public clickClassName: string = "";

    @observable
    public clickPillContent: string = "";

    @observable
    public hoverPillContent: string = "";

    connectedCallback() {
        super.connectedCallback();
    }

    private handleMessageSystem = (e: MessageEvent): void => {
        if (e.data) {
            if (
                e.data.type === MessageSystemType.initialize ||
                e.data.type === MessageSystemType.data
            ) {
                this.dataDictionary = e.data.dataDictionary;
                this.schemaDictionary = e.data.schemaDictionary;
                this.RenderMarkup();
            }
        }
    };

    /// Mouse Handlers

    private GetPositionFromElement(target: HTMLElement): OverylayPosition
    {
        const pos: DOMRectList = target.getClientRects();
        return new OverylayPosition(pos[0].top, pos[0].left, pos[0].width, pos[0].height);
    }

    public hoverHandler(e: MouseEvent): boolean {
        const el:HTMLElement = (e.composedPath()[0] as HTMLElement);
        const dataId = el.getAttribute(this.dataDictionaryAttr);
        if(dataId !== null && !(this.currentElement && dataId === this.currentElement.getAttribute(this.dataDictionaryAttr)))
        {
            this.hoverPosition = this.GetPositionFromElement(el);
            this.hoverPillContent = dataId;
            this.hoverClassName = "active";
        }
        return false;
    }

    public blurHandler(e: MouseEvent): boolean {
        this.hoverClassName = "";
        return false;
    }

    private selectElement(el:HTMLElement, dataId:string)
    {

        this.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: dataId,
            activeNavigationConfigId: this.navigationConfigId
        });

        this.clickPosition = this.GetPositionFromElement(el);
        this.clickClassName = "active";
        this.clickPillContent = dataId;
        this.hoverClassName = "";
        this.currentElement = el;
    }

    private clearElement()
    {
        this.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: '',
            activeNavigationConfigId: this.navigationConfigId
        });

        this.clickClassName = "";
        this.currentElement = null;
    }

    public clickHandler(e: MouseEvent): boolean {
        const el:HTMLElement = (e.composedPath()[0] as HTMLElement);
        const dataId = el.getAttribute(this.dataDictionaryAttr);
        if(dataId!==null)
        {
            this.selectElement(el, dataId);
            e.stopPropagation();
            return false;
        }
    }

    public keyUpHandler(e: KeyboardEvent): boolean {
        if(e.key==="Tab")
        {
            const currTab:number = this.currentElement ? Number(this.currentElement.getAttribute("taborder")) : e.shiftKey ? this.tabCounter : 0;
            const nextTab:number = e.shiftKey ? currTab-1 : currTab+1;

            if(nextTab > 0 && nextTab < this.tabCounter)
            {
                let tabElements:Array<Element> = Array.from((e.composedPath()[0] as HTMLElement).getElementsByTagName("*"));
                tabElements.every((el:HTMLElement)=>{
                    if(Number(el.getAttribute("taborder"))===nextTab)
                    {
                        const dataId = el.getAttribute(this.dataDictionaryAttr);
                        this.selectElement(el, dataId);
                        return false;
                    }
                    return true;
                });
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            else
            {
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
        if((config.dataDictionary[0][config.dictionaryId].data as HTMLElement).setAttribute)
        {
            (config.dataDictionary[0][config.dictionaryId].data as HTMLElement).setAttribute(this.dataDictionaryAttr, config.dictionaryId);
            (config.dataDictionary[0][config.dictionaryId].data as HTMLElement).setAttribute("taborder", (this.tabCounter++).toString());
            (config.dataDictionary[0][config.dictionaryId].data as HTMLElement).className += "foo";
        }
        return config.dataDictionary[0][config.dictionaryId].data;
    }; 

    public RenderMarkup(): void {
/*         this.markup = mapDataDictionary({
           dataDictionary: this.dataDictionary,
           schemaDictionary: this.schemaDictionary,
           mapper: htmlMapper({
               version: 1,
               tags: Object.entries({
                   ...nativeElementDefinitions,
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
