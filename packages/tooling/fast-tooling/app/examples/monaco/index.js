import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
} from "../../../src";
import { mapDataDictionaryToMonacoEditorHTML } from "../../../src/data-utilities/monaco";
import {
    MonacoAdapter,
    monacoAdapterId,
} from "../../../src/message-system-service/monaco-adapter.service";
import { MonacoAdapterAction } from "../../../src/message-system-service/monaco-adapter.service-action";
import monacoEditorConfig from "./monaco-editor-config";
import dataDictionaryConfig from "./data-dictionary-config";
import schemaDictionary from "./schema-dictionary";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTMessageSystemWorker = require("../../../dist/message-system.min.js");
document.body.setAttribute("style", "margin: 0");
const root = document.getElementById("root");
root.setAttribute("style", "height: 100vh");
const textInput = document.getElementById("foo");
const boolInput = document.getElementById("bar");
const fastMessageSystemWorker = new FASTMessageSystemWorker();
let monacoValue = [];
let monacoEditorModel;
let fastMessageSystem;
let dataDictionary;
function updateFormInputs() {
    textInput.value = dataDictionary[0][dataDictionary[1]].data.foo;
    boolInput.checked = dataDictionary[0][dataDictionary[1]].data.bar;
}
function updateMonacoEditor() {
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    editor.setValue(
        mapDataDictionaryToMonacoEditorHTML(dataDictionary, schemaDictionary)
    );
}
function handleMessageSystem(e) {
    if (e.data) {
        if (e.data.type === MessageSystemType.initialize) {
            dataDictionary = e.data.dataDictionary;
            if (e.data.options && e.data.options.originatorId === monacoAdapterId) {
                updateFormInputs();
            } else {
                updateFormInputs();
                updateMonacoEditor();
            }
        }
        if (e.data.type === MessageSystemType.data) {
            dataDictionary = e.data.dataDictionary;
            updateFormInputs();
            updateMonacoEditor();
        }
    }
}
if (window.Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: dataDictionaryConfig,
        schemaDictionary,
    });
    fastMessageSystem.add({
        onMessage: handleMessageSystem,
    });
}
const adapter = new MonacoAdapter({
    messageSystem: fastMessageSystem,
    actions: [
        new MonacoAdapterAction({
            id: "monaco.setValue",
            action: config => {
                // trigger an update to the monaco value that
                // also updates the DataDictionary which fires a
                // postMessage to the MessageSystem
                config.updateMonacoModelValue(monacoValue);
            },
        }),
    ],
});
monaco.editor.onDidCreateModel(listener => {
    monacoEditorModel = monaco.editor.getModel(listener.uri);
    let firstRun = true;
    monacoEditorModel.onDidChangeContent(e => {
        /**
         * Sets the value to be used by monaco
         */
        const modelValue = monacoEditorModel.getValue();
        monacoValue = Array.isArray(modelValue) ? modelValue : [modelValue];
        if (!firstRun) {
            adapter.action("monaco.setValue").run();
        }
        firstRun = false;
    });
});
const editor = monaco.editor.create(root, monacoEditorConfig);
function handleTextInputOnKeyUp() {
    fastMessageSystem.postMessage({
        type: MessageSystemType.data,
        action: MessageSystemDataTypeAction.update,
        dataLocation: "foo",
        data: textInput.value,
    });
}
function handleBooleanInputOnChange() {
    fastMessageSystem.postMessage({
        type: MessageSystemType.data,
        action: MessageSystemDataTypeAction.update,
        dataLocation: "bar",
        data: boolInput.checked,
    });
}
textInput.addEventListener("keyup", handleTextInputOnKeyUp);
boolInput.addEventListener("change", handleBooleanInputOnChange);
