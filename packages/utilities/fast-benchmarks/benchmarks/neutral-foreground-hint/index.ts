import {
    fastDesignSystemDefaults,
    neutralForegroundHint,
} from "@microsoft/fast-components";

export default new Benchmark(() => {
    fastDesignSystemDefaults.neutralPalette.forEach((x: string) => {
        neutralForegroundHint({ ...fastDesignSystemDefaults, backgroundColor: x });
    });
});
