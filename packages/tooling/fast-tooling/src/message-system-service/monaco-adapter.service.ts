import {
    InitializeMessageIncoming,
    MessageSystemType,
    SchemaDictionary,
} from "../message-system";
import { DataDictionary } from "../message-system";
import { mapVSCodeHTMLAndDataDictionaryToDataDictionary } from "../data-utilities/mapping.vscode-html-languageservice";
import { mapDataDictionaryToMonacoEditorHTML } from "../data-utilities/monaco";
import {
    MessageSystemService,
    MessageSystemServiceConfig,
} from "./message-system.service";
import {
    MonacoAdapterAction,
    MonacoAdapterActionCallbackConfig,
} from "./monaco-adapter.service-action";
import {
    findDictionaryIdParents,
    findUpdatedDictionaryId,
} from "./monaco-adapter.service.utilities";

export type actionCallback = () => void;

/**
 * @alpha
 */
export const monacoAdapterId: string = "fast-tooling::monaco-adapter-service";

/**
 *
 * @alpha
 * @remarks
 * A MessageSystemService for the Monaco Editor.
 */
export class MonacoAdapter extends MessageSystemService<
    MonacoAdapterActionCallbackConfig,
    {}
> {
    private monacoModelValue: string[];
    private schemaDictionary: SchemaDictionary;
    private dataDictionary: DataDictionary<unknown>;
    private dictionaryId: string;

    constructor(config: MessageSystemServiceConfig<MonacoAdapterActionCallbackConfig>) {
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

                if (!e.data.options || e.data.options.originatorId !== monacoAdapterId) {
                    this.schemaDictionary = e.data.schemaDictionary;
                    this.monacoModelValue = [
                        mapDataDictionaryToMonacoEditorHTML(
                            e.data.dataDictionary,
                            e.data.schemaDictionary
                        ),
                    ];
                    this.registeredActions.forEach((action: MonacoAdapterAction) => {
                        if (action.matches(e.data.type)) {
                            action.invoke();
                        }
                    });
                }
                break;
            case MessageSystemType.navigation:
                this.dictionaryId = e.data.activeDictionaryId;
                break;
            case MessageSystemType.schemaDictionary:
                this.schemaDictionary = e.data.schemaDictionary;
                break;
        }
    };

    /**
     * Gets the action config
     */
    getActionConfig = (
        messageSystemType: MessageSystemType
    ): MonacoAdapterActionCallbackConfig => {
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
        this.registeredActions.forEach((registeredAction: MonacoAdapterAction) => {
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
    private updateMonacoModelValue = (value: string[], isExternal: boolean): void => {
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
        const dataDictionary = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            this.monacoModelValue.join("").replace(/\n/g, ""),
            "text",
            this.dataDictionary,
            this.schemaDictionary
        );

        this.updateDictionaryIdAndNavigationConfigIdFromDataDictionary(dataDictionary);

        if (!isExternal) {
            this.messageSystem.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary,
                schemaDictionary: this.schemaDictionary,
                options: {
                    originatorId: monacoAdapterId,
                },
                dictionaryId: this.dictionaryId,
            } as InitializeMessageIncoming);
        }
    };
}

export { MonacoAdapterAction, MonacoAdapterActionCallbackConfig };
