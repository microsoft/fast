import { fastDesignSystemDefaults, neutralDividerRest } from "@microsoft/fast-components";

export default new Benchmark(() => {
    fastDesignSystemDefaults.neutralPalette.forEach((x: string) => {
        neutralDividerRest({ ...fastDesignSystemDefaults, backgroundColor: x });
    });
});
