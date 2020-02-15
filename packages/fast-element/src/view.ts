import { IBehavior } from "./behaviors/behavior";

export interface IView {
    bind(source: unknown): void;
    unbind(): void;
    remove(): void;
}

export interface IElementView extends IView {
    appendTo(node: Node): void;
}

export interface ISyntheticView extends IView {
    insertBefore(node: Node): void;
}

export class HTMLView implements IView, IElementView, ISyntheticView {
    private parent?: Node;
    private start?: Node;
    private end?: Node;

    constructor(
        private fragment: DocumentFragment,
        private behaviors: IBehavior[],
        private isSynthetic: boolean = false
    ) {
        if (isSynthetic) {
            this.start = fragment.firstChild!;
            this.end = fragment.lastChild!;
        }
    }

    public appendTo(node: Node) {
        this.parent = node;
        node.appendChild(this.fragment);
    }

    public insertBefore(node: Node) {
        node.parentNode!.insertBefore(this.fragment, node);
    }

    public remove() {
        if (this.isSynthetic) {
            const fragment = this.fragment;
            let current: Node | null = this.start!;
            const end = this.end!;
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
        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].bind(source);
        }
    }

    unbind() {
        const behaviors = this.behaviors;

        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind();
        }
    }
}
