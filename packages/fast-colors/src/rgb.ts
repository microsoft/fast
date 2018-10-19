
export function hexToRgb(hex: string): string {
  const processedHex: RgbJSON = properRGBValues(hex);
  const r: string = processedHex.r;
  const g: string = processedHex.g;
  const b: string = processedHex.b;
  const a: string = processedHex.a;
  const rgb: boolean = processedHex.rgb;
  const rgba: boolean = processedHex.rgba;

  if (rgb) {
    return `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`;
  } else if (rgba) {
    return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${(parseInt(a, 16) / 255)})`;
  }
}

class RgbJSON {
  public r: string;
  public g: string;
  public b: string;
  public a: string;
  public rgb: boolean;
  public rgba: boolean;

  constructor(r: string, g: string, b: string, a: string, rgb: boolean, rgba: boolean) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.rgb = rgb;
    this.rgba = rgba;
  }
}

function properRGBValues(hex: string): RgbJSON {
  hex = hex.replace("#", "");
  if (3 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return new RgbJSON((hex.charAt(0) + hex.charAt(0)), (hex.charAt(1) + hex.charAt(1)), (hex.charAt(2) + hex.charAt(2)), "", true, false);
  } else if (4 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    return new RgbJSON(hex.charAt(0) + hex.charAt(0), hex.charAt(1) + hex.charAt(1), hex.charAt(2) + hex.charAt(2),
hex.charAt(3) + hex.charAt(3), false, true);
  } else if (6 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return new RgbJSON(hex.substring(0, 2), hex.substring(2, 4), hex.substring(4, 6), "", true, false);
  } else if (8 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    return new RgbJSON(hex.substring(0, 2), hex.substring(2, 4), hex.substring(4, 6), hex.substring(6, 8), false, true);
  } else {
    throw new Error("Not a convertible hex value");
  }

}
