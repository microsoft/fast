import { FASTDataList } from "../data-list/index.js";
import { Virtualizing } from "./virtualizing.js";

class _VirtualList extends FASTDataList {}
interface _VirtualList extends Virtualizing {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(FASTButton:class)} component.
 *
 * @beta
 */
export class VirtualList extends Virtualizing(_VirtualList) {}

/**
 *  The Virtual List class
 *
 * @public
 */
export class FASTVirtualList extends VirtualList {}
