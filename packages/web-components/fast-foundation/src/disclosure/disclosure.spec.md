# Disclosure

## Overview

A disclosure component is the implementation of native `details` and `summary` control that toggles the visibility of the extra content. Visually, it would look like a button or hyperlink and beneath extra content. As defined by the W3C:

> A disclosure is a button that controls the visibility of a section of content. When the controlled content is hidden, it is often styled as a typical push button with a right-pointing arrow or triangle to hint that activating the button will display additional content. When the content is visible, the arrow or triangle typically points down.

### Use Cases

-   In general, reveal the extra information on button click when the end-user is needed to know/see.
-   Laurel wanted to buy a new phone and she was looking at one of the websites where all the basic information was shown. She read about a camera feature called Night Mode and there was a section labeled "See the advanced technology that goes into every Night mode shot". She clicked on it and found out how that feature would work. With that extra information on that feature, she was quite confident in her buying.

### Non-goals

Many times disclosures may take different appearances, such as a button or anchor. Inclusion of such attributes should be applied at the design system / component implementation level.

### Features

-   Enter and Space: activates the disclosure component and toggles the visibility of the disclosure content.
-   Use `expanded` attribute or `toggle()` to render default expanded
-   Observe the state when the disclosure is toggled
-   `show()` and `hide()` as helper methods to toggle the content from outside

### Prior Art/Examples

-   [Shopify Polaris](https://polaris.shopify.com/components/behavior/collapsible)
-   [Lightning Design](https://www.lightningdesignsystem.com/components/expandable-section/)
-   [Bootstrap](https://getbootstrap.com/docs/4.3/components/collapse/)
-   [Material UI](https://material-ui.com/api/collapse/)

---

## Design

The disclosure component can easily be extended for customization, for example adding animation to reveal the content or get the height of extra content slot.

-   Basic component which toggles the extra content and to add animation extra styles that can be applied to derived/extended component.

### API

-   _Component Name:_ `fast-disclosure`
-   _Props/Attrs:_
    -   `expanded: boolean` - Current state of the disclosure component
    -   `title: string` - invoker title (slot title is also available for custom template)
-   _Methods_:
    -   `show()`: to show the content
    -   `hide()`: to hide the content
    -   `toggle()`: to toggle the content
-   _Events_:
    -   `toggle: CustomEvent` - No custom data.

### Anatomy and Appearance

```html
<host>
    <details>
        <summary>
            <slot name="start"></slot>
            <slot name="summary"></slot>
            <slot name="end"></slot>
        </summary>
        <div>
            <slot></slot>
        </div>
    </details>
</host>
```

-   _Slot Names_
    -   start: add glyph for toggle state
    -   summary: invoker title (could look like as a button or hyperlink)
    -   end: add glyph for toggle state
    -   default: extra content to be placed

---

## Implementation

```html
<fast-disclosure>
    <span slot="summary">More about Green Arrow</span>
    <div>
        Green Arrow is a fictional superhero who appears in comic books published by DC
        Comics. Created by Mort Weisinger and designed by George Papp, he first appeared
        in More Fun Comics #73 in November 1941. His real name is Oliver Jonas Queen, a
        wealthy businessman and owner of Queen Industries who is also a well-known
        celebrity in Star City.
    </div>
</fast-disclosure>
```

### States

Disclosure has one state which indicates whether the component has revealed the extra content or not. It can be accessed by `expanded` property or can be updated by all available public methods (`show`, `hide`, `toggle`).

### Accessibility

-   When the disclosure component has focus:
    -   Enter or Space: activates the disclosure control and toggles the visibility of the disclosure content.
-   As per the WAI-ARIA spec by [W3C](https://www.w3.org/TR/wai-aria-practices-1.2/#wai-aria-roles-states-and-properties-8):
    > The element that shows and hides the content has a role button.
    > When the content is visible, the element with the role button has aria-expanded set to true. When the content area is hidden, it is set to false.
    > Optionally, the element with the role button has a value specified for aria-controls that refers to the element that contains all the content that is shown or hidden.

---

## Resources

-   [W3C Disclosure ARIA Practices](https://www.w3.org/TR/wai-aria-practices-1.2/#disclosure)
