import getStaticStyles from "./get-static-styles";

const styles: any = {
    color: "red",
    background: (): string => {
        return "green";
    }
};

const staticStyles: any = getStaticStyles(styles);

describe("Get static styles", (): void => {
    test("Returns a single the static style", (): void => {
        expect((staticStyles as any).color).toBe("red");
    });
    test("Does not return the dynamic style", () => {
        expect((staticStyles as any).background).toBeFalsy();
    });
});
