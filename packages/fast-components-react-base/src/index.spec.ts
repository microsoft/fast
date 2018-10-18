import * as Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import * as fs from "fs";
import * as path from "path";

configure({adapter: new Adapter()});

describe("index.ts component exports", (): void => {
    test("All components have respective class exports in index.ts", () => {
        const isDirectory: any = (source: any): any => fs.lstatSync(source).isDirectory();
        const getDirectories: any = (source: any): any =>
            fs.readdirSync(source).map((name: any) => path.join(source, name)).filter(isDirectory);
        const srcDir: string[] = getDirectories("src");
        const components: string[] = [];
        const index: any = path.resolve(__dirname, "index.ts");

        srcDir.forEach((entry: string) => {
            components.push(entry.slice(4).replace(/-/g, ""));
        });

        const data: any = fs.readFileSync(index, "UTF-8");
        const found: any = [];
        const rxp: RegExp = /{([^}]+)}/g;
        let curMatch: any;

        /* tslint:disable-next-line */
        while (curMatch = rxp.exec(data.split("\n"))) {
            found.push(curMatch[1].replace(/\s/g, "").toLowerCase());
        }

        const missingExports: any = components.filter((component: string) => !found.includes(component));

        expect(missingExports).toEqual([]);
    });
});
