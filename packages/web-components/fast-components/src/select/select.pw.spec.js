var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import { ArrowKeys } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
describe("FASTSelect", function () {
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page && !this.browser) {
                this.skip();
            }
            this.documentHandle = yield this.page.evaluateHandle(() => document);
            this.setupHandle = yield this.page.evaluateHandle(document => {
                const element = document.createElement("fast-select");
                for (let i = 1; i <= 3; i++) {
                    const option = document.createElement("fast-option");
                    option.value = `${i}`;
                    option.textContent = `option ${i}`;
                    element.appendChild(option);
                }
                document.body.appendChild(element);
            }, this.documentHandle);
        });
    });
    afterEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.setupHandle) {
                yield this.setupHandle.dispose();
            }
        });
    });
    // FASTSelect should render on the page
    it("should render on the page", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.page.waitForSelector("fast-select");
            expect(element).to.exist;
        });
    });
    // FASTSelect should have a value of 'one'
    it("should have a value of 'one'", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.page.waitForSelector("fast-select");
            expect(
                yield element === null || element === void 0
                    ? void 0
                    : element.evaluate(node => node.value)
            ).to.equal("1");
        });
    });
    // FASTSelect should have a text content of 'option 1'
    it("should have a text content of 'option 1'", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.page.waitForSelector(
                "fast-select .selected-value"
            );
            expect(
                yield element === null || element === void 0
                    ? void 0
                    : element.evaluate(node => node.innerText)
            ).to.equal("option 1");
        });
    });
    // FASTSelect should open when focused and receives keyboard interaction
    describe("should open when focused and receives keyboard interaction", function () {
        // FASTSelect should open when focused and receives keyboard interaction via space key
        it("via Space key", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const element = yield this.page.waitForSelector("fast-select");
                expect(yield element.evaluate(node => node.open)).to.be.false;
                yield element.focus();
                yield this.page.keyboard.press(" ");
                expect(yield element.evaluate(node => node.open)).to.be.true;
                yield this.page.keyboard.press(" ");
                expect(yield element.evaluate(node => node.open)).to.be.false;
            });
        });
        // FASTSelect should open when focused and receives keyboard interaction via enter key
        it("via Enter key", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const element = yield this.page.waitForSelector("fast-select");
                expect(yield element.evaluate(node => node.open)).to.be.false;
                yield element.focus();
                yield element.press("Enter");
                expect(yield element.evaluate(node => node.open)).to.be.true;
                yield element.press("Enter");
                expect(yield element.evaluate(node => node.open)).to.be.false;
            });
        });
    });
    // FASTSelect should close
    describe("should close", function () {
        // FASTSelect should close when focused and keyboard interaction is received
        describe("when focused and keyboard interaction is received", function () {
            // FASTSelect should close when focused and keyboard interaction is received via space key
            it("via Space key", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const element = yield this.page.waitForSelector("fast-select");
                    yield element.press(" ");
                    expect(yield element.evaluate(node => node.open)).to.be.true;
                    yield element.press(" ");
                    expect(yield element.evaluate(node => node.open)).to.be.false;
                });
            });
            // FASTSelect should close when focused and keyboard interaction is received via enter key
            it("via Enter key", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const element = yield this.page.waitForSelector("fast-select");
                    yield element.press("Enter");
                    expect(yield element.evaluate(node => node.open)).to.be.true;
                    yield element.press("Enter");
                    expect(yield element.evaluate(node => node.open)).to.be.false;
                });
            });
            // FASTSelect should close when focused and keyboard interaction is received via escape key
            it("via Escape key", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const element = yield this.page.waitForSelector("fast-select");
                    yield element.click();
                    expect(yield element.evaluate(node => node.open)).to.be.true;
                    yield this.page.keyboard.press("Escape");
                    expect(yield element.evaluate(node => node.open)).to.be.false;
                });
            });
            // FASTSelect should close when focused and keyboard interaction is received via tab key
            it("via Tab key", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const element = yield this.page.waitForSelector("fast-select");
                    yield element.click();
                    expect(yield element.evaluate(node => node.open)).to.be.true;
                    yield element.press("Tab");
                    expect(yield element.evaluate(node => node.open)).to.be.false;
                });
            });
        });
        describe("when focus is lost", function () {
            it("via click", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const element = yield this.page.waitForSelector("fast-select");
                    yield element.click();
                    expect(yield element.evaluate(node => node.open)).to.be.true;
                    yield this.page.click("body");
                    expect(
                        yield this.page.evaluate(
                            element => element.isSameNode(document.activeElement),
                            element
                        )
                    ).to.be.false;
                    expect(yield element.evaluate(node => node.open)).to.be.false;
                });
            });
        });
    });
    describe("should emit an event when focused and receives keyboard interaction", function () {
        describe("while closed", function () {
            for (const direction of Object.values(ArrowKeys)) {
                describe(`via ${direction} key`, function () {
                    for (const eventName of ["change", "input"]) {
                        it(`of type '${eventName}'`, function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                const element = yield this.page.waitForSelector(
                                    "fast-select"
                                );
                                yield this.page.exposeFunction("sendEvent", type =>
                                    expect(type).to.equal(eventName)
                                );
                                yield element.evaluate((node, eventName) => {
                                    node.addEventListener(eventName, e =>
                                        __awaiter(this, void 0, void 0, function* () {
                                            return yield window["sendEvent"](e.type);
                                        })
                                    );
                                }, eventName);
                                yield element.press(direction);
                            });
                        });
                    }
                });
            }
        });
    });
    describe("should change the value when focused and receives keyboard interaction", function () {
        it("via arrow down key", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const element = yield this.page.waitForSelector("fast-select");
                expect(yield element.evaluate(node => node.value)).to.equal("1");
                yield element.press("ArrowDown");
                expect(yield element.evaluate(node => node.value)).to.equal("2");
            });
        });
        it("via arrow up key", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const element = yield this.page.waitForSelector("fast-select");
                yield element.evaluate(node => (node.value = "2"));
                expect(yield element.evaluate(node => node.value)).to.equal("2");
                yield element.press("ArrowUp");
                expect(yield element.evaluate(node => node.value)).to.equal("1");
            });
        });
        it("via home key", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const element = yield this.page.waitForSelector("fast-select");
                yield element.evaluate(node => (node.value = "3"));
                expect(yield element.evaluate(node => node.value)).to.equal("3");
                yield element.press("Home");
                expect(yield element.evaluate(node => node.value)).to.equal("1");
            });
        });
        it("via end key", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const element = yield this.page.waitForSelector("fast-select");
                expect(yield element.evaluate(node => node.value)).to.equal("1");
                yield element.press("End");
                expect(yield element.evaluate(node => node.value)).to.equal("3");
            });
        });
    });
    describe("when opened", function () {
        it("should scroll the selected option into view", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const element = yield this.page.waitForSelector("fast-select");
                yield element.evaluate(element => {
                    element.innerHTML = "";
                    for (let i = 0; i < 50; i++) {
                        const option = document.createElement("fast-option");
                        option.value = `${i}`;
                        option.textContent = `option ${i}`;
                        element.appendChild(option);
                    }
                });
                const selectedOption = yield element.$(".listbox");
                yield element.evaluate(node => (node.selectedIndex = 35));
                expect(
                    yield element.evaluate(node => node.firstSelectedOption.value)
                ).to.equal("35");
                yield element.click();
                yield selectedOption.waitForElementState("visible");
                expect(
                    yield selectedOption.evaluate(node => node.scrollTop)
                ).to.be.closeTo(811, 16);
                yield element.evaluate(node => (node.selectedIndex = 0));
                yield element.waitForElementState("stable");
                expect(
                    yield selectedOption.evaluate(node => node.scrollTop)
                ).to.be.closeTo(6, 16);
            });
        });
    });
});
