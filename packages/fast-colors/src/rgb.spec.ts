import { hexToRgb } from "./rgb";

describe("Valid 3 digit hexits", (): void => {
    test("Should return a value when all three digits are digits between 0 and 9", (): void => {
        expect(hexToRgb("#000")).toBe("rgb(0, 0, 0)");
        expect(hexToRgb("#191")).toBe("rgb(17, 153, 17)");
    });
    test("Should return rgb(255, 255, 255)", (): void => {
        expect(hexToRgb("#Fff")).toBe("rgb(255, 255, 255)");
    });
    test("Should return rgb(221, 238, 204)", (): void => {
        expect(hexToRgb("#dEc")).toBe("rgb(221, 238, 204)");
    });
    /*
    test("Should return rgb(17, 153, 17)", (): void => {
        expect(hexToRgb("#191")).toBe("rgb(17, 153, 17)");
    });
    */
    test("Should return rgb(187, 204, 153)", (): void => {
        expect(hexToRgb("#bc9")).toBe("rgb(187, 204, 153)");
    });
    test("Should return rgb(153, 170, 204)", (): void => {
        expect(hexToRgb("#9aC")).toBe("rgb(153, 170, 204)");
    });
    test("Should return rgb(238, 187, 68)", (): void => {
        expect(hexToRgb("#eB4")).toBe("rgb(238, 187, 68)");
    });
    test("Should return rgb(204, 17, 68)", (): void => {
        expect(hexToRgb("#c14")).toBe("rgb(204, 17, 68)");
    });
    test("Should return rgb(238, 0, 255)", (): void => {
        expect(hexToRgb("#E0F")).toBe("rgb(238, 0, 255)");
    });
    test("Should return rgb(204, 221, 0)", (): void => {
        expect(hexToRgb("#CD0")).toBe("rgb(204, 221, 0)");
    });
});

describe("Valid 4 digit hexits", (): void => {
    test("Should return rgba(255, 255, 255, 1)", (): void => {
        expect(hexToRgb("#ffff")).toBe("rgba(255, 255, 255, 1)");
    });
    test("Should return rgba(0, 0, 0, 0)", (): void => {
        expect(hexToRgb("#0000")).toBe("rgba(0, 0, 0, 0)");
    });
    test("Should return rgba(255, 0, 0, 0.8)", (): void => {
        expect(hexToRgb("#F00C")).toBe("rgba(255, 0, 0, 0.8)");
    });
    test("Should return rgba(221, 204, 153, 1)", (): void => {
        expect(hexToRgb("#DC9F")).toBe("rgba(221, 204, 153, 1)");
    });
    test("Should return rgba(17, 51, 238, 0.6)", (): void => {
        expect(hexToRgb("#13E9")).toBe("rgba(17, 51, 238, 0.6)");
    });
    test("Should return rgba(255, 255, 51, 0.06666666666666667)", (): void => {
        expect(hexToRgb("#fF31")).toBe("rgba(255, 255, 51, 0.06666666666666667)");
    });
    test("Should return rgba(51, 153, 136, 0.4)", (): void => {
        expect(hexToRgb("#3986")).toBe("rgba(51, 153, 136, 0.4)");
    });
    test("Should return rgba(170, 170, 170, 0.6666666666666666)", (): void => {
        expect(hexToRgb("#AaAa")).toBe("rgba(170, 170, 170, 0.6666666666666666)");
    });
    test("Should return rgba(17, 187, 119, 0.8666666666666667)", (): void => {
        expect(hexToRgb("#1B7d")).toBe("rgba(17, 187, 119, 0.8666666666666667)");
    });
    test("Should return rgba(238, 153, 119, 0.2)", (): void => {
        expect(hexToRgb("#e973")).toBe("rgba(238, 153, 119, 0.2)");
    });
});

describe("Valid 6 digit hexits", (): void => {
    test("Should return rgb(255, 255, 255)", (): void => {
        expect(hexToRgb("#ffffff")).toBe("rgb(255, 255, 255)");
    });
    test("Should return rgb(0, 0, 0)", (): void => {
        expect(hexToRgb("#000000")).toBe("rgb(0, 0, 0)");
    });
    test("Should return rgb(241, 242, 253)", (): void => {
        expect(hexToRgb("#f1f2fd")).toBe("rgb(241, 242, 253)");
    });
    test("Should return rgb(252, 233, 130)", (): void => {
        expect(hexToRgb("#fce982")).toBe("rgb(252, 233, 130)");
    });
    test("Should return rgb(205, 233, 143)", (): void => {
        expect(hexToRgb("#cdE98F")).toBe("rgb(205, 233, 143)");
    });
    test("Should return rgb(168, 76, 93)", (): void => {
        expect(hexToRgb("#A84C5D")).toBe("rgb(168, 76, 93)");
    });
    test("Should return rgb(25, 216, 55)", (): void => {
        expect(hexToRgb("#19D837")).toBe("rgb(25, 216, 55)");
    });
    test("Should return rgb(132, 147, 224)", (): void => {
        expect(hexToRgb("#8493E0")).toBe("rgb(132, 147, 224)");
    });
    test("Should return rgb(212, 124, 138)", (): void => {
        expect(hexToRgb("#D47C8A")).toBe("rgb(212, 124, 138)");
    });
    test("Should return rgb(188, 218, 158)", (): void => {
        expect(hexToRgb("#BCDA9E")).toBe("rgb(188, 218, 158)");
    });
});

describe("Valid 8 digit hexits", (): void => {
    test("Should return rgba(255, 255, 255, 1)", (): void => {
        expect(hexToRgb("#FFFFFFFF")).toBe("rgba(255, 255, 255, 1)");
    });
    test("Should return rgba(0, 0, 0, 0)", (): void => {
        expect(hexToRgb("#00000000")).toBe("rgba(0, 0, 0, 0)");
    });
    test("Should return rgba(255, 0, 0, 0.8)", (): void => {
        expect(hexToRgb("#FF0000CC")).toBe("rgba(255, 0, 0, 0.8)");
    });
    test("Should return rgba(253, 224, 20, 0.5764705882352941)", (): void => {
        expect(hexToRgb("#Fde01493")).toBe("rgba(253, 224, 20, 0.5764705882352941)");
    });
    test("Should return rgba(25, 115, 40, 0.4392156862745098)", (): void => {
        expect(hexToRgb("#19732870")).toBe("rgba(25, 115, 40, 0.4392156862745098)");
    });
    test("Should return rgba(171, 254, 202, 0.8588235294117647)", (): void => {
        expect(hexToRgb("#ABFECADB")).toBe("rgba(171, 254, 202, 0.8588235294117647)");
    });
    test("Should return rgba(155, 206, 135, 0.6862745098039216)", (): void => {
        expect(hexToRgb("#9Bce87Af")).toBe("rgba(155, 206, 135, 0.6862745098039216)");
    });
    test("Should return rgba(169, 131, 71, 0.807843137254902)", (): void => {
        expect(hexToRgb("#a98347ce")).toBe("rgba(169, 131, 71, 0.807843137254902)");
    });
    test("Should return rgba(239, 202, 137, 0.17254901960784313)", (): void => {
        expect(hexToRgb("#efca892c")).toBe("rgba(239, 202, 137, 0.17254901960784313)");
    });
    test("Should return rgba(117, 131, 201, 0.2196078431372549", (): void => {
        expect(hexToRgb("#7583c938")).toBe("rgba(117, 131, 201, 0.2196078431372549)");
    });
});

describe("Invalid hexits", (): void => {
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("#-ffffg");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("#21m20912");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("~98302910");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("#00000z");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("19999");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("32");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("f");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("zsdgn3i2o1");
        }).toThrow();
    });
    test("Should throw an error", (): void => {
        expect((): void => {
            hexToRgb("#3.!/.9");
        }).toThrow();
    });
});
