---
id: index
title: FAST Colors
sidebar_label: Colors
---

# Colors

A color utility library designed to make working with colors easier.

A huge thanks to [bobbyrayit](https://github.com/bobbyrayit) and [mlijanto](https://github.com/mlijanto) for creating the algorithm implemented in the `range` function.
This code borrows heavily from their original implementation.

## range(color, [options])

A function that converts a single color input into a range of outputs, from lightest to darkest.

- `color: string` - a HEX or RGB color represented as a string (eg, `"#FFF"` or `"rgb(0, 0, 0)"`)
- `options: object`
    -- `count: number` - the number of colors to create in the count. Defaults to `7`.
    -- `paddingLight: number` - the amount to reduce the color-range of light values by. Defaults to `0.185`.
    -- `paddingDark: number` - the amount to reduce the color-range of dark values by. Defaults to `0.185`.
    -- `saturationLight: number` - the amount to adjust the saturation of light values by. Defaults to `0.35`.
    -- `saturationDark: number` - the amount to adjust the saturation of dark values by. Defaults to `1.25`.
    -- `brightnessLight: number` - the amount to adjust the brightness of light values by. Defaults to `0`.
    -- `brightnessDark: number` - the amount to adjust the brightness of dark values by. Defaults to `0`.
    -- `filterOverlayLight: number` - the amount of an overlay filter to apply to light values. Defaults to `0`.
    -- `filterOverlayDark: number` - the amount of an overlay filter to apply to dark values. Defaults to `0.25`.
    -- `filterMultiplyLight: number` - the amount of a multiply filter to apply to light values. Defaults to `0`.
    -- `filterMultiplyDark: number` - the amount of a multiply filter to apply to dark values. Defaults to `0`.

### Usage

```js
import { range } from "@microsoft/fast-colors";

// Default usage
const range = range("#dddddd"); // [ '#f2f2f2', '#ebebeb', '#e4e4e4', '#dddddd', '#b6b6b6', '#8f8f8f', '#696969' ]

// Custom configuration
const range = range("#dddddd", {
    count: 3,
    paddingLight: .2,
    paddingDark: .2
}); // [ '#f1f1f1`, `#dddddd`, `#777777` ]
```

## contrast(ratio, operand, reference)

A function that adjust a color (`operand`) to meet a contrast ratio (`ratio`) against another color (`reference`).

- `ratio: number` - the desired contrast ratio of the returned color.
- `operand: string` - a string representation of the color that will be adjusted to meet `ratio` against `reference`.
- `reference: string` - a string representation of the color that the `operand` will meet a contrast ratio against.

### Usage

```js
import { contrast } from "@microsoft/fast-colors"

const background = "#FFF";
const foreground = "#000";

const buttonTextColor = contrast(4.5, foreground, background); // -> #767675 with a contrast ratio of 4.54
```
