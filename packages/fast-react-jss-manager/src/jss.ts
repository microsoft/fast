import { create, SheetsManager } from "jss";
import presets from "jss-preset-default";

const jss = create(presets);
const stylesheetManager = new SheetsManager();

export default jss;
export { stylesheetManager };
