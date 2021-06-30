import { fastComponentLibrary } from "./library.fast";
import { nativeElementLibrary } from "./library.native";
import { ElementDefinition } from "./typings";

const elementLibraries: { [key: string]: ElementDefinition } = {
    [fastComponentLibrary.id]: fastComponentLibrary,
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
