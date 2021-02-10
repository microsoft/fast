import { DI } from "@microsoft/fast-foundation";
import { SimpleDesignToken } from "./design-tokens";

export const DesignUnit = DI.createInterface<SimpleDesignToken<number>>({
    respectConnection: true,
});
