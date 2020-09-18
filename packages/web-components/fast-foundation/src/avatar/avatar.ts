import { attr, FASTElement } from "@microsoft/fast-element";

type AvatarShape = "circle" | "square"

/**
 * An Avatar Custom HTML Element
 * 
 * @public
 */
export class Avatar extends FASTElement {
  /**
   * Indicates the Avatar should have a name.
   * 
   * @public
   * @remarks
   * HTML Attribute: name
   */
  @attr public name: string;
  protected nameChanged(): void {
    const result = this.name?.match(/\b\w/g) || [];
    this.initials = ((result.shift() || '') + (result.pop() || '')).toUpperCase();
  }

  /**
   * Indicates the Avatar should have initials.
   * 
   * @public
   * @remarks
   * HTML Attribute: initials
   */
  @attr public initials: string;
  
  /**
   * Indicates the Avatar should have a color fill.
   *  
   * @public
   * @remarks
   * HTML Attribute: fill
   */
  @attr public fill: string;

  /**
   * Indicates the Avatar should have a text color.
   * 
   * @public
   * @remarks
   * HTML Attribute: color
   */
  @attr public color: string;

  /**
   * Indicates the Avatar should have an image source
   * 
   * @public
   * @remarks
   * HTML Attribute: src
   */
  @attr({attribute: "src"}) 
  public imgSrc: string;

  /**
   * Indicates the Avatar should have alt text
   * 
   * @public
   * @remarks
   * HTML Attribute: alt
   */
  @attr public alt: string;

  /**
   * Indicates the Avatar should have url link
   * 
   * @public
   * @remarks
   * HTML Attribute: link
   */
  @attr public link: string;

  /**
   * Indicates the Avatar shape should be. By default it will be set to "circle".
   * 
   * @public
   * @remarks
   * HTML Attribute: shape
   */
  @attr public shape: AvatarShape;

  public connectedCallback(): void {
    super.connectedCallback();
    this.shape = "circle";
  }
}
