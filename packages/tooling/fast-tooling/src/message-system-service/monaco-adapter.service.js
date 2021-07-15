import { MessageSystemType } from "../message-system";
import { mapVSCodeHTMLAndDataDictionaryToDataDictionary } from "../data-utilities/mapping.vscode-html-languageservice";
import { mapDataDictionaryToMonacoEditorHTML } from "../data-utilities/monaco";
import { MessageSystemService } from "./message-system.service";
export const monacoAdapterId = "fast-tooling::monaco-adapter-service";
export function findDictionaryIdParents(dictionaryId, dataDictionary, parents = []) {
    if (
        dataDictionary[0][dictionaryId] &&
        dataDictionary[0][dictionaryId].parent &&
        dataDictionary[0][dictionaryId].parent.id
    ) {
        const parent = dataDictionary[0][dictionaryId].parent;
        parents.unshift(
            Object.assign(Object.assign({}, parent), {
                currentId: dictionaryId,
                linkedDataIndex: dataDictionary[0][parent.id].data[
                    parent.dataLocation
                ].findIndex(dictionaryItem => {
                    return dictionaryItem.id === dictionaryId;
                }),
            })
        );
        findDictionaryIdParents(parent.id, dataDictionary, parents);
    }
    return parents;
}
export function findUpdatedDictionaryId(
    parents,
    dataDictionary,
    dictionaryId = dataDictionary[1]
) {
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
export class MonacoAdapter extends MessageSystemService {
    constructor(config) {
        super();
        /**
         * Handles messages from the message system
         */
        this.handleMessageSystem = e => {
            switch (e.data.type) {
                case MessageSystemType.initialize:
                    this.dictionaryId = e.data.activeDictionaryId;
                    this.dataDictionary = e.data.dataDictionary;
                    if (
                        !e.data.options ||
                        e.data.options.originatorId !== monacoAdapterId
                    ) {
                        this.schemaDictionary = e.data.schemaDictionary;
                        this.monacoModelValue = [
                            mapDataDictionaryToMonacoEditorHTML(
                                e.data.dataDictionary,
                                e.data.schemaDictionary
                            ),
                        ];
                        this.registeredActions.forEach(action => {
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
        this.getActionConfig = messageSystemType => {
            return {
                getMonacoModelValue: this.getMonacoModelValue,
                updateMonacoModelValue: this.updateMonacoModelValue,
                messageSystemType,
            };
        };
        /**
         * Retrieve the Monaco Model value
         */
        this.getMonacoModelValue = () => {
            return this.monacoModelValue;
        };
        /**
         * Determine the dictionary id
         */
        this.updateDictionaryIdAndNavigationConfigIdFromDataDictionary = newDataDictionary => {
            this.dictionaryId = findUpdatedDictionaryId(
                findDictionaryIdParents(this.dictionaryId, this.dataDictionary),
                newDataDictionary
            );
            this.dataDictionary = newDataDictionary;
        };
        /**
         * Update the Monaco Model value
         */
        this.updateMonacoModelValue = (value, isExternal) => {
            /**
             * Normalize values by converting all new lines into an array
             * and remove the leading spaces
             */
            this.monacoModelValue = value
                .join("")
                .split("\n")
                .map(lineValue => {
                    return lineValue.replace(/^\s*/g, "");
                });
            const dataDictionary = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                this.monacoModelValue.join("").replace(/\n/g, ""),
                "text",
                this.dataDictionary,
                this.schemaDictionary
            );
            this.updateDictionaryIdAndNavigationConfigIdFromDataDictionary(
                dataDictionary
            );
            if (!isExternal) {
                this.messageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary,
                    schemaDictionary: this.schemaDictionary,
                    options: {
                        originatorId: monacoAdapterId,
                    },
                    dictionaryId: this.dictionaryId,
                });
            }
        };
        this.registerMessageSystem(config);
        this.addConfigToActions();
    }
    /**
     * Adds all config options to registered actions
     */
    addConfigToActions() {
        this.registeredActions.forEach(registeredAction => {
            registeredAction.addConfig({
                getMonacoModelValue: this.getMonacoModelValue,
                updateMonacoModelValue: this.updateMonacoModelValue,
                messageSystemType: registeredAction.getMessageSystemType(),
            });
        });
    }
}
