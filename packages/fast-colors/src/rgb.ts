
export function hexToRgb(hex: string): string {
  let processedHex: IRgbJSON;
  processedHex = properRGBValues(hex);
  let r: string;
  let g: string;
  let b: string;
  let a: string;
  let rgb: boolean;
  let rgba: boolean;

  r = processedHex.r;
  g = processedHex.g;
  b = processedHex.b;
  a = processedHex.a;
  rgb = processedHex.rgb;
  rgba = processedHex.rgba;

  if (r.length === 1) {
    r += r;
  }
  if (g.length === 1) {
    g += g;
  }
  if (b.length === 1) {
    b += b;
  }

  if (rgb) {
    return `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`;
  } else if (rgba) {
    if (a.length === 1) {
      a += a;
    }
    return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${(parseInt(a, 16) / 255)})`;
  }
}

interface IRgbJSON {
  r: string;
  g: string;
  b: string;
  a: string;
  rgb: boolean;
  rgba: boolean;
}

function properRGBValues(hex: string): IRgbJSON {
  hex = hex.replace("#", "");
  if (3 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return {
      r: hex.charAt(0),
      g: hex.charAt(1),
      b: hex.charAt(2),
      a: "",
      rgb: true,
      rgba: false
    };
  } else if (4 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    return {
      r: hex.charAt(0),
      g: hex.charAt(1),
      b: hex.charAt(2),
      a: hex.charAt(3),
      rgb: false,
      rgba: true
    };
  } else if (6 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return {
      r : hex.substring(0, 2),
      g : hex.substring(2, 4),
      b : hex.substring(4, 6),
      a: "",
      rgb: true,
      rgba: false
    };
  } else if (8 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    return {
      r: hex.substring(0, 2),
      g: hex.substring(2, 4),
      b: hex.substring(4, 6),
      a: hex.substring(6, 8),
      rgb: false,
      rgba: true
    };
  } else {
    throw new Error("Not a convertible hex value");
  }

}
