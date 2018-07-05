export function convertHexToRgb(hex: string, alpha?: number): string {
    if (!hex || !hex.match(`^#?(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$`)) {
        throw new Error("Received hex value is not valid");
    }

    const newHex: string = hex.charAt(0) === "#" ? hex.substring(1) : hex;

    const red: number = parseInt(newHex.length === 3 ? newHex.slice(0, 1).repeat(2) : newHex.slice(0, 2), 16);
    const green: number = parseInt(newHex.length === 3 ? newHex.slice(1, 2).repeat(2) : newHex.slice(2, 4), 16);
    const blue: number = parseInt(newHex.length === 3 ? newHex.slice(2, 3).repeat(2) : newHex.slice(4, 6), 16);

    return alpha ? `rgba(${red}, ${green}, ${blue}, ${alpha})` : `rgb(${red}, ${green}, ${blue})`;
}
