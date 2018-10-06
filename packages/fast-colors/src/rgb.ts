
export function hexToRgb(hex: string): string {
  let r: string;
  let g: string;
  let b: string;
  let a: string;
  let rgb: boolean;
  rgb = false;
  let rgba: boolean;
  rgba = false;
  hex = hex.replace("#", "");
  if (3 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    rgb = true;
    r = hex.charAt(0);
    g = hex.charAt(1);
    b = hex.charAt(2);
  } else if (4 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    rgba = true;
    r = hex.charAt(0);
    g = hex.charAt(1);
    b = hex.charAt(2);
    a = hex.charAt(3);
  } else if (6 === hex.length && /^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    rgb = true;
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
  } else if (8 === hex.length && /^([A-Fa-f0-9]{4}){1,2}$/.test(hex)) {
    rgba = true;
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
    a = hex.substring(6, 8);
  } else {
    throw new Error("Not a convertible hex value");
  }

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
    return "rgb(" + parseInt(r, 16) + ", " + parseInt(g, 16) + ", " + parseInt(b, 16) + ")";
  } else if (rgba) {
    if (a.length === 1) {
      a += a;
    }
    return "rgba(" + parseInt(r, 16) + ", " + parseInt(g, 16) + ", " + parseInt(b, 16) + ", " + (parseInt(a, 16) / 255) + ")";
  }

}
