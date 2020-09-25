import {
    InitializeMessageIncoming,
    MessageSystemType,
    SchemaDictionary,
} from "../message-system";
import { DataDictionary } from "../message-system";
import { LinkedData, Parent } from "../";
import { mapDataDictionaryToMonacoEditorHTML } from "./monaco";
import {
    MessageSystemUtility,
    MessageSystemUtilityConfig,
} from "./message-system-utility";
import {
    MonacoAdaptorAction,
    MonacoAdaptorActionCallbackConfig,
} from "./monaco-adaptor-action";
import { mapVSCodeParsedHTMLToDataDictionary } from "./mapping.vscode-html-languageservice";

export type actionCallback = () => void;

export interface ExtendedParent extends Parent {
    /**
     * The current dictionary ID this parent refers to
     */
    currentId: string;

    /**
     * The linked data index in the parent
     */
    linkedDataIndex: number;
}

const monacoAdaptorId: string = "monaco-adaptor";

export function findDictionaryIdParents(
    dictionaryId: string,
    dataDictionary: DataDictionary<unknown>,
    parents: ExtendedParent[] = []
): ExtendedParent[] {
    if (
        dataDictionary[0][dictionaryId].parent &&
        dataDictionary[0][dictionaryId].parent.id
    ) {
        const parent = dataDictionary[0][dictionaryId].parent;

        parents.unshift({
            ...parent,
            currentId: dictionaryId,
            linkedDataIndex: dataDictionary[0][parent.id].data[
                parent.dataLocation
            ].findIndex((dictionaryItem: LinkedData) => {
                return dictionaryItem.id === dictionaryId;
            }),
        });

        findDictionaryIdParents(parent.id, dataDictionary, parents);
    }

    return parents;
}

export function findUpdatedDictionaryId(
    parents: ExtendedParent[],
    dataDictionary: DataDictionary<unknown>,
    dictionaryId: string = dataDictionary[1]
): string {
    if (parents.length === 0) {
        return dictionaryId;
    }

    const dataLocation = parents[0].dataLocation;
    const linkedDataIndex = parents[0].linkedDataIndex;

    if (
        !dataDictionary[0][dictionaryId].data ||
        !dataDictionary[0][dictionaryId].data[dataLocation] ||
        !dataDictionary[0][dictionaryId].data[dataLocation][linkedDataIndex] ||
        typeof dataDictionary[0][dictionaryId].data[dataLocation][linkedDataIndex].id !==
            "string"
    ) {
        return dictionaryId;
    }

    const newDictionaryId =
        dataDictionary[0][dictionaryId].data[dataLocation][linkedDataIndex].id;
    parents.shift();

    return findUpdatedDictionaryId(parents, dataDictionary, newDictionaryId);
}

export class MonacoAdaptor extends MessageSystemUtility<
    MonacoAdaptorActionCallbackConfig
> {
    private monacoModelValue: string[];
    private schemaDictionary: SchemaDictionary;
    private dataDictionary: DataDictionary<unknown>;
    private dictionaryId: string;

    constructor(config: MessageSystemUtilityConfig<MonacoAdaptorActionCallbackConfig>) {
        super();

        this.registerMessageSystem(config);
        this.addConfigToActions();
    }

    /**
     * Handles messages from the message system
     */
    handleMessageSystem = (e: MessageEvent): void => {
        switch (e.data.type) {
            case MessageSystemType.initialize:
                this.dictionaryId = e.data.activeDictionaryId;
                this.dataDictionary = e.data.dataDictionary;

                if (!e.data.options || e.data.options.from !== monacoAdaptorId) {
                    this.schemaDictionary = e.data.schemaDictionary;
                    this.monacoModelValue = [
                        mapDataDictionaryToMonacoEditorHTML(
                            e.data.dataDictionary,
                            e.data.schemaDictionary
                        ),
                    ];
                    this.registeredActions.forEach((action: MonacoAdaptorAction) => {
                        if (action.matches(e.data.type)) {
                            action.invoke();
                        }
                    });
                }
                break;
            case MessageSystemType.navigation:
                this.dictionaryId = e.data.activeDictionaryId;
                break;
        }
    };

    /**
     * Gets the action config
     */
    getActionConfig = (
        messageSystemType: MessageSystemType
    ): MonacoAdaptorActionCallbackConfig => {
        return {
            getMonacoModelValue: this.getMonacoModelValue,
            updateMonacoModelValue: this.updateMonacoModelValue,
            messageSystemType,
        };
    };

    /**
     * Adds all config options to registered actions
     */
    private addConfigToActions(): void {
        this.registeredActions.forEach((registeredAction: MonacoAdaptorAction) => {
            registeredAction.addConfig({
                getMonacoModelValue: this.getMonacoModelValue,
                updateMonacoModelValue: this.updateMonacoModelValue,
                messageSystemType: registeredAction.getMessageSystemType(),
            });
        });
    }

    /**
     * Retrieve the Monaco Model value
     */
    private getMonacoModelValue = (): string[] => {
        return this.monacoModelValue;
    };

    /**
     * Determine the dictionary id
     */
    private updateDictionaryIdAndNavigationConfigIdFromDataDictionary = (
        newDataDictionary: DataDictionary<unknown>
    ): void => {
        this.dictionaryId = findUpdatedDictionaryId(
            findDictionaryIdParents(this.dictionaryId, this.dataDictionary),
            newDataDictionary
        );
        this.dataDictionary = newDataDictionary;
    };

    /**
     * Update the Monaco Model value
     */
    private updateMonacoModelValue = (value: string[]): void => {
        /**
         * Normalize values by converting all new lines into an array
         * and remove the leading spaces
         */
        this.monacoModelValue = value
            .join("")
            .split("\n")
            .map((lineValue: string) => {
                return lineValue.replace(/^\s*/g, "");
            });
        const dataDictionary = mapVSCodeParsedHTMLToDataDictionary({
            value,
            schemaDictionary: this.schemaDictionary,
        });

        this.updateDictionaryIdAndNavigationConfigIdFromDataDictionary(dataDictionary);
        this.messageSystem.postMessage({
            type: MessageSystemType.initialize,
            dataDictionary,
            schemaDictionary: this.schemaDictionary,
            options: {
                from: monacoAdaptorId,
            },
            dictionaryId: this.dictionaryId,
        } as InitializeMessageIncoming);
    };
}
