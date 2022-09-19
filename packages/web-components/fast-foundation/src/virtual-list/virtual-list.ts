import {
    attr,
    bind,
    FASTElement,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewBehaviorOrchestrator,
    ViewTemplate,
} from "@microsoft/fast-element";
import { FASTDataList } from "../index.js";
import { Virtualizing, VirtualListBase } from "./virtual-list-base.js";

class _VirtualList extends FASTDataList {}
interface _VirtualList extends VirtualListBase {}

/**
 * A virtualizing base class for the {@link @microsoft/fast-foundation#(FASTVirtualList:class)} component.
 *
 * @beta
 */
export class VirtualList extends Virtualizing(_VirtualList) {}

/**
 *  The Virtual List class
 *
 * @public
 */
export class FASTVirtualList extends VirtualList {
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
    }
}
