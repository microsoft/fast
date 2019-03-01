import { Plugin, PluginProps } from "../../";

export default class MapArrayPropToObject extends Plugin<PluginProps> {
    public resolver(data: string[]): any {
        const arrayToObject: any = {};

        data.forEach(
            (arrayItem: string, index: number): void => {
                arrayToObject[arrayItem] = index;
            }
        );

        return arrayToObject;
    }
}
