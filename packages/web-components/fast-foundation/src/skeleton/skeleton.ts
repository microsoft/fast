import { attr, FASTElement, observable } from "@microsoft/fast-element";

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

  @observable public offset: number;

  public shimmerEl: HTMLElement;

  @observable public getOffset = () => {
    return this.offsetLeft;
  }

  public getParentWidth() { 
    this.parentElement!.getBoundingClientRect().width; 
  }
  connectedCallback() {
    super.connectedCallback()
    this.style.setProperty('--shimmerOffset', `${this.offsetLeft}px`)
    this.style.setProperty('--parentWidth', `${this.parentElement!.getBoundingClientRect().width}px`)
  }
};
