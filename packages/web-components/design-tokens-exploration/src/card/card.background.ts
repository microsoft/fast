import { Behavior, FASTElement } from "@microsoft/fast-element";
import { DI, DIDesignTokenProvider } from "@microsoft/fast-foundation";
import { darkenViaLAB, parseColorHexRGB } from "@microsoft/fast-colors";

const background = {
    dependencies: ["backgroundColor"],
    derive: (args: { backgroundColor: string }) => {
        return darkenViaLAB(
            parseColorHexRGB(args.backgroundColor)!,
            0.2
        ).toStringHexRGB();
    },
};

export class CardBackground implements Behavior {
    bind(source: FASTElement & HTMLElement) {
        const container = DI.getOrCreateDOMContainer(source);
        const provider = container.get(DIDesignTokenProvider);
        provider.designTokens.set("backgroundColor", background);
    }

    unbind(source: FASTElement & HTMLElement) {}
}
