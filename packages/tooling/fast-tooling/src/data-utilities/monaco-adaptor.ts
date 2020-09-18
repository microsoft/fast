import {
    InitializeMessageIncoming,
    MessageSystemType,
    SchemaDictionary,
} from "../message-system";
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

const monacoAdaptorId: string = "monaco-adaptor";

export class MonacoAdaptor extends MessageSystemUtility<
    MonacoAdaptorActionCallbackConfig
> {
    private monacoModelValue: string[];
    private schemaDictionary: SchemaDictionary;

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
                if (!e.data.options || e.data.options.from !== monacoAdaptorId) {
                    this.schemaDictionary = e.data.schemaDictionary;
                    this.monacoModelValue = [
                        // TODO: format this with vscode-html-languageservice
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
     * Update the Monaco Model value
     */
    private updateMonacoModelValue = (value: string[]): void => {
        this.monacoModelValue = value;

        this.messageSystem.postMessage({
            type: MessageSystemType.initialize,
            dataDictionary: mapVSCodeParsedHTMLToDataDictionary({
                value,
                schemaDictionary: this.schemaDictionary,
            }),
            schemaDictionary: this.schemaDictionary,
            options: {
                from: monacoAdaptorId,
            },
        } as InitializeMessageIncoming);
    };
}
