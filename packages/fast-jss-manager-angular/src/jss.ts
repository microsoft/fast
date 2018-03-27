import JSS, { create, SheetsManager } from "jss";
import presets from "jss-preset-default";

const jss: JSS = create(presets());
const stylesheetManager: SheetsManager = new SheetsManager();

export default jss;
export { stylesheetManager };
