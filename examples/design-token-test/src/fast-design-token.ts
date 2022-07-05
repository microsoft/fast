import { FASTElement, Observable } from "@microsoft/fast-element";
import { composedParent } from "@microsoft/fast-element/utilities";
import {
    DesignToken,
    DesignTokenNode,
    DesignTokenValue,
    StaticDesignTokenValue,
} from "@microsoft/fast-foundation/design-token-2";

function isFASTElement(target: HTMLElement): target is FASTElement {
    return target instanceof FASTElement;
}

export class FASTDesignToken<T> extends DesignToken<T> {
    private static handler = {
        handleChange: (token: FASTDesignToken<any>, node: DesignTokenNode) => {
            const target = (node as any).$$designtokentarget$$ as FASTElement;
            target.style.setProperty(`--${token.name}`, node.getTokenValue(token));
        },
    };

    private static findParentNode(target: HTMLElement): DesignTokenNode | null {
        let current = composedParent(target);

        while (current !== null) {
            if (isFASTElement(current)) {
                const x = FASTDesignToken.cache.get(current);
                if (x) {
                    return x;
                }
            }

            current = composedParent(current);
        }

        return null;
    }

    private static cache = new WeakMap<FASTElement, DesignTokenNode>();
    private static getOrCreateNodeFor(target: FASTElement): DesignTokenNode {
        let resolved = this.cache.get(target);
        if (resolved) {
            return resolved;
        }

        resolved = new DesignTokenNode();
        (resolved as any).$$designtokentarget$$ = target;
        FASTDesignToken.cache.set(target, resolved);
        const upstream = FASTDesignToken.findParentNode(target);

        if (upstream) {
            upstream.appendChild(resolved);
        }

        return resolved;
    }

    constructor(public readonly name: string) {
        super();
        Observable.getNotifier(this).subscribe(FASTDesignToken.handler);
    }

    public getValueFor(target: FASTElement): StaticDesignTokenValue<T> {
        return FASTDesignToken.getOrCreateNodeFor(target).getTokenValue(this);
    }
    public setValueFor(target: FASTElement, value: DesignTokenValue<T>): void {
        return FASTDesignToken.getOrCreateNodeFor(target).setTokenValue(this, value);
    }
}
