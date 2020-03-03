import { Behavior } from "./behaviors/behavior";

export interface View {
    bind(source: unknown): void;
    unbind(): void;
}

export interface ElementView extends View {
    appendTo(node: Node): void;
}

export interface SyntheticView extends View {
    readonly firstChild: Node;
    readonly lastChild: Node;
    insertBefore(node: Node): void;
    remove(): void;
}

export class HTMLView implements ElementView, SyntheticView {
    private source: any = void 0;
    public firstChild: Node;
    public lastChild: Node;

    constructor(private fragment: DocumentFragment, private behaviors: Behavior[]) {
        this.firstChild = fragment.firstChild!;
        this.lastChild = fragment.lastChild!;
    }

    public appendTo(node: Node) {
        node.appendChild(this.fragment);
    }

    public insertBefore(node: Node) {
        if (this.fragment.hasChildNodes()) {
            node.parentNode!.insertBefore(this.fragment, node);
        } else {
            let parentNode = node.parentNode!;
            let current: Node | null = this.firstChild!;
            const end = this.lastChild!;
            let next;

            while (current) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);

                if (current === end) {
                    break;
                }

                current = next;
            }
        }
    }

    public remove() {
        const fragment = this.fragment;
        let current: Node | null = this.firstChild!;
        const end = this.lastChild!;
        let next;

        while (current) {
            next = current.nextSibling;
            fragment.appendChild(current);

            if (current === end) {
                break;
            }

            current = next;
        }
    }

    public bind(source: unknown) {
        if (this.source === source) {
            return;
        } else if (this.source !== void 0) {
            this.unbind();
        }

        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].bind(source);
        }
    }

    public unbind() {
        if (this.source === void 0) {
            return;
        }

        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
        }

        this.source = void 0;
    }
}
