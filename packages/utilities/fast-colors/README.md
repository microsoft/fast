<div align="center">
    <p><b>ni | fast | colors</b></p>
</div>

# FAST Colors

[![NI FAST Colors NPM version and repo link](https://img.shields.io/npm/v/@ni/fast-colors.svg?label=@ni/fast-colors)](https://www.npmjs.com/package/@ni/fast-colors)

`@ni/fast-colors` includes a number of color classes and utilities designed to make parsing and manipulating colors easy, fast, and light-weight. This `@ni/fast-colors` library is a fork of [`@microsoft/fast-colors`](https://github.com/microsoft/fast/tree/archives/fast-element-1/packages/utilities/fast-colors).


## Getting Started

### Installing from NPM

To install the `fast-colors` library, use `npm` as follows:

```shell
npm install @ni/fast-colors
```

## Usage

### Color classes

There are a number of color classes exported for common color formats. These include:

- `ColorHSL`
- `ColorHSV`
- `ColorLAB`
- `ColorLCH`
- `ColorRGBA64` (note each channel is a number from 0-1)
- `ColorXYZ`

```ts
const myColor: new ColorRGBA64(0, 0, 0, 1);

myColor.toStringHexRGB() // "#000000"
```

### Color parsers

A number of color parsers are also available to parse a variety of different color formats.

- `parseColorHexRGB(raw: string): ColorRGBA64 | null` parses `#RGB` or `#RRGGBB` color strings
- `parseColorHexARGB(raw: string): ColorRGBA64 | null` parses `#ARGB` or `#AARRGGBB` color strings
- `parseColorHexRGBA(raw: string): ColorRGBA64 | null` parses `#RGBA` or `#RRGGBBAA` color strings
- `parseColorWebRGB(raw: string): ColorRGBA64 | null` parses `#rgb(R, G, B)` color strings
- `parseColorWebRGBA(raw: string): ColorRGBA64 | null` parses `#rgb(R, G, B, A)` color strings
- `parseColorNamed(raw: string): ColorRGBA64 | null` parses [named color strings](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color)

### Color Palette

A utility for creating a palette of colors from a source color and configuration options:

- `baseColor?: ColorRGBA64`
- `steps?: number`
- `interpolationMode?: ColorInterpolationSpace`
- `scaleColorLight?: ColorRGBA64`
- `scaleColorDark?: ColorRGBA64`
- `clipLight?: number`
- `clipDark?: number`
- `saturationAdjustmentCutoff?: number`
- `saturationLight?: number`
- `saturationDark?: number`
- `overlayLight?: number`
- `overlayDark?: number`
- `multiplyLight?: number`
- `multiplyDark?: number`

Example:

```ts
const palette: ColorPalette = new ColorPalette({
    baseColor: new ColorRGBA64(.4, .4, .7, 1),
    steps: 99,
    interpolationMode: ColorInterpolationSpace.RGB
})
```

### Color converters

A number of color converters are available to convert one color format to the other. Each color accepts a color class of the source type and returns a color class of the converted type:

- `hslToRGB`
- `rgbToHSL`
- `rgbToHSV`
- `hsvToRGB`
- `lchToLAB`
- `labToLCH`
- `labToXYZ`
- `xyzToLAB`
- `rgbToXYZ`
- `xyzToRGB`
- `rgbToLAB`
- `labToRGB`
- `rgbToLCH`
- `lchToRGB`

```ts
const rgb: ColorRGBA64 = new ColorRGBA64(.5, .5, .5, 1);
const hsl: ColorHSL = rgbToHSL(rgb);
```
