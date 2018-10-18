import { hexToRgb } from "./rgb";

describe("Valid 3 digit hexits", (): void => {
    test("Should return a value when all three digits are digits between 0 and 9", (): void => {
        expect(hexToRgb("#000")).toBe("rgb(0, 0, 0)");
        expect(hexToRgb("#191")).toBe("rgb(17, 153, 17)");
        expect(hexToRgb("#273")).toBe("rgb(34, 119, 51)");
        expect(hexToRgb("#841")).toBe("rgb(136, 68, 17)");
        expect(hexToRgb("#065")).toBe("rgb(0, 102, 85)");
    });
    test("Should return a value when all three digits are lowercase letters between a and f", (): void => {
        expect(hexToRgb("#abc")).toBe("rgb(170, 187, 204)");
        expect(hexToRgb("#dfa")).toBe("rgb(221, 255, 170)");
        expect(hexToRgb("#edc")).toBe("rgb(238, 221, 204)");
        expect(hexToRgb("#fae")).toBe("rgb(255, 170, 238)");
        expect(hexToRgb("#fff")).toBe("rgb(255, 255, 255)");
    });
    test("Should return a value when all three digits are uppercase letters between A and F", (): void => {
        expect(hexToRgb("#ABC")).toBe("rgb(170, 187, 204)");
        expect(hexToRgb("#DFA")).toBe("rgb(221, 255, 170)");
        expect(hexToRgb("#EDC")).toBe("rgb(238, 221, 204)");
        expect(hexToRgb("#FAE")).toBe("rgb(255, 170, 238)");
        expect(hexToRgb("#FFF")).toBe("rgb(255, 255, 255)");
    });
    test("Should return a value when valid uppercase letters and valid lowercase letters are merged", (): void => {
        expect(hexToRgb("#Fff")).toBe("rgb(255, 255, 255)");
        expect(hexToRgb("#dEc")).toBe("rgb(221, 238, 204)");
        expect(hexToRgb("#Cae")).toBe("rgb(204, 170, 238)");
        expect(hexToRgb("#bBd")).toBe("rgb(187, 187, 221)");
        expect(hexToRgb("#CFb")).toBe("rgb(204, 255, 187)");
    });
    test("Should return a value when letters are mixed with numbers", (): void => {
        expect(hexToRgb("#bc9")).toBe("rgb(187, 204, 153)");
        expect(hexToRgb("#9aC")).toBe("rgb(153, 170, 204)");
        expect(hexToRgb("#eB4")).toBe("rgb(238, 187, 68)");
        expect(hexToRgb("#c14")).toBe("rgb(204, 17, 68)");
        expect(hexToRgb("#E0F")).toBe("rgb(238, 0, 255)");
        expect(hexToRgb("#CD0")).toBe("rgb(204, 221, 0)");
    });
});

describe("Valid 4 digit hexits", (): void => {
    test("Should return a value when all 4 digits are numbers between 0 and 9", (): void => {
        expect(hexToRgb("#0000")).toBe("rgba(0, 0, 0, 0)");
        expect(hexToRgb("#3986")).toBe("rgba(51, 153, 136, 0.4)");
        expect(hexToRgb("#2018")).toBe("rgba(34, 0, 17, 0.5333333333333333)");
        expect(hexToRgb("#9975")).toBe("rgba(153, 153, 119, 0.3333333333333333)");
        expect(hexToRgb("#1462")).toBe("rgba(17, 68, 102, 0.13333333333333333)");
    });
    test("Should return a value when all 4 digits are lowercase letters between a and f", (): void => {
        expect(hexToRgb("#ffff")).toBe("rgba(255, 255, 255, 1)");
        expect(hexToRgb("#cdaf")).toBe("rgba(204, 221, 170, 1)");
        expect(hexToRgb("#ddfe")).toBe("rgba(221, 221, 255, 0.9333333333333333)");
        expect(hexToRgb("#eabc")).toBe("rgba(238, 170, 187, 0.8)");
        expect(hexToRgb("#ddad")).toBe("rgba(221, 221, 170, 0.8666666666666667)");
    });
    test("Should return a value when all 4 digits are uppercase letters between A and F", (): void => {
        expect(hexToRgb("#FFFF")).toBe("rgba(255, 255, 255, 1)");
        expect(hexToRgb("#FADC")).toBe("rgba(255, 170, 221, 0.8)");
        expect(hexToRgb("#EFDD")).toBe("rgba(238, 255, 221, 0.8666666666666667)");
        expect(hexToRgb("#CBAE")).toBe("rgba(204, 187, 170, 0.9333333333333333)");
        expect(hexToRgb("#DADD")).toBe("rgba(221, 170, 221, 0.8666666666666667)");
    });
    test("Should return a value when lowercase and uppercase letters are mixed together", (): void => {
        expect(hexToRgb("#ffFF")).toBe("rgba(255, 255, 255, 1)");
        expect(hexToRgb("#AaAa")).toBe("rgba(170, 170, 170, 0.6666666666666666)");
        expect(hexToRgb("#ebFc")).toBe("rgba(238, 187, 255, 0.8)");
        expect(hexToRgb("#ACCd")).toBe("rgba(170, 204, 204, 0.8666666666666667)");
        expect(hexToRgb("#cedB")).toBe("rgba(204, 238, 221, 0.7333333333333333)");
    });
    test("Should return a value when numbers and letters are mixed together", (): void => {
        expect(hexToRgb("#F00C")).toBe("rgba(255, 0, 0, 0.8)");
        expect(hexToRgb("#DC9F")).toBe("rgba(221, 204, 153, 1)");
        expect(hexToRgb("#13E9")).toBe("rgba(17, 51, 238, 0.6)");
        expect(hexToRgb("#fF31")).toBe("rgba(255, 255, 51, 0.06666666666666667)");
        expect(hexToRgb("#1B7d")).toBe("rgba(17, 187, 119, 0.8666666666666667)");
        expect(hexToRgb("#e973")).toBe("rgba(238, 153, 119, 0.2)");
    });
});

describe("Valid 6 digit hexits", (): void => {
    test("Should return a value when all 6 digits are numbers between 0 and 9", (): void => {
        expect(hexToRgb("#000000")).toBe("rgb(0, 0, 0)");
        expect(hexToRgb("#123987")).toBe("rgb(18, 57, 135)");
        expect(hexToRgb("#784576")).toBe("rgb(120, 69, 118)");
        expect(hexToRgb("#217489")).toBe("rgb(33, 116, 137)");
        expect(hexToRgb("#255449")).toBe("rgb(37, 84, 73)");
    });
    test("Should return a value when all 6 digits are lowercase letters between a and f", (): void => {
        expect(hexToRgb("#ffffff")).toBe("rgb(255, 255, 255)");
        expect(hexToRgb("#afecdb")).toBe("rgb(175, 236, 219)");
        expect(hexToRgb("#ddbbff")).toBe("rgb(221, 187, 255)");
        expect(hexToRgb("#eaccae")).toBe("rgb(234, 204, 174)");
        expect(hexToRgb("#fddacb")).toBe("rgb(253, 218, 203)");
    });
    test("Should return a value when all 6 digits are uppercase letters between A and F", (): void => {
        expect(hexToRgb("#FFFFFF")).toBe("rgb(255, 255, 255)");
        expect(hexToRgb("#BCDFAE")).toBe("rgb(188, 223, 174)");
        expect(hexToRgb("#DDFBBF")).toBe("rgb(221, 251, 191)");
        expect(hexToRgb("#ACEECA")).toBe("rgb(172, 238, 202)");
        expect(hexToRgb("#BACFDF")).toBe("rgb(186, 207, 223)");
    });
    test("Should return a value when lowercase letters and uppercase letters are mixed together", (): void => {
        expect(hexToRgb("#AFeCDA")).toBe("rgb(175, 236, 218)");
        expect(hexToRgb("#bCDAfE")).toBe("rgb(188, 218, 254)");
        expect(hexToRgb("#FdddFD")).toBe("rgb(253, 221, 253)");
        expect(hexToRgb("#DfDBff")).toBe("rgb(223, 219, 255)");
        expect(hexToRgb("#EacCAe")).toBe("rgb(234, 204, 174)");
        expect(hexToRgb("#eFAdDd")).toBe("rgb(239, 173, 221)");
        expect(hexToRgb("#fbADCf")).toBe("rgb(251, 173, 207)");
        expect(hexToRgb("#bdfEeC")).toBe("rgb(189, 254, 236)");
    });
    test("Should return a value when numbers and letters are mixed together", (): void => {
        expect(hexToRgb("#BCDA9E")).toBe("rgb(188, 218, 158)");
        expect(hexToRgb("#D47C8A")).toBe("rgb(212, 124, 138)");
        expect(hexToRgb("#8493E0")).toBe("rgb(132, 147, 224)");
        expect(hexToRgb("#19D837")).toBe("rgb(25, 216, 55)");
        expect(hexToRgb("#A84C5D")).toBe("rgb(168, 76, 93)");
        expect(hexToRgb("#cdE98F")).toBe("rgb(205, 233, 143)");
        expect(hexToRgb("#fce982")).toBe("rgb(252, 233, 130)");
        expect(hexToRgb("#f1f2fd")).toBe("rgb(241, 242, 253)");
    });
});

describe("Valid 8 digit hexits", (): void => {
    test("Should return a value when all 8 digits are numbers between 0 and 9", (): void => {
        expect(hexToRgb("#00000000")).toBe("rgba(0, 0, 0, 0)");
        expect(hexToRgb("#19732870")).toBe("rgba(25, 115, 40, 0.4392156862745098)");
        expect(hexToRgb("#92748321")).toBe("rgba(146, 116, 131, 0.12941176470588237)");
        expect(hexToRgb("#75843991")).toBe("rgba(117, 132, 57, 0.5686274509803921)");
        expect(hexToRgb("#12345678")).toBe("rgba(18, 52, 86, 0.47058823529411764)");
    });
    test("Should return a value when all 8 digits are lowercase letters between a and f", (): void => {
        expect(hexToRgb("#ffffffff")).toBe("rgba(255, 255, 255, 1)");
        expect(hexToRgb("#bdacefba")).toBe("rgba(189, 172, 239, 0.7294117647058823)");
        expect(hexToRgb("#dcaebbda")).toBe("rgba(220, 174, 187, 0.8549019607843137)");
        expect(hexToRgb("#ffeabcdf")).toBe("rgba(255, 234, 188, 0.8745098039215686)");
        expect(hexToRgb("#eeabbaff")).toBe("rgba(238, 171, 186, 1)");
    });
    test("Should return a value when all 8 digits are uppercase letters between A and F", (): void => {
        expect(hexToRgb("#FFFFFFFF")).toBe("rgba(255, 255, 255, 1)");
        expect(hexToRgb("#ABFECADB")).toBe("rgba(171, 254, 202, 0.8588235294117647)");
        expect(hexToRgb("#ADBBEACD")).toBe("rgba(173, 187, 234, 0.803921568627451)");
        expect(hexToRgb("#FDCBEAFF")).toBe("rgba(253, 203, 234, 1)");
        expect(hexToRgb("#DDFBCEAA")).toBe("rgba(221, 251, 206, 0.6666666666666666)");
    });
    test("Should return a value when lowercase letters and uppercase letters are mixed together", (): void => {
        expect(hexToRgb("#afcdeFca")).toBe("rgba(175, 205, 239, 0.792156862745098)");
        expect(hexToRgb("#DFcAFFda")).toBe("rgba(223, 202, 255, 0.8549019607843137)");
        expect(hexToRgb("#cdBbEfeB")).toBe("rgba(205, 187, 239, 0.9215686274509803)");
        expect(hexToRgb("#EEEcDBfa")).toBe("rgba(238, 236, 219, 0.9803921568627451)");
        expect(hexToRgb("#CAeDBBBF")).toBe("rgba(202, 237, 187, 0.7490196078431373)");
    });
    test("Should return a value when numbers and letters are mixed together", (): void => {
        expect(hexToRgb("#7583c938")).toBe("rgba(117, 131, 201, 0.2196078431372549)");
        expect(hexToRgb("#efca892c")).toBe("rgba(239, 202, 137, 0.17254901960784313)");
        expect(hexToRgb("#a98347ce")).toBe("rgba(169, 131, 71, 0.807843137254902)");
        expect(hexToRgb("#9Bce87Af")).toBe("rgba(155, 206, 135, 0.6862745098039216)");
        expect(hexToRgb("#FF0000CC")).toBe("rgba(255, 0, 0, 0.8)");
        expect(hexToRgb("#Fde01493")).toBe("rgba(253, 224, 20, 0.5764705882352941)");
    });
});

describe("Invalid hexits", (): void => {
    test("Should throw an error for an invalid length hex string", (): void => {
        expect((): void => {
            hexToRgb("");
        }).toThrow();
        expect((): void => {
            hexToRgb("f");
        }).toThrow();
        expect((): void => {
            hexToRgb("19999");
        }).toThrow();
        expect((): void => {
            hexToRgb("32");
        }).toThrow();
        expect((): void => {
            hexToRgb("ffeeddccbbaa");
        }).toThrow();
        expect((): void => {
            hexToRgb("f999999");
        }).toThrow();
    });
    test("Should throw an error when an invalid character is present", (): void => {
        expect((): void => {
            hexToRgb("#21m20912");
        }).toThrow();
        expect((): void => {
            hexToRgb("~9832910");
        }).toThrow();
        expect((): void => {
            hexToRgb("#00000z");
        }).toThrow();
        expect((): void => {
            hexToRgb("#3.!/.9");
        }).toThrow();
        expect((): void => {
            hexToRgb("zsd3i2o1");
        }).toThrow();
        expect((): void => {
            hexToRgb("#-ffffg");
        }).toThrow();
    });
});
