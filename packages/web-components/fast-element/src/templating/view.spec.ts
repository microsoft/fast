import chai, { expect } from "chai";
import spies from "chai-spies";
import { HTMLView } from "./view";

chai.use(spies);

describe("The HTMLView", () => {
	describe("disposeContiguousBatch", () => {
		function createViewWithDisposeSpy(onDispose: () => void) {
			const fragment = document.createDocumentFragment();
			fragment.appendChild(document.createComment("start"));
			fragment.appendChild(document.createComment("end"));

			const view = new HTMLView(fragment, []);
			const disposeSpy = chai.spy(onDispose);
			chai.spy.on(view, "dispose", disposeSpy);

			return { view, disposeSpy };
		}

		it("returns without throwing when given an empty batch", () => {
			expect(() => HTMLView.disposeContiguousBatch([])).not.to.throw();
		});

		it("disposes each view in the provided batch", () => {
			const view1 = createViewWithDisposeSpy(() => {});
			const view2 = createViewWithDisposeSpy(() => {});
			const view3 = createViewWithDisposeSpy(() => {});
			const views = [
				view1.view,
				view2.view,
				view3.view,
			];

			HTMLView.disposeContiguousBatch(views);

			expect(view1.disposeSpy).to.have.been.called.once;
			expect(view2.disposeSpy).to.have.been.called.once;
			expect(view3.disposeSpy).to.have.been.called.once;
		});
	});
});
