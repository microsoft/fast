import { IBehavior } from "./behaviors/behavior";
import { DOM } from "./dom";

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
        if (this.isSynthetic) {
            fragment.insertBefore(
                (this.start = DOM.createLocation()),
                fragment.firstChild
            );
            fragment.appendChild((this.end = DOM.createLocation()));
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
        this.behaviors.forEach(x => x.bind(source));
    }

    unbind() {
        this.behaviors.forEach(x => x.unbind());
    }
}
