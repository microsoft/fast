import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { BareControlPlugin } from "./plugin.control.bare";
/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
describe("BareControlPlugin", () => {
    test("should not throw", () => {
        const plugin = new BareControlPlugin({
            control: jest.fn(),
        });
        expect(() => {
            mount(plugin.render());
        }).not.toThrow();
    });
    test("should render a BareControlTemplate", () => {
        const plugin = new BareControlPlugin({
            control: jest.fn(),
        });
        const render = mount(plugin.render());
        expect(render.find("BareControlTemplate")).toHaveLength(1);
    });
});
