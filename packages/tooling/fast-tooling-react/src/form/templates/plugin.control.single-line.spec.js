import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { SingleLineControlPlugin } from "./plugin.control.single-line";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
describe("SingleLineControlPlugin", () => {
    test("should not throw", () => {
        const plugin = new SingleLineControlPlugin({
            control: jest.fn(),
        });
        expect(() => {
            mount(plugin.render());
        }).not.toThrow();
    });
    test("should render a SingleLineControlTemplate", () => {
        const plugin = new SingleLineControlPlugin({
            control: jest.fn(),
        });
        const render = mount(plugin.render());
        expect(render.find("SingleLineControlTemplate")).toHaveLength(1);
    });
});
