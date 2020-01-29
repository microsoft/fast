import { Plugin, PluginProps } from "../../index";

export default class MapBooleanPropToString extends Plugin<PluginProps> {
    public resolver(data: boolean): string {
        return data.toString();
    }
}
