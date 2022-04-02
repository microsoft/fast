import chai from "chai";
import { test } from "mocha";
import { testData } from "./__test__/testData.js";
import {
    ColorPalette,
    generateOffCenterPalette,
    generateScaledPalettes,
    rescale,
} from "./color-palette.js";
import { ColorRGBA64 } from "./color-rgba-64.js";
import { parseColorHexRGB } from "./parse-color.js";
const expect = chai.expect;

const testPrecision: number = 4;

describe("Palette generation", () => {
    test("paletteGeneration", () => {
        function testColor(data: any): void {
            const rgba: ColorRGBA64 = ColorRGBA64.fromObject(data.rgba)!;
            const palette: ColorPalette = new ColorPalette({
                baseColor: rgba,
                steps: data.palette.length,
            });

            for (let i: number = 0; i < data.palette.length; i++) {
                expect(palette.palette[i].r).to.be.closeTo(
                    data.palette[i].r,
                    testPrecision
                );
                expect(palette.palette[i].g).to.be.closeTo(
                    data.palette[i].g,
                    testPrecision
                );
                expect(palette.palette[i].b).to.be.closeTo(
                    data.palette[i].b,
                    testPrecision
                );
                expect(palette.palette[i].a).to.be.closeTo(
                    data.palette[i].a,
                    testPrecision
                );
            }
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("generateScaledPalettes", () => {
        const results1: {
            short: ColorRGBA64[];
            long: ColorRGBA64[];
        } = generateScaledPalettes(parseColorHexRGB("#d9b6f3"));

        expect(results1.short.length).to.equal(11);
        expect(results1.long.length).to.equal(63);

        expect(results1.short[0].toStringHexRGB()).to.equal("#f5e2ff");
        expect(results1.short[1].toStringHexRGB()).to.equal("#e7ccf9");
        expect(results1.short[2].toStringHexRGB()).to.equal("#d9b6f3");
        expect(results1.short[3].toStringHexRGB()).to.equal("#cca8e6");
        expect(results1.short[4].toStringHexRGB()).to.equal("#be9ad9");
        expect(results1.short[5].toStringHexRGB()).to.equal("#b18dcb");
        expect(results1.short[6].toStringHexRGB()).to.equal("#a37fbe");
        expect(results1.short[7].toStringHexRGB()).to.equal("#9671b1");
        expect(results1.short[8].toStringHexRGB()).to.equal("#8863a4");
        expect(results1.short[9].toStringHexRGB()).to.equal("#7b5597");
        expect(results1.short[10].toStringHexRGB()).to.equal("#6d488a");

        expect(results1.long[0].toStringHexRGB()).to.equal("#ffffff");
        expect(results1.long[1].toStringHexRGB()).to.equal("#fefcff");
        expect(results1.long[2].toStringHexRGB()).to.equal("#fdfaff");
        expect(results1.long[3].toStringHexRGB()).to.equal("#fcf7ff");
        expect(results1.long[4].toStringHexRGB()).to.equal("#fbf4ff");
        expect(results1.long[5].toStringHexRGB()).to.equal("#faf2ff");
        expect(results1.long[6].toStringHexRGB()).to.equal("#faefff");
        expect(results1.long[7].toStringHexRGB()).to.equal("#f9ecff");
        expect(results1.long[8].toStringHexRGB()).to.equal("#f8eaff");
        expect(results1.long[9].toStringHexRGB()).to.equal("#f7e7ff");
        expect(results1.long[10].toStringHexRGB()).to.equal("#f6e4ff");
        expect(results1.long[11].toStringHexRGB()).to.equal("#f5e2ff");
        expect(results1.long[12].toStringHexRGB()).to.equal("#f1dcfe");
        expect(results1.long[13].toStringHexRGB()).to.equal("#eed7fc");
        expect(results1.long[14].toStringHexRGB()).to.equal("#ead1fb");
        expect(results1.long[15].toStringHexRGB()).to.equal("#e7ccf9");
        expect(results1.long[16].toStringHexRGB()).to.equal("#e3c6f8");
        expect(results1.long[17].toStringHexRGB()).to.equal("#e0c1f6");
        expect(results1.long[18].toStringHexRGB()).to.equal("#dcbbf4");
        expect(results1.long[19].toStringHexRGB()).to.equal("#d9b6f3");
        expect(results1.long[20].toStringHexRGB()).to.equal("#d6b3f0");
        expect(results1.long[21].toStringHexRGB()).to.equal("#d2afec");
        expect(results1.long[22].toStringHexRGB()).to.equal("#cface9");
        expect(results1.long[23].toStringHexRGB()).to.equal("#cca8e6");
        expect(results1.long[24].toStringHexRGB()).to.equal("#c8a5e3");
        expect(results1.long[25].toStringHexRGB()).to.equal("#c5a1df");
        expect(results1.long[26].toStringHexRGB()).to.equal("#c19edc");
        expect(results1.long[27].toStringHexRGB()).to.equal("#be9ad9");
        expect(results1.long[28].toStringHexRGB()).to.equal("#bb97d5");
        expect(results1.long[29].toStringHexRGB()).to.equal("#b794d2");
        expect(results1.long[30].toStringHexRGB()).to.equal("#b490cf");
        expect(results1.long[31].toStringHexRGB()).to.equal("#b18dcb");
        expect(results1.long[32].toStringHexRGB()).to.equal("#ad89c8");
        expect(results1.long[33].toStringHexRGB()).to.equal("#aa86c5");
        expect(results1.long[34].toStringHexRGB()).to.equal("#a782c2");
        expect(results1.long[35].toStringHexRGB()).to.equal("#a37fbe");
        expect(results1.long[36].toStringHexRGB()).to.equal("#a07bbb");
        expect(results1.long[37].toStringHexRGB()).to.equal("#9c78b8");
        expect(results1.long[38].toStringHexRGB()).to.equal("#9974b4");
        expect(results1.long[39].toStringHexRGB()).to.equal("#9671b1");
        expect(results1.long[40].toStringHexRGB()).to.equal("#926eae");
        expect(results1.long[41].toStringHexRGB()).to.equal("#8f6aab");
        expect(results1.long[42].toStringHexRGB()).to.equal("#8c67a7");
        expect(results1.long[43].toStringHexRGB()).to.equal("#8863a4");
        expect(results1.long[44].toStringHexRGB()).to.equal("#8560a1");
        expect(results1.long[45].toStringHexRGB()).to.equal("#825c9d");
        expect(results1.long[46].toStringHexRGB()).to.equal("#7e599a");
        expect(results1.long[47].toStringHexRGB()).to.equal("#7b5597");
        expect(results1.long[48].toStringHexRGB()).to.equal("#775294");
        expect(results1.long[49].toStringHexRGB()).to.equal("#744f90");
        expect(results1.long[50].toStringHexRGB()).to.equal("#714b8d");
        expect(results1.long[51].toStringHexRGB()).to.equal("#6d488a");
        expect(results1.long[52].toStringHexRGB()).to.equal("#63417d");
        expect(results1.long[53].toStringHexRGB()).to.equal("#593b71");
        expect(results1.long[54].toStringHexRGB()).to.equal("#503464");
        expect(results1.long[55].toStringHexRGB()).to.equal("#462e58");
        expect(results1.long[56].toStringHexRGB()).to.equal("#3c274b");
        expect(results1.long[57].toStringHexRGB()).to.equal("#32213f");
        expect(results1.long[58].toStringHexRGB()).to.equal("#281a32");
        expect(results1.long[59].toStringHexRGB()).to.equal("#1e1426");
        expect(results1.long[60].toStringHexRGB()).to.equal("#140d19");
        expect(results1.long[61].toStringHexRGB()).to.equal("#0a070d");
        expect(results1.long[62].toStringHexRGB()).to.equal("#000000");

        const results2: {
            short: ColorRGBA64[];
            long: ColorRGBA64[];
        } = generateScaledPalettes(parseColorHexRGB("#006699"), 11, {
            targetSize: 63,
            spacing: 5,
            scaleColorLight: ColorPalette.defaultPaletteConfig.scaleColorLight,
            scaleColorDark: ColorPalette.defaultPaletteConfig.scaleColorDark,
        });

        expect(results2.short.length).to.equal(11);
        expect(results2.long.length).to.equal(63);

        expect(results2.short[0].toStringHexRGB()).to.equal("#91c9e3");
        expect(results2.short[1].toStringHexRGB()).to.equal("#7cbbd8");
        expect(results2.short[2].toStringHexRGB()).to.equal("#67acce");
        expect(results2.short[3].toStringHexRGB()).to.equal("#539ec3");
        expect(results2.short[4].toStringHexRGB()).to.equal("#3e90b9");
        expect(results2.short[5].toStringHexRGB()).to.equal("#2982ae");
        expect(results2.short[6].toStringHexRGB()).to.equal("#1574a4");
        expect(results2.short[7].toStringHexRGB()).to.equal("#006699");
        expect(results2.short[8].toStringHexRGB()).to.equal("#005083");
        expect(results2.short[9].toStringHexRGB()).to.equal("#003a6e");
        expect(results2.short[10].toStringHexRGB()).to.equal("#002358");

        expect(results2.long[0].toStringHexRGB()).to.equal("#ffffff");
        expect(results2.long[1].toStringHexRGB()).to.equal("#edf6fa");
        expect(results2.long[2].toStringHexRGB()).to.equal("#daedf6");
        expect(results2.long[3].toStringHexRGB()).to.equal("#c8e4f1");
        expect(results2.long[4].toStringHexRGB()).to.equal("#b5dbec");
        expect(results2.long[5].toStringHexRGB()).to.equal("#a3d2e8");
        expect(results2.long[6].toStringHexRGB()).to.equal("#91c9e3");
        expect(results2.long[7].toStringHexRGB()).to.equal("#8dc6e1");
        expect(results2.long[8].toStringHexRGB()).to.equal("#88c3df");
        expect(results2.long[9].toStringHexRGB()).to.equal("#84c0dd");
        expect(results2.long[10].toStringHexRGB()).to.equal("#80bddb");
        expect(results2.long[11].toStringHexRGB()).to.equal("#7cbbd8");
        expect(results2.long[12].toStringHexRGB()).to.equal("#78b8d6");
        expect(results2.long[13].toStringHexRGB()).to.equal("#74b5d4");
        expect(results2.long[14].toStringHexRGB()).to.equal("#70b2d2");
        expect(results2.long[15].toStringHexRGB()).to.equal("#6cafd0");
        expect(results2.long[16].toStringHexRGB()).to.equal("#67acce");
        expect(results2.long[17].toStringHexRGB()).to.equal("#63aacc");
        expect(results2.long[18].toStringHexRGB()).to.equal("#5fa7ca");
        expect(results2.long[19].toStringHexRGB()).to.equal("#5ba4c8");
        expect(results2.long[20].toStringHexRGB()).to.equal("#57a1c5");
        expect(results2.long[21].toStringHexRGB()).to.equal("#539ec3");
        expect(results2.long[22].toStringHexRGB()).to.equal("#4f9cc1");
        expect(results2.long[23].toStringHexRGB()).to.equal("#4a99bf");
        expect(results2.long[24].toStringHexRGB()).to.equal("#4696bd");
        expect(results2.long[25].toStringHexRGB()).to.equal("#4293bb");
        expect(results2.long[26].toStringHexRGB()).to.equal("#3e90b9");
        expect(results2.long[27].toStringHexRGB()).to.equal("#3a8db7");
        expect(results2.long[28].toStringHexRGB()).to.equal("#368bb5");
        expect(results2.long[29].toStringHexRGB()).to.equal("#3288b2");
        expect(results2.long[30].toStringHexRGB()).to.equal("#2d85b0");
        expect(results2.long[31].toStringHexRGB()).to.equal("#2982ae");
        expect(results2.long[32].toStringHexRGB()).to.equal("#257fac");
        expect(results2.long[33].toStringHexRGB()).to.equal("#217daa");
        expect(results2.long[34].toStringHexRGB()).to.equal("#1d7aa8");
        expect(results2.long[35].toStringHexRGB()).to.equal("#1977a6");
        expect(results2.long[36].toStringHexRGB()).to.equal("#1574a4");
        expect(results2.long[37].toStringHexRGB()).to.equal("#1171a1");
        expect(results2.long[38].toStringHexRGB()).to.equal("#0c6e9f");
        expect(results2.long[39].toStringHexRGB()).to.equal("#086c9d");
        expect(results2.long[40].toStringHexRGB()).to.equal("#04699b");
        expect(results2.long[41].toStringHexRGB()).to.equal("#006699");
        expect(results2.long[42].toStringHexRGB()).to.equal("#006295");
        expect(results2.long[43].toStringHexRGB()).to.equal("#005d90");
        expect(results2.long[44].toStringHexRGB()).to.equal("#00598c");
        expect(results2.long[45].toStringHexRGB()).to.equal("#005488");
        expect(results2.long[46].toStringHexRGB()).to.equal("#005083");
        expect(results2.long[47].toStringHexRGB()).to.equal("#004b7f");
        expect(results2.long[48].toStringHexRGB()).to.equal("#00477b");
        expect(results2.long[49].toStringHexRGB()).to.equal("#004276");
        expect(results2.long[50].toStringHexRGB()).to.equal("#003e72");
        expect(results2.long[51].toStringHexRGB()).to.equal("#003a6e");
        expect(results2.long[52].toStringHexRGB()).to.equal("#003569");
        expect(results2.long[53].toStringHexRGB()).to.equal("#003165");
        expect(results2.long[54].toStringHexRGB()).to.equal("#002c61");
        expect(results2.long[55].toStringHexRGB()).to.equal("#00285c");
        expect(results2.long[56].toStringHexRGB()).to.equal("#002358");
        expect(results2.long[57].toStringHexRGB()).to.equal("#001d49");
        expect(results2.long[58].toStringHexRGB()).to.equal("#00183b");
        expect(results2.long[59].toStringHexRGB()).to.equal("#00122c");
        expect(results2.long[60].toStringHexRGB()).to.equal("#000c1d");
        expect(results2.long[61].toStringHexRGB()).to.equal("#00060f");
        expect(results2.long[62].toStringHexRGB()).to.equal("#000000");
    });

    test("rescale", () => {
        const testPalette1: ColorPalette = generateOffCenterPalette(
            parseColorHexRGB("#320198"),
            11
        );

        const results1: ColorRGBA64[] = rescale(testPalette1.palette, 63, false);

        expect(results1[0].toStringHexRGB()).to.equal("#b49fe2");
        expect(results1[1].toStringHexRGB()).to.equal("#b19be1");
        expect(results1[2].toStringHexRGB()).to.equal("#ae98df");
        expect(results1[3].toStringHexRGB()).to.equal("#ab94dd");
        expect(results1[4].toStringHexRGB()).to.equal("#a891dc");
        expect(results1[5].toStringHexRGB()).to.equal("#a58dda");
        expect(results1[6].toStringHexRGB()).to.equal("#a289d8");
        expect(results1[7].toStringHexRGB()).to.equal("#9f86d6");
        expect(results1[8].toStringHexRGB()).to.equal("#9c82d5");
        expect(results1[9].toStringHexRGB()).to.equal("#997ed3");
        expect(results1[10].toStringHexRGB()).to.equal("#967bd1");
        expect(results1[11].toStringHexRGB()).to.equal("#9377d0");
        expect(results1[12].toStringHexRGB()).to.equal("#9073ce");
        expect(results1[13].toStringHexRGB()).to.equal("#8d70cc");
        expect(results1[14].toStringHexRGB()).to.equal("#8a6cca");
        expect(results1[15].toStringHexRGB()).to.equal("#8768c9");
        expect(results1[16].toStringHexRGB()).to.equal("#8465c7");
        expect(results1[17].toStringHexRGB()).to.equal("#8161c5");
        expect(results1[18].toStringHexRGB()).to.equal("#7e5ec4");
        expect(results1[19].toStringHexRGB()).to.equal("#7b5ac2");
        expect(results1[20].toStringHexRGB()).to.equal("#7856c0");
        expect(results1[21].toStringHexRGB()).to.equal("#7553be");
        expect(results1[22].toStringHexRGB()).to.equal("#724fbd");
        expect(results1[23].toStringHexRGB()).to.equal("#6f4bbb");
        expect(results1[24].toStringHexRGB()).to.equal("#6c48b9");
        expect(results1[25].toStringHexRGB()).to.equal("#6944b8");
        expect(results1[26].toStringHexRGB()).to.equal("#6640b6");
        expect(results1[27].toStringHexRGB()).to.equal("#633db4");
        expect(results1[28].toStringHexRGB()).to.equal("#6039b2");
        expect(results1[29].toStringHexRGB()).to.equal("#5d35b1");
        expect(results1[30].toStringHexRGB()).to.equal("#5a32af");
        expect(results1[31].toStringHexRGB()).to.equal("#572ead");
        expect(results1[32].toStringHexRGB()).to.equal("#542bac");
        expect(results1[33].toStringHexRGB()).to.equal("#5127aa");
        expect(results1[34].toStringHexRGB()).to.equal("#4e23a8");
        expect(results1[35].toStringHexRGB()).to.equal("#4b20a6");
        expect(results1[36].toStringHexRGB()).to.equal("#481ca5");
        expect(results1[37].toStringHexRGB()).to.equal("#4518a3");
        expect(results1[38].toStringHexRGB()).to.equal("#4215a1");
        expect(results1[39].toStringHexRGB()).to.equal("#3f11a0");
        expect(results1[40].toStringHexRGB()).to.equal("#3c0d9e");
        expect(results1[41].toStringHexRGB()).to.equal("#390a9c");
        expect(results1[42].toStringHexRGB()).to.equal("#36069a");
        expect(results1[43].toStringHexRGB()).to.equal("#330299");
        expect(results1[44].toStringHexRGB()).to.equal("#300196");
        expect(results1[45].toStringHexRGB()).to.equal("#2e0192");
        expect(results1[46].toStringHexRGB()).to.equal("#2b018e");
        expect(results1[47].toStringHexRGB()).to.equal("#28018b");
        expect(results1[48].toStringHexRGB()).to.equal("#260187");
        expect(results1[49].toStringHexRGB()).to.equal("#230183");
        expect(results1[50].toStringHexRGB()).to.equal("#20017f");
        expect(results1[51].toStringHexRGB()).to.equal("#1e017c");
        expect(results1[52].toStringHexRGB()).to.equal("#1b0178");
        expect(results1[53].toStringHexRGB()).to.equal("#180074");
        expect(results1[54].toStringHexRGB()).to.equal("#160071");
        expect(results1[55].toStringHexRGB()).to.equal("#13006d");
        expect(results1[56].toStringHexRGB()).to.equal("#100069");
        expect(results1[57].toStringHexRGB()).to.equal("#0d0065");
        expect(results1[58].toStringHexRGB()).to.equal("#0b0062");
        expect(results1[59].toStringHexRGB()).to.equal("#08005e");
        expect(results1[60].toStringHexRGB()).to.equal("#05005a");
        expect(results1[61].toStringHexRGB()).to.equal("#030057");
        expect(results1[62].toStringHexRGB()).to.equal("#000053");

        const results2: ColorRGBA64[] = rescale(testPalette1.palette, 63, true);

        expect(results2[0].toStringHexRGB()).to.equal("#b49fe2");
        expect(results2[1].toStringHexRGB()).to.equal("#b19be1");
        expect(results2[2].toStringHexRGB()).to.equal("#ae98df");
        expect(results2[3].toStringHexRGB()).to.equal("#ab94dd");
        expect(results2[4].toStringHexRGB()).to.equal("#a890db");
        expect(results2[5].toStringHexRGB()).to.equal("#a58cda");
        expect(results2[6].toStringHexRGB()).to.equal("#a289d8");
        expect(results2[7].toStringHexRGB()).to.equal("#9f85d6");
        expect(results2[8].toStringHexRGB()).to.equal("#9c81d4");
        expect(results2[9].toStringHexRGB()).to.equal("#987dd2");
        expect(results2[10].toStringHexRGB()).to.equal("#9579d1");
        expect(results2[11].toStringHexRGB()).to.equal("#9276cf");
        expect(results2[12].toStringHexRGB()).to.equal("#8f72cd");
        expect(results2[13].toStringHexRGB()).to.equal("#8c6fcc");
        expect(results2[14].toStringHexRGB()).to.equal("#8a6cca");
        expect(results2[15].toStringHexRGB()).to.equal("#8768c9");
        expect(results2[16].toStringHexRGB()).to.equal("#8465c7");
        expect(results2[17].toStringHexRGB()).to.equal("#8262c6");
        expect(results2[18].toStringHexRGB()).to.equal("#7f5fc4");
        expect(results2[19].toStringHexRGB()).to.equal("#7c5bc2");
        expect(results2[20].toStringHexRGB()).to.equal("#7958c1");
        expect(results2[21].toStringHexRGB()).to.equal("#7654bf");
        expect(results2[22].toStringHexRGB()).to.equal("#7350bd");
        expect(results2[23].toStringHexRGB()).to.equal("#704cbb");
        expect(results2[24].toStringHexRGB()).to.equal("#6d49ba");
        expect(results2[25].toStringHexRGB()).to.equal("#6a45b8");
        expect(results2[26].toStringHexRGB()).to.equal("#6741b6");
        expect(results2[27].toStringHexRGB()).to.equal("#643db4");
        expect(results2[28].toStringHexRGB()).to.equal("#6139b3");
        expect(results2[29].toStringHexRGB()).to.equal("#5d36b1");
        expect(results2[30].toStringHexRGB()).to.equal("#5a32af");
        expect(results2[31].toStringHexRGB()).to.equal("#572ead");
        expect(results2[32].toStringHexRGB()).to.equal("#542aab");
        expect(results2[33].toStringHexRGB()).to.equal("#5127aa");
        expect(results2[34].toStringHexRGB()).to.equal("#4e23a8");
        expect(results2[35].toStringHexRGB()).to.equal("#4b1fa6");
        expect(results2[36].toStringHexRGB()).to.equal("#481ba4");
        expect(results2[37].toStringHexRGB()).to.equal("#4518a3");
        expect(results2[38].toStringHexRGB()).to.equal("#4214a1");
        expect(results2[39].toStringHexRGB()).to.equal("#3e109f");
        expect(results2[40].toStringHexRGB()).to.equal("#3b0c9d");
        expect(results2[41].toStringHexRGB()).to.equal("#38099c");
        expect(results2[42].toStringHexRGB()).to.equal("#35059a");
        expect(results2[43].toStringHexRGB()).to.equal("#320198");
        expect(results2[44].toStringHexRGB()).to.equal("#300195");
        expect(results2[45].toStringHexRGB()).to.equal("#2d0191");
        expect(results2[46].toStringHexRGB()).to.equal("#2b018e");
        expect(results2[47].toStringHexRGB()).to.equal("#28018b");
        expect(results2[48].toStringHexRGB()).to.equal("#260188");
        expect(results2[49].toStringHexRGB()).to.equal("#240184");
        expect(results2[50].toStringHexRGB()).to.equal("#210181");
        expect(results2[51].toStringHexRGB()).to.equal("#1f017d");
        expect(results2[52].toStringHexRGB()).to.equal("#1c0179");
        expect(results2[53].toStringHexRGB()).to.equal("#190075");
        expect(results2[54].toStringHexRGB()).to.equal("#160072");
        expect(results2[55].toStringHexRGB()).to.equal("#13006e");
        expect(results2[56].toStringHexRGB()).to.equal("#11006a");
        expect(results2[57].toStringHexRGB()).to.equal("#0e0066");
        expect(results2[58].toStringHexRGB()).to.equal("#0b0062");
        expect(results2[59].toStringHexRGB()).to.equal("#08005e");
        expect(results2[60].toStringHexRGB()).to.equal("#06005b");
        expect(results2[61].toStringHexRGB()).to.equal("#030057");
        expect(results2[62].toStringHexRGB()).to.equal("#000053");
    });
});
