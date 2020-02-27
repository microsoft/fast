import { Behavior } from "./behaviors/behavior";

export interface View {
    bind(source: unknown): void;
    unbind(): void;
    remove(): void;
}

export interface ElementView extends View {
    appendTo(node: Node): void;
}

export interface SyntheticView extends View {
    readonly firstChild: Node;
    readonly lastChild: Node;
    insertBefore(node: Node): void;
}

export class HTMLView implements View, ElementView, SyntheticView {
    private parent?: Node;
    private source: any = void 0;
    public firstChild!: Node;
    public lastChild!: Node;

    constructor(
        private fragment: DocumentFragment,
        private behaviors: Behavior[],
        private isSynthetic: boolean = false
    ) {
        if (isSynthetic) {
            this.firstChild = fragment.firstChild!;
            this.lastChild = fragment.lastChild!;
        }
    }

    public appendTo(node: Node) {
        this.parent = node;
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
        if (this.isSynthetic) {
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
        } else {
            const parent = this.parent!;
            const fragment = this.fragment;

            while (parent.hasChildNodes()) {
                fragment.appendChild(parent.firstChild!);
            }
        }
    }

    bind(source: unknown) {
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

    unbind() {
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
