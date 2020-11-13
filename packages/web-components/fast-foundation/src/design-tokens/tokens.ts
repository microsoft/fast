import { DI, InterfaceSymbol } from "../di";
import { FASTDesignTokenLibrary } from "./library";

export const DesignTokens: InterfaceSymbol<FASTDesignTokenLibrary<
    any
>> = DI.createInterface<FASTDesignTokenLibrary<any>>({
    friendlyName: "DesignTokens",
    respectConnection: true,
}).noDefault();
