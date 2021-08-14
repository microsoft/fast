import { fastComponentLibrary } from "./fast";
import { fluentUIComponentLibrary } from "./fluent-ui";
import { nativeElementLibrary } from "./native";
import { ElementLibraryDefinition } from "./typings";

const elementLibraries: { [key: string]: ElementLibraryDefinition } = {
    [fastComponentLibrary.id]: fastComponentLibrary,
    [fluentUIComponentLibrary.id]: fluentUIComponentLibrary,
    [nativeElementLibrary.id]: nativeElementLibrary,
};

const elementLibraryContents: { [key: string]: string[] } = (() => {
    const elementLibraryContents = {};

    Object.values(elementLibraries).forEach(elementLibrary => {
        elementLibraryContents[elementLibrary.id] = Object.values(
            elementLibrary.componentDictionary
        ).map(component => {
            return component.schema.$id;
        });
    });

    return elementLibraryContents;
})();

export { elementLibraries, elementLibraryContents };
