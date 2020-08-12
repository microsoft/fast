import { attr, FASTElement } from "@microsoft/fast-element";

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
  @attr({ attribute: "name" })
  public name: string;

  /**
   * Indicates the Avatar should have a color fill.
   * 
   * @public
   * @remarks
   * HTML Attribute: fill
   */
  @attr({ attribute: "fill" })
  public fill: string;

  /**
   * Indicates the Avatar should have a text color.
   * 
   * @public
   * @remarks
   * HTML Attribute: color
   */
  @attr({ attribute: "color" })
  public color: string;

  /**
   * Indicates the Avatar should have an image source
   * 
   * @public
   * @remarks
   * HTML Attribute: src
   */
  @attr({attribute: 'src'}) 
  public imgSrc: string;

  /**
   * Indicates the Avatar should have alt text
   * 
   * @public
   * @remarks
   * HTML Attribute: alt
   */
  @attr({attribute: 'alt'}) 
  public alt: string;

  /**
   * Indicates the Avatar should have url link
   * 
   * @public
   * @remarks
   * HTML Attribute: link
   */
  @attr({attribute: 'link'}) 
  public link: string;

  /**
   * Indicates the Avatar shape should be. By default it will be set to "circle".
   * 
   * @public
   * @remarks
   * HTML Attribute: shape
   */
  @attr({ attribute: 'shape'})
  public shape: string = 'circle';
}