# Component styling

## Design System
## Embrace CSS Custom Properties
## MatchMedia Stylesheets
CSS Media queries are incredibly useful for conditionally applying CSS rules based on the rendering environment. 

## Type Ramp
## Hiding elements that have not been upgraded
Custom Elements that have not been upgraded and don't have styles attached are still rendered by the browser - but they likely do not look how they are supposed to. To avoid a Flash of Un-styled Content (FOUC) you should be sure to visually hide Custom Elements if they have not been *defined*. A useful CSS snippet to do this is:

```css
:not(:defined) {
    visibility: hidden;
}
```
Note, this will need to be applied by the consuming application and will not be applied by the components themselves.