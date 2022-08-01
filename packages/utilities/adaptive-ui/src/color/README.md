# Adaptive UI Color Recipes

Color recipes are algorithmic patterns that produce individual or sets of colors from a variety of inputs. Components can apply these recipes to achieve expressive theming options while maintaining color accessability targets.

## Swatch
A Swatch is a representation of a color that has a `relativeLuminance` value and a method to convert the swatch to a color string. It is used by recipes to determine which colors to use for UI.

### SwatchRGB
A concrete implementation of `Swatch`, it is a swatch with red, green, and blue 64bit color channels.

**Example: Creating a SwatchRGB**
```ts
import { SwatchRGB } from "@microsoft/adaptive-ui";

const red = new SwatchRGB(1, 0, 0);
```

## Palette
A palette is a collection `Swatch` instances, ordered by relative luminance, and provides mechanisms to safely retrieve swatches by index and by target contrast ratios. It also contains a `source` color, which is the color from which the palette is derived.

### PaletteRGB
An implementation of `Palette` of `SwatchRGB` instances. 

```ts
// Create a PaletteRGB from a SwatchRGB 
const redPalette = PaletteRGB.from(red):
```
