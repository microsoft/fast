import { expect } from "chai";
import { parseQueryStringParams } from "./query";

describe("parseQueryStringParams", (): void => {
    it("basic query string", (): void => {
        const params: Map<string, string> = parseQueryStringParams(
            "www.microsoft.com?a=12345&b=qwerty"
        );

        expect(params.size).to.equal(2);
        expect(params.get("a")).to.equal("12345");
        expect(params.get("b")).to.equal("qwerty");
    });

    it("query string not part of a full url", (): void => {
        const params: Map<string, string> = parseQueryStringParams("a=12345&b=qwerty");

        expect(params.size).to.equal(2);
        expect(params.get("a")).to.equal("12345");
        expect(params.get("b")).to.equal("qwerty");
    });

    it("query string with encoding", (): void => {
        const params: Map<string, string> = parseQueryStringParams(
            "www.microsoft.com?a=CHAPTER%201.%20Loomings.%20Call%20me%20Ishmael.%20Some%20years%20ago%E2%80%94never%20mind%20how%20long%20precisely%E2%80%94having%20little%20or%20no%20money%20in%20my%20purse%2C%20and%20nothing%20particular%20to%20interest%20me%20on%20shore%2C%20I%20thought%20I%20would%20sail%20about%20a%20little%20and%20see%20the%20watery%20part%20of%20the%20world.%20It%20is%20a%20way%20I%20have%20of%20driving%20off%20the%20spleen%20and%20regulating%20the%20circulation.%20Whenever%20I%20find%20myself%20growing%20grim%20about%20the%20mouth%3B%20whenever%20it%20is%20a%20damp%2C%20drizzly%20November%20in%20my%20soul%3B%20whenever%20I%20find%20myself%20involuntarily%20pausing%20before%20coffin%20warehouses%2C%20and%20bringing%20up%20the%20rear%20of%20every%20funeral%20I%20meet%3B%20and%20especially%20whenever%20my%20hypos%20get%20such%20an%20upper%20hand%20of%20me%2C%20that%20it%20requires%20a%20strong%20moral%20principle%20to%20prevent%20me%20from%20deliberately%20stepping%20into%20the%20street%2C%20and%20methodically%20knocking%20people%E2%80%99s%20hats%20off%E2%80%94then%2C%20I%20account%20it%20high%20time%20to%20get%20to%20sea%20as%20soon%20as%20I%20can.%20This%20is%20my%20substitute%20for%20pistol%20and%20ball.%20With%20a%20philosophical%20flourish%20Cato%20throws%20himself%20upon%20his%20sword%3B%20I%20quietly%20take%20to%20the%20ship.%20There%20is%20nothing%20surprising%20in%20this.%20If%20they%20but%20knew%20it%2C%20almost%20all%20men%20in%20their%20degree%2C%20some%20time%20or%20other%2C%20cherish%20very%20nearly%20the%20same%20feelings%20towards%20the%20ocean%20with%20me."
        );

        expect(params.size).to.equal(1);
        expect(params.get("a")).to.equal(
            "CHAPTER 1. Loomings. Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me."
        );
    });

    it("undefined or empty input should return an empty Map", (): void => {
        const params1: Map<string, string> = parseQueryStringParams("");
        expect(params1.size).to.equal(0);
        const params2: Map<string, string> = parseQueryStringParams(undefined);
        expect(params2.size).to.equal(0);
    });

    it("gibberish input should return an empty Map", (): void => {
        const params: Map<string, string> = parseQueryStringParams(
            "qwertyuiopasdfghjklzxcvbnm"
        );

        expect(params.size).to.equal(0);
    });
});
