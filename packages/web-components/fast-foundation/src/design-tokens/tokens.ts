import { DI, InterfaceSymbol } from "../di";
import { DesignTokenLibraryImpl } from "./library";

export const DesignTokens: InterfaceSymbol<DesignTokenLibraryImpl<
    any
>> = DI.createInterface<DesignTokenLibraryImpl<any>>({
    friendlyName: "DesignTokens",
    respectConnection: true,
}).noDefault();
