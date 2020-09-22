import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import FASTMessageSystemWorker from "../../../dist/message-system.min.js";
import {
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemType,
} from "../../../src";
import { mapDataDictionaryToMonacoEditorHTML } from "../../../src/data-utilities/monaco";
import { MonacoAdaptor } from "../../../src/data-utilities/monaco-adaptor";
import { MonacoAdaptorAction } from "../../../src/data-utilities/monaco-adaptor-action";
import monacoEditorConfig from "./monaco-editor-config";
import dataDictionaryConfig from "./data-dictionary-config";
import schemaDictionary from "./schema-dictionary";

document.body.setAttribute("style", "margin: 0");
const root = document.getElementById("root");
root.setAttribute("style", "height: 100vh");
const textInput = document.getElementById("foo") as HTMLInputElement;
const boolInput = document.getElementById("bar") as HTMLInputElement;

const fastMessageSystemWorker = new FASTMessageSystemWorker();
let monacoValue = [];
let monacoEditorModel;
let fastMessageSystem: MessageSystem;
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

function handleMessageSystem(e: MessageEvent) {
    if (e.data) {
        if (e.data.type === MessageSystemType.initialize) {
            dataDictionary = e.data.dataDictionary;

            if (e.data.options && e.data.options.from === "monaco-adaptor") {
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

if ((window as any).Worker) {
    fastMessageSystem = new MessageSystem({
        webWorker: fastMessageSystemWorker,
        dataDictionary: dataDictionaryConfig as any,
        schemaDictionary,
    });
    fastMessageSystem.add({
        onMessage: handleMessageSystem,
    });
}

const adaptor = new MonacoAdaptor({
    messageSystem: fastMessageSystem,
    actions: [
        new MonacoAdaptorAction({
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

monaco.editor.onDidCreateModel((listener: monaco.editor.ITextModel) => {
    monacoEditorModel = monaco.editor.getModel(listener.uri) as monaco.editor.ITextModel;

    let firstRun = true;
    monacoEditorModel.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => {
        /**
         * Sets the value to be used by monaco
         */
        const modelValue = monacoEditorModel.getValue();
        monacoValue = Array.isArray(modelValue) ? modelValue : [modelValue];

        if (!firstRun) {
            adaptor.action("monaco.setValue").run();
        }

        firstRun = false;
    });
});

const editor = monaco.editor.create(root, monacoEditorConfig as any);

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
