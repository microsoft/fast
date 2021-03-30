import {customElement, DOM, FASTElement, $global, attr, observable} from '@microsoft/fast-element';
import { htmlMapper, htmlResolver, mapDataDictionary, ResolverConfig } from '../../data-utilities/mapping';
import { WebComponentDefinition, WebComponentDefinitionTag } from '../../data-utilities/web-component';
import { DataDictionary, MessageSystem, MessageSystemType, SchemaDictionary } from '../../message-system';
import {HTMLRenderTemplate} from './html-render.template';
import { nativeElementDefinitions } from '../../../../../../sites/site-utilities/src/definitions';
import { doc } from 'prettier';

@customElement({
    name: 'fast-tooling-html-render', 
    template: HTMLRenderTemplate
})
export class HTMLRender extends FASTElement
{

    private dataDictionary: DataDictionary<unknown>;

    private schemaDictionary: SchemaDictionary;

    @observable
    public markup: HTMLElement;

    @observable
    public messageSystem: MessageSystem;
    private messageSystemChanged(): void
    {
        if (this.messageSystem !== undefined) {
            this.messageSystem.add({onMessage: this.handleMessageSystem});
        }
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
    }
    
    // private markupPolicy = $global.trustedTypes.createPolicy('markupPolicy',{
    //     createHTML: html => html
    // });

    connectedCallback()
    {
        super.connectedCallback();
//        DOM.setHTMLPolicy(this.markupPolicy);
    }

    public RenderMarkup(): void
    {
        this.markup = mapDataDictionary({
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
            resolver: this.renderHtmlResolver
        });
        console.log(this.markup);
    }

    private clickHandler(e:MouseEvent): boolean
    {
        console.log("click", e);
        e.stopPropagation();
        return false;
    }

    private renderHtmlResolver(config: ResolverConfig<any>): HTMLElement | Text
    {
        htmlResolver(config);
        let wrapper = document.createElement("div");
        wrapper.id = config.dictionaryId;
        wrapper.className = "wrap";
        wrapper.addEventListener("click", this.clickHandler);
        if(config.dataDictionary[0][config.dictionaryId].parent !== undefined)
        {
            let parentid = config.dataDictionary[0][config.dictionaryId].parent.id;
            config.dataDictionary[0][parentid].data.childNodes.forEach((value)=>wrapper.appendChild(value));
            config.dataDictionary[0][parentid].data.prepend(wrapper);
        }
        else
        {
            wrapper.appendChild(config.dataDictionary[0][config.dictionaryId].data);
            config.dataDictionary[0][config.dictionaryId].data = wrapper;
        }
        return config.dataDictionary[0][config.dictionaryId].data;
    }
}

