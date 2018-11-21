import JSS, { create, SheetsManager, SheetsRegistry } from "jss";
import presets from "jss-preset-default";

/**
 * We should type these more accurately when JSS implements typings, but for now
 * we should explicitly type these as any so that projects using the
 * "noImplicitAny" compiler flag don't throw when they define jss types
 * https://github.com/Microsoft/fast-dna/issues/1155
 */
const jss: any = create(presets());
const stylesheetManager: any = new SheetsManager();
const stylesheetRegistry: any = new SheetsRegistry();

export { jss, stylesheetManager, stylesheetRegistry };
