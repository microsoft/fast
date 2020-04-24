# Heading

## Overview

*Heading* provides a consistent and customizable way of applying base [typography](./typography.md) sizes to convey progression and information hierarchy in your content.

### Background

Headings are commonly used to provide structure and scanability. Often they follow a size ramp where the top level or title is the largest and each subsection gets smaller. This may be combined with variations in other formatting treatments like weight or rule lines.

While primarily relevant to proper accessibility, it's important to consider the difference between a heading from a content hierarchy perspective compared to a block of text that simply needs to be a certain size. This spec will address both areas with a perspective on making *anything* possible while making it easy to inherit default accessible patterns.

Standard html elements exist for six levels of headings, ```<h1>``` through ```<h6>```. Page and app authors are familiar with using these elements for their semantic purpose as well as abusing them only to make text larger or smaller. All browsers share a default opinion that ```<h1>``` is the largest, ramping down to ```<h6>```.

### Use Cases

1. Applying formatting to non-semantic text
2. Defining accessible page hierarchy through one or more sequences of ```<h1>```, ```<h2>```, ```<h3>```, etc. elements
3. Formatting heading elements off-ramp, i.e. a smaller ```<h2>``` that groups a section and larger ```<h3>``` for main topics within that section
 
### Features

1. Ability to use any size in the type ramp as a heading
2. A default mapping for style to standard elements
3. Use of a contiguous ramp sequence to create intentional rhythm
4. A set of semantically named styles based on the underlying type ramp

### Risks and Challenges

It's possible that styles alone (not components) will be harder to implement consistently. We may want to consider simple custom elements that consistently apply the same underlying styles as well as any necessary aria tags.

### Prior Art / Examples

- FAST-DNA (React): [Heading](https://explore.fast.design/components/heading), [Subeading](https://explore.fast.design/components/subheading)
- [Material Design](https://material.io/design/typography/the-type-system.html)
- [Bootstrap](https://getbootstrap.com/docs/4.4/content/typography)
- [Ant Design](https://ant.design/components/typography)
- [Mineral UI](https://mineral-ui.netlify.app/typography#display-text)
- [Semantic UI](https://semantic-ui.com/elements/header.html)
- [Fluent UI](https://fluentsite.z22.web.core.windows.net/components/header/definition)

---

## Design

A heading can be made from any size in the type ramp.

![](./images/heading-examples.png)

### API

Pseudo interfaces: (*Could be functions, decorators, design system attributes, or otherwise*)

#### Basic heading style map

Bare-bones styles applied manually.

```TypeScript
headingStyles.basicRamp()
```

Produces css classes that can be applied to any text elements. The classes are consistently named for relation to the raw type ramp.

*Supports use cases 1 & 3, feature 1*

```CSS
.fast-heading-minus-2 ...

.fast-heading-minus-1 ...

.fast-heading-base {
    font-size: var(--fast-type-ramp-base-size);
    line-height: var(--fast-type-ramp-base-height);
    font-weight: var(--fast-heading-font-weight);
}

.fast-heading-plus-1 ...

...
```

Usage:

```HTML
<h1 class="fast-heading-plus-3">If all the world is a stage, I want better lighting</h1>

<span class="fast-heading-minus-2">If all the world is a stage, I want better lighting</span>
```

#### Scoped standard heading element map

The easiest option for accessible content when you know how many levels you have.

```TypeScript
headingStyles.standardElementMap(levels: 3, includeBase: false)
```

Applies the styles to the standard heading elements for the desired number of levels so the adaptive styling is picked without needing to add and maintain class names. Starts directly above the base type ramp size or optionally includes that size depending on stylistic preference.

*Supports use case 2, features 2 & 3*

```CSS
h1, h2, h3, h4, h5, h6 {
    font-weight: var(--fast-heading-font-weight);
}

/* Three levels, above base */

h1 {
    font-size: var(--fast-type-ramp-plus-3-size);
    line-height: var(--fast-type-ramp-plus-3-height);
}

h2 {
    font-size: var(--fast-type-ramp-plus-2-size);
    line-height: var(--fast-type-ramp-plus-2-height);
}

h3 {
    font-size: var(--fast-type-ramp-plus-1-size);
    line-height: var(--fast-type-ramp-plus-1-height);
}

h4, h5, h6 { /* This rule may not be necessary, but it helps identify config issues. */
    font-size: var(--fast-type-ramp-base-size);
    line-height: var(--fast-type-ramp-base-height);
}
```

Usage:

```HTML
<h1>If all the world is a stage, I want better lighting</h1>

<p>Bring, you let cattle. Their of fifth fourth creep together set fowl of, creeping fourth beginning. Great saying above hath.</p>

<h2>Examples</h2>

<p>Herb brought midst fifth, called land lesser. Also that good his appear.</p>

<h3>Examples</h3>

<p>Behold fifth stars Fish cattle. Creature won't isn't form upon.</p>
```

---

### Accessibility

The benefit of enabling standard elements to be styled is that if used properly they will already have the appropriate default aria roles and attributes. The downside is potential misuse and missing attributes. For instance ```<p class="fast-heading-plus-3">Important title</p>``` won't be properly identified as a heading by assistive technology.
