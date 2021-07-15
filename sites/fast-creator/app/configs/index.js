import { fastComponentLibrary } from "./library.fast";
import { nativeElementLibrary } from "./library.native";
const elementLibraries = {
    [fastComponentLibrary.id]: fastComponentLibrary,
    [nativeElementLibrary.id]: nativeElementLibrary,
};
const elementLibraryContents = (() => {
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
