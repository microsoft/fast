import { SelectDevice as BaseSelectDevice } from "./select-device.base";
import manageJss from "@microsoft/fast-jss-manager-react";
import SelectDeviceStyles from "./select-device.style";
/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const SelectDevice = manageJss(SelectDeviceStyles)(BaseSelectDevice);
export { SelectDevice };
