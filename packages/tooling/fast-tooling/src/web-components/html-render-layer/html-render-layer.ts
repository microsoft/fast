import { observable } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import {
    DataDictionary,
    MessageSystem,
    MessageSystemType,
    SchemaDictionary,
} from "../../message-system";

export enum ActivityType {
    hover = "hover",
    blur = "blur",
    click = "click",
    clear = "clear",
    doubleClick = "dblclick",
}

export class OverylayPosition {
    public top: number;
    public left: number;
    public width: number;
    public height: number;

    constructor(top: number, left: number, width: number, height: number) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}

export abstract class HTMLRenderLayer extends FoundationElement {
    public dataDictionary: DataDictionary<unknown>;

    public schemaDictionary: SchemaDictionary;

    @observable
    public messageSystem: MessageSystem;
    private messageSystemChanged(): void {
        if (this.messageSystem !== undefined) {
            this.messageSystem.add({ onMessage: this.handleMessageSystem });
        }
    }

    protected handleMessageSystem = (e: MessageEvent): void => {
        if (e.data) {
            if (
                e.data.type === MessageSystemType.initialize ||
                e.data.type === MessageSystemType.data
            ) {
                this.dataDictionary = e.data.dataDictionary;
                this.schemaDictionary = e.data.schemaDictionary;
            }
        }
    };

    public abstract elementActivity(
        activityType: ActivityType,
        datadictionaryId: string,
        elementRef: HTMLElement
    );
}
