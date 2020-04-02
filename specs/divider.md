# Divider

## Overview

An implementation of a horizontal rule as a web-component. 

It would be ideal to be able to use the [`is` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) here so that we are not recreating the native `hr` element, but that portion of the web component spec seems to be at risk with certain browser implementors, which means that by leveraging that convention the control would likely not work in certain browsers. With that in mind, it makes sense to move forward with the componentized model. In the event that the `is` convention moves forward, we should revisit this implementation to take advantage of that standard.

### Use Cases

Used anywhere a horizontal rule might be used.

### Prior Art/Examples
- [FAST-DNA (React)](https://explore.fast.design/components/divider)
- [Ant Design](https://ant.design/components/divider/)
- [Semantic UI](https://semantic-ui.com/elements/divider.html)
- [Fluent UI](https://fluentsite.z22.web.core.windows.net/components/divider/definition)

---

### API
Extends FAST Element

*Component name:*
- `fast-divider`

*Attributes:*
- `role` - The permitted roles of the divider. Defaults to `separator`.

### Anatomy and Appearance

*Template:*
```
<template
    role=${x => x.role}
>
</template>
```

## Implementation

```html
<fast-divider></fast-divider>
```
```html
<fast-divider role="presentation"></fast-divider>
```


### Accessibility

The divider should default to having a role of `separator`, just as a typical horizontal rule would. When changing the look, functional, interactive, or structural relevance implied by the `hr` element a role of `presentation` may be applied. Since the role of [separator](https://w3c.github.io/aria/#separator) conveys meaning to assistive technology, the visual representation should likewise convey the same meaning. With that in mind, the visual treatment of a horizontal rule with a role of `separator` should meet non-text contrast requirements. A role of `presentation` implies that the divider is a visual treatment only so the contrast requirement does not apply in that case.


## Next Steps
- Monitor the status of [`is` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) across browser implementors. In the case that this is implemented by all major browsers, we want to move to leveraging this convention for the divider component rather than recreating the `<hr/>`.