import { parseQueryStringParams } from "./query";

describe("parseQueryStringParams", (): void => {
    test("basic query string", (): void => {
        const params: Map<string, string> = parseQueryStringParams(
            "www.microsoft.com?a=12345&b=qwerty"
        );

        expect(params.size).toBe(2);
        expect(params.get("a")).toBe("12345");
        expect(params.get("b")).toBe("qwerty");
    });

    test("query string not part of a full url", (): void => {
        const params: Map<string, string> = parseQueryStringParams("a=12345&b=qwerty");

        expect(params.size).toBe(2);
        expect(params.get("a")).toBe("12345");
        expect(params.get("b")).toBe("qwerty");
    });

    test("query string with encoding", (): void => {
        const params: Map<string, string> = parseQueryStringParams(
            "www.microsoft.com?a=urabitur+quis+convallis+est%2C+ut+varius+magna.+Aenean+eget+venenatis+neque.+Sed+ut+felis+nec+diam+accumsan+ullamcorper.+Nunc+dignissim+lectus+enim%2C+sed+aliquet+elit+fermentum+vitae.+Cras+ipsum+lectus%2C+hendrerit+tempus+ligula+sed%2C+auctor+elementum+est.+Praesent+nunc+augue%2C+porta+in+neque+sed%2C+bibendum+pharetra+est.+Fusce+enim+massa%2C+laoreet+eget+ornare+at%2C+auctor+vitae+justo.+Nullam+tincidunt+tristique+diam%2C+nec+efficitur+lacus+iaculis+quis.+Donec+id+lacus+ipsum.+Vivamus+laoreet+tincidunt+fermentum.+Proin+arcu+nisi%2C+fringilla+a+accumsan+id%2C+rutrum+ut+risus.+Duis+accumsan%2C+elit+placerat+lacinia+finibus%2C+metus+leo+vehicula+enim%2C+id+lobortis+mi+nisi+et+nisi."
        );

        expect(params.size).toBe(1);
        expect(params.get("a")).toBe(
            "urabitur quis convallis est, ut varius magna. Aenean eget venenatis neque. Sed ut felis nec diam accumsan ullamcorper. Nunc dignissim lectus enim, sed aliquet elit fermentum vitae. Cras ipsum lectus, hendrerit tempus ligula sed, auctor elementum est. Praesent nunc augue, porta in neque sed, bibendum pharetra est. Fusce enim massa, laoreet eget ornare at, auctor vitae justo. Nullam tincidunt tristique diam, nec efficitur lacus iaculis quis. Donec id lacus ipsum. Vivamus laoreet tincidunt fermentum. Proin arcu nisi, fringilla a accumsan id, rutrum ut risus. Duis accumsan, elit placerat lacinia finibus, metus leo vehicula enim, id lobortis mi nisi et nisi."
        );
    });

    test("undefined or empty input should return an empty Map", (): void => {
        const params1: Map<string, string> = parseQueryStringParams("");
        expect(params1.size).toBe(0);
        const params2: Map<string, string> = parseQueryStringParams(undefined);
        expect(params2.size).toBe(0);
    });

    test("gibberish input should return an empty Map", (): void => {
        const params: Map<string, string> = parseQueryStringParams(
            "qwertyuiopasdfghjklzxcvbnm"
        );

        expect(params.size).toBe(0);
    });
});
