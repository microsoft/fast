import JSS, { create, SheetsManager, SheetsRegistry} from "jss";
import presets from "jss-preset-default";

const jss: JSS = create(presets());
const stylesheetManager: SheetsManager = new SheetsManager();
const stylesheetRegistry = new SheetsRegistry();


export default jss;
export { stylesheetManager, stylesheetRegistry };
