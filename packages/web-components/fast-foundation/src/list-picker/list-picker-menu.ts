import {
    attr,
    DOM,
    FASTElement,
    observable,
    RepeatBehavior,
    RepeatDirective,
    ViewTemplate,
} from "@microsoft/fast-element";
import uniqueId from "lodash-es/uniqueId";
import { AnchoredRegion } from "../anchored-region";

/**
 * A List Picker Menu Custom HTML Element.
 *
 * @public
 */
export class ListPickerMenu extends FASTElement {}
