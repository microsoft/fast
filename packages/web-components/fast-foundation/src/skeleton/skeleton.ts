import { attr, FASTElement} from "@microsoft/fast-element";

export type skeletonShape = 'rect' | 'circle';

/**
 * A Skeleton Custom HTML Element.
 * 
 * @public
 */
export class Skeleton extends FASTElement {
  /**
   * Indicates the badge should have a filled style.
   * 
   * @public
   * @remarks
   * HTML Attribute: fill
   */
  @attr public fill: string;

  /**
   * Indicates what the shape of the Skeleton should be.
   * 
   * @public
   * @remarks
   * HTML Attribute: shape
   */
  @attr public shape: skeletonShape = "rect";

  @attr public ariaBusy: boolean;

  @attr public pattern: string;
};
